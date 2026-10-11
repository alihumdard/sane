<?php

namespace App\Services;

use App\Enums\StatutCandidature;
use App\Exceptions\CandidatureImpossibleException;
use App\Models\Candidature;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

/** Creating, withdrawing and re-staging an application. */
class GestionCandidatures
{
    public function postuler(
        ProfilDemandeur $profil,
        OffreEmploi $offre,
        ?string $lettre = null,
        ?int $cvDocumentId = null,
    ): Candidature {
        if (! $offre->ouverte) {
            throw new CandidatureImpossibleException(
                "Cette offre n'accepte plus de candidatures."
            );
        }

        try {
            return DB::transaction(function () use ($profil, $offre, $lettre, $cvDocumentId) {
                $candidature = Candidature::create([
                    'reference' => Candidature::genererReference(),
                    'offre_id' => $offre->id,
                    'profil_id' => $profil->id,
                    'statut' => StatutCandidature::Envoyee,
                    'lettre_motivation' => $lettre,
                    'cv_document_id' => $cvDocumentId,
                    'statut_modifie_le' => now(),
                ]);

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

        return $candidature->refresh();
    }

    private function estViolationUnicite(QueryException $e): bool
    {
        // 23505 = unique_violation (Postgres), 1062 = duplicate entry (MySQL).
        return in_array($e->getCode(), ['23505', '23000'], true)
            || str_contains($e->getMessage(), '1062');
    }
}
