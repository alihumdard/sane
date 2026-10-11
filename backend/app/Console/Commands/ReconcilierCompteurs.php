<?php

namespace App\Console\Commands;

use App\Models\Formation;
use App\Models\OffreEmploi;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Realigns the denormalised counters with the rows they summarise.
 *
 * `formations.inscriptions_count` and `offres_emploi.candidatures_count` exist
 * so listings do not COUNT() on every read, but a counter can drift if rows
 * are ever removed outside the services that maintain it — a manual SQL
 * delete, a restored backup, a failed deploy. This recomputes them from the
 * source of truth instead of leaving an organiser to trust a wrong number.
 */
class ReconcilierCompteurs extends Command
{
    protected $signature = 'sanem:reconcilier-compteurs {--dry-run : Afficher les écarts sans corriger}';

    protected $description = 'Recalcule les compteurs dénormalisés (places de formation, candidatures par offre)';

    public function handle(): int
    {
        $simulation = (bool) $this->option('dry-run');
        $corriges = 0;

        $corriges += $this->reconcilier(
            'formations',
            Formation::query(),
            'inscriptions_count',
            fn (Formation $f) => $f->inscriptions()->count(),
            fn (Formation $f) => $f->titre,
            $simulation,
        );

        $corriges += $this->reconcilier(
            'offres',
            OffreEmploi::query(),
            'candidatures_count',
            fn (OffreEmploi $o) => $o->candidatures()->count(),
            fn (OffreEmploi $o) => $o->titre,
            $simulation,
        );

        $this->info($simulation
            ? "{$corriges} écart(s) détecté(s). Relancez sans --dry-run pour corriger."
            : "{$corriges} compteur(s) corrigé(s).");

        return self::SUCCESS;
    }

    private function reconcilier(
        string $libelle,
        $query,
        string $colonne,
        callable $reel,
        callable $nom,
        bool $simulation,
    ): int {
        $corriges = 0;

        $query->chunkById(200, function ($lot) use (&$corriges, $colonne, $reel, $nom, $libelle, $simulation) {
            foreach ($lot as $modele) {
                $attendu = $reel($modele);

                if ((int) $modele->{$colonne} === $attendu) {
                    continue;
                }

                $this->warn(sprintf(
                    '%s — %s : %d → %d',
                    $libelle,
                    $nom($modele),
                    $modele->{$colonne},
                    $attendu,
                ));

                if (! $simulation) {
                    // Bare update: this must not touch timestamps or fire the
                    // model events that maintain the counter in the first place.
                    DB::table($modele->getTable())
                        ->where('id', $modele->id)
                        ->update([$colonne => $attendu]);
                }

                $corriges++;
            }
        });

        return $corriges;
    }
}
