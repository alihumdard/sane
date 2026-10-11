<?php

namespace App\Console\Commands;

use App\Mail\EntretienRappel;
use App\Models\Entretien;
use App\Services\Notificateur;
use Illuminate\Console\Command;

/**
 * Day-before reminder for confirmed interviews.
 *
 * Scheduled hourly rather than once a day: an interview confirmed late still
 * gets its reminder, and `rappel_envoye_le` makes the command idempotent, so
 * running it twice never mails a candidate twice.
 */
class EnvoyerRappelsEntretiens extends Command
{
    protected $signature = 'sanem:rappels-entretiens';

    protected $description = 'Envoie les rappels pour les entretiens confirmés des prochaines 24 heures';

    public function handle(Notificateur $notificateur): int
    {
        $entretiens = Entretien::aRappeler()
            ->with(['creneau', 'candidature.offre.entreprise', 'candidature.profil.user'])
            ->get();

        if ($entretiens->isEmpty()) {
            $this->info('Aucun rappel à envoyer.');

            return self::SUCCESS;
        }

        $envoyes = 0;

        foreach ($entretiens as $entretien) {
            // A candidate whose account was deleted leaves nobody to write to.
            if (! $entretien->candidature?->profil?->user) {
                continue;
            }

            $ok = $notificateur->envoyer(
                new EntretienRappel($entretien),
                ['entretien' => $entretien->reference]
            );

            // Stamped only on success, so a transient mail failure is retried
            // on the next run rather than silently skipped.
            if ($ok) {
                $entretien->update(['rappel_envoye_le' => now()]);
                $envoyes++;
            }
        }

        $this->info("{$envoyes} rappel(s) envoyé(s) sur {$entretiens->count()}.");

        return self::SUCCESS;
    }
}
