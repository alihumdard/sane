<?php

namespace App\Services;

use App\Enums\StatutCandidature;
use App\Enums\StatutEntretien;
use App\Exceptions\EntretienImpossibleException;
use App\Mail\EntretienAnnule;
use App\Mail\EntretienConfirme;
use App\Mail\EntretienPropose;
use App\Models\Candidature;
use App\Models\CreneauEntretien;
use App\Models\Entretien;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/** Scheduling, confirming and cancelling interviews. */
class GestionEntretiens
{
    public function __construct(
        private readonly Notificateur $notificateur,
        private readonly GestionCandidatures $candidatures,
    ) {}

    /**
     * Books a slot for an application and invites the candidate.
     *
     * The slot is claimed with a conditional UPDATE rather than a read-then-
     * write: two recruiters offering the same slot at once would both pass an
     * availability check, and only one may win.
     */
    public function proposer(
        Candidature $candidature,
        CreneauEntretien $creneau,
        ?string $lienVisio = null,
    ): Entretien {
        if ($creneau->entreprise_id !== $candidature->offre->entreprise_id) {
            throw new EntretienImpossibleException(
                "Ce créneau n'appartient pas à votre entreprise."
            );
        }

        if ($creneau->estPasse()) {
            throw new EntretienImpossibleException('Ce créneau est déjà passé.');
        }

        if ($this->aUnEntretienActif($candidature)) {
            throw new EntretienImpossibleException(
                'Un entretien est déjà planifié pour cette candidature.'
            );
        }

        $entretien = DB::transaction(function () use ($candidature, $creneau, $lienVisio) {
            $reserve = CreneauEntretien::whereKey($creneau->id)
                ->where('reserve', false)
                ->update(['reserve' => true]);

            if ($reserve === 0) {
                throw new EntretienImpossibleException('Ce créneau vient d\'être réservé.');
            }

            $entretien = Entretien::create([
                // Replaced below with the id-derived reference.
                'reference' => (string) Str::uuid(),
                'candidature_id' => $candidature->id,
                'creneau_id' => $creneau->id,
                'statut' => StatutEntretien::EnAttente,
                'lien_visio' => $lienVisio,
            ]);

            $entretien->update(['reference' => $entretien->construireReference()]);

            // Scheduling an interview is itself a stage of the application.
            $this->candidatures->changerStatut($candidature, StatutCandidature::Entretien);

            return $entretien;
        });

        $entretien->load(['creneau', 'candidature.offre.entreprise', 'candidature.profil.user']);

        $this->notificateur->envoyer(
            new EntretienPropose($entretien),
            ['entretien' => $entretien->reference]
        );

        if ($utilisateur = $entretien->candidature->profil->user ?? null) {
            $this->notificateur->notifier(
                $utilisateur,
                'Entretien proposé',
                sprintf('Un entretien vous a été proposé pour « %s ».', $entretien->candidature->offre->titre),
                '/dashboard/entretiens',
                'entretien',
            );
        }

        return $entretien;
    }

    /** The candidate accepts. */
    public function confirmer(Entretien $entretien): Entretien
    {
        $this->exigerModifiable($entretien);

        $entretien->update([
            'statut' => StatutEntretien::Confirme,
            'confirme_le' => now(),
        ]);

        $entretien->load(['creneau', 'candidature.offre.entreprise', 'candidature.profil.user']);

        $this->notificateur->envoyer(
            new EntretienConfirme($entretien),
            ['entretien' => $entretien->reference]
        );

        return $entretien;
    }

    /** Either side may cancel; the slot returns to the pool. */
    public function annuler(Entretien $entretien, ?string $motif = null): Entretien
    {
        $this->exigerModifiable($entretien);

        DB::transaction(function () use ($entretien, $motif) {
            $entretien->update([
                'statut' => StatutEntretien::Annule,
                'motif_annulation' => $motif,
            ]);

            // Freed so someone else can take it.
            CreneauEntretien::whereKey($entretien->creneau_id)->update(['reserve' => false]);
        });

        $entretien->load(['creneau', 'candidature.offre.entreprise', 'candidature.profil.user']);

        $this->notificateur->envoyer(
            new EntretienAnnule($entretien),
            ['entretien' => $entretien->reference]
        );

        return $entretien->refresh();
    }

    /** Recruiter marks it done, optionally with a note. */
    public function terminer(Entretien $entretien, ?string $note = null): Entretien
    {
        if ($entretien->statut->estFinal()) {
            throw new EntretienImpossibleException(
                "Cet entretien est déjà « {$entretien->statut->label()} »."
            );
        }

        $entretien->update([
            'statut' => StatutEntretien::Termine,
            'note' => $note ?? $entretien->note,
        ]);

        return $entretien->refresh();
    }

    private function aUnEntretienActif(Candidature $candidature): bool
    {
        return $candidature->entretiens()
            ->whereIn('statut', [
                StatutEntretien::EnAttente->value,
                StatutEntretien::Confirme->value,
            ])
            ->exists();
    }

    private function exigerModifiable(Entretien $entretien): void
    {
        if ($entretien->statut->estFinal()) {
            throw new EntretienImpossibleException(
                "Cet entretien est « {$entretien->statut->label()} » et ne peut plus être modifié."
            );
        }
    }
}
