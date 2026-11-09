<?php

namespace App\Console\Commands;

use App\Models\Edition;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Ouvre les inscriptions de l'édition active, à la date dite.
 *
 * Le client a fixé l'ouverture au mercredi 11 novembre et nous a demandé de
 * nous en charger. Une case cochée à la main ce matin-là tient à ce que
 * quelqu'un y pense : d'ici là il reste deux jours, et la personne qui s'en
 * souvient peut être en déplacement, malade, ou simplement occupée. La date
 * est donc écrite ici, et le planificateur s'en souvient à notre place.
 *
 * Elle ne ferme jamais rien : si les organisateurs ouvrent plus tôt, ou
 * referment après coup, la commande n'y touche pas.
 */
class OuvrirLesInscriptions extends Command
{
    protected $signature = 'sanem:ouvrir-les-inscriptions {--edition= : L\'édition à ouvrir (défaut : l\'active)}';

    protected $description = 'Ouvre les inscriptions de l\'édition active';

    public function handle(): int
    {
        $edition = $this->option('edition')
            ? Edition::find((int) $this->option('edition'))
            : Edition::active();

        if (! $edition) {
            $this->error('Aucune édition active.');

            return self::FAILURE;
        }

        if ($edition->inscriptions_ouvertes) {
            $this->info("Les inscriptions de l'édition {$edition->annee} étaient déjà ouvertes.");

            return self::SUCCESS;
        }

        $edition->update(['inscriptions_ouvertes' => true]);

        $this->info("Inscriptions ouvertes pour l'édition {$edition->annee} ({$edition->nom}).");

        Log::info('Inscriptions ouvertes', [
            'edition' => $edition->id,
            'annee' => $edition->annee,
        ]);

        return self::SUCCESS;
    }
}
