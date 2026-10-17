<?php

namespace App\Console\Commands;

use App\Mail\EntretienRappel;
use App\Mail\EntretienRappelRecruteur;
use App\Models\Entretien;
use App\Services\Notificateur;
use Illuminate\Console\Command;

/**
 * Day-before reminder for confirmed interviews, sent to both the candidate
 * and the recruiting company — the contract calls for reminders on both
 * sides, not just the candidate's.
 *
 * Scheduled hourly rather than once a day: an interview confirmed late still
 * gets its reminder, and `rappel_envoye_le` makes the command idempotent, so
 * running it twice never mails either side twice.
 */
class EnvoyerRappelsEntretiens extends Command
{
    protected $signature = 'sanem:rappels-entretiens';

    protected $description = 'Envoie les rappels pour les entretiens confirmés des prochaines 24 heures';

    public function handle(Notificateur $notificateur): int
    {
        $entretiens = Entretien::aRappeler()
            ->with(['creneau', 'candidature.offre.entreprise.user', 'candidature.profil.user'])
            ->get();

        if ($entretiens->isEmpty()) {
            $this->info('Aucun rappel à envoyer.');

            return self::SUCCESS;
        }

        $envoyes = 0;

        foreach ($entretiens as $entretien) {
            // No one to write to on either side leaves nothing worth sending.
            $candidatOk = (bool) $entretien->candidature?->profil?->user;
            $recruteurOk = (bool) $entretien->candidature?->offre?->entreprise?->user;

            if (! $candidatOk && ! $recruteurOk) {
                continue;
            }

            // Each side is independent: a missing recruiter account must not
            // block the candidate's reminder, and vice versa.
            $candidatEnvoye = ! $candidatOk || $notificateur->envoyer(
                new EntretienRappel($entretien),
                ['entretien' => $entretien->reference, 'destinataire' => 'candidat']
            );

            $recruteurEnvoye = ! $recruteurOk || $notificateur->envoyer(
                new EntretienRappelRecruteur($entretien),
                ['entretien' => $entretien->reference, 'destinataire' => 'recruteur']
            );

            // Stamped only once both sides succeeded (or had no one to mail),
            // so a transient failure on either side is retried next run
            // rather than silently skipped.
            if ($candidatEnvoye && $recruteurEnvoye) {
                $entretien->update(['rappel_envoye_le' => now()]);
                $envoyes++;
            }
        }

        $this->info("{$envoyes} rappel(s) envoyé(s) sur {$entretiens->count()}.");

        return self::SUCCESS;
    }
}
