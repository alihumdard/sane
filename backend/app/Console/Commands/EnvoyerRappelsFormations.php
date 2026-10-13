<?php

namespace App\Console\Commands;

use App\Enums\StatutInscription;
use App\Mail\RappelFormation;
use App\Models\Formation;
use App\Services\Notificateur;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Three-day reminder for courses that are about to run.
 *
 * Scheduled daily rather than hourly, unlike the interview reminders: a course
 * date is a day, not a time, so there is nothing to gain from checking more
 * often. `rappel_envoye_le` on the pivot makes the command idempotent, so a
 * second run on the same day mails nobody twice.
 */
class EnvoyerRappelsFormations extends Command
{
    protected $signature = 'sanem:rappels-formations {--jours=3 : Combien de jours avant la formation}';

    protected $description = 'Envoie les rappels aux participants dont la formation approche';

    public function handle(Notificateur $notificateur): int
    {
        $jours = max(0, (int) $this->option('jours'));
        $cible = now()->addDays($jours)->toDateString();

        $formations = Formation::query()
            ->whereDate('date_debut', $cible)
            ->with('formateur')
            ->get();

        if ($formations->isEmpty()) {
            $this->info("Aucune formation le {$cible}.");

            return self::SUCCESS;
        }

        $envoyes = 0;
        $total = 0;

        foreach ($formations as $formation) {
            // Only confirmed registrations: someone still awaiting validation,
            // or already cancelled, has no seat to be reminded about.
            $inscriptions = $formation->inscriptions()
                ->where('statut', StatutInscription::Confirmee->value)
                ->wherePivotNull('rappel_envoye_le')
                ->get();

            foreach ($inscriptions as $inscription) {
                $total++;

                $ok = $notificateur->envoyer(
                    new RappelFormation($inscription, $formation),
                    ['inscription' => $inscription->reference, 'formation' => $formation->titre],
                );

                // Stamped only on success, so a transient mail failure is
                // retried tomorrow rather than silently skipped.
                if ($ok) {
                    DB::table('inscription_formation')
                        ->where('inscription_id', $inscription->id)
                        ->where('formation_id', $formation->id)
                        ->update(['rappel_envoye_le' => now()]);

                    $envoyes++;
                }
            }
        }

        $this->info($total === 0
            ? "Aucun rappel à envoyer pour le {$cible}."
            : "{$envoyes} rappel(s) envoyé(s) sur {$total} pour le {$cible}.");

        return self::SUCCESS;
    }
}
