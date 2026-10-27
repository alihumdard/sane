<?php

namespace App\Services;

use App\Enums\StatutCandidature;
use App\Exceptions\CandidatureImpossibleException;
use App\Models\Candidature;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/** Creating, withdrawing and re-staging an application. */
class GestionCandidatures
{
    public function __construct(
        private readonly Notificateur $notificateur,
    ) {}

    public function postuler(
        ProfilDemandeur $profil,
        OffreEmploi $offre,
        ?string $lettre = null,
        ?int $cvDocumentId = null,
        ?string $reponse1 = null,
        ?string $reponse2 = null,
    ): Candidature {
        if (! $offre->ouverte) {
            throw new CandidatureImpossibleException(
                "Cette offre n'accepte plus de candidatures."
            );
        }

        $this->verifierProfilComplet($profil, $cvDocumentId);

        try {
            return DB::transaction(function () use ($profil, $offre, $lettre, $cvDocumentId, $reponse1, $reponse2) {
                $candidature = Candidature::create([
                    // Replaced below with the id-derived reference.
                    'reference' => (string) Str::uuid(),
                    'offre_id' => $offre->id,
                    'profil_id' => $profil->id,
                    'statut' => StatutCandidature::Envoyee,
                    'lettre_motivation' => $lettre,
                    'reponse_1' => $reponse1,
                    'reponse_2' => $reponse2,
                    'cv_document_id' => $cvDocumentId,
                    'statut_modifie_le' => now(),
                ]);

                $candidature->update(['reference' => $candidature->construireReference()]);

                // Incremented in SQL rather than read-modify-write, so parallel
                // applications to the same offer cannot lose a count.
                OffreEmploi::whereKey($offre->id)->increment('candidatures_count');

                return $candidature;
            });
        } catch (QueryException $e) {
            // The unique(offre_id, profil_id) index is the real guard: two
            // simultaneous submissions both pass an existence check, only one
            // survives the insert.
            if ($this->estViolationUnicite($e)) {
                throw new CandidatureImpossibleException(
                    'Vous avez déjà postulé à cette offre.'
                );
            }

            throw $e;
        }
    }

    public function retirer(Candidature $candidature): void
    {
        if (! $candidature->statut->peutEtreRetiree()) {
            throw new CandidatureImpossibleException(
                'Cette candidature a déjà été traitée et ne peut plus être retirée.'
            );
        }

        DB::transaction(function () use ($candidature) {
            OffreEmploi::whereKey($candidature->offre_id)
                ->where('candidatures_count', '>', 0)
                ->decrement('candidatures_count');

            $candidature->delete();
        });
    }

    public function changerStatut(Candidature $candidature, StatutCandidature $statut): Candidature
    {
        $candidature->update([
            'statut' => $statut,
            'statut_modifie_le' => now(),
        ]);

        $candidature->loadMissing('profil.user', 'offre');

        if ($utilisateur = $candidature->profil->user ?? null) {
            $this->notificateur->notifier(
                $utilisateur,
                'Candidature mise à jour',
                sprintf('Votre candidature pour « %s » est maintenant « %s ».', $candidature->offre->titre, $statut->label()),
                '/dashboard/participant',
                'candidature',
            );
        }

        return $candidature->refresh();
    }

    /**
     * A CV and at least one qualification, before anything is sent.
     *
     * Without this a visitor could create an account and apply the same
     * minute, and the recruiter opened a candidature holding a name and
     * nothing else — no CV to read, no schooling, nothing to decide on. A
     * reviewer watched someone do exactly that.
     *
     * Checked here rather than in the request so it holds wherever an
     * application is created from.
     */
    private function verifierProfilComplet(ProfilDemandeur $profil, ?int $cvDocumentId): void
    {
        $manquants = [];

        // Either the CV named by this application, or the one on the profile.
        if (! $cvDocumentId && ! $profil->cv()) {
            $manquants[] = 'un CV';
        }

        if (! $profil->formations()->exists()) {
            $manquants[] = 'au moins une formation';
        }

        if ($manquants === []) {
            return;
        }

        throw new CandidatureImpossibleException(
            'Complétez votre profil avant de postuler : il vous manque '
            .implode(' et ', $manquants).'.'
        );
    }

    private function estViolationUnicite(QueryException $e): bool
    {
        // 23505 = unique_violation (Postgres), 1062 = duplicate entry (MySQL).
        return in_array($e->getCode(), ['23505', '23000'], true)
            || str_contains($e->getMessage(), '1062');
    }
}
