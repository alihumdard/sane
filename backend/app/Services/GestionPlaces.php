<?php

namespace App\Services;

use App\Exceptions\PlacesEpuiseesException;
use App\Models\Formation;
use App\Models\Inscription;
use Illuminate\Support\Facades\DB;

class GestionPlaces
{
    /**
     * Reserve one seat on each formation and attach them to the inscription.
     *
     * The conditional UPDATE is what makes this safe under concurrency: two
     * simultaneous requests for the last seat both read inscriptions_count = 49,
     * but only one UPDATE matches the `inscriptions_count < max_inscriptions`
     * predicate, so the other gets 0 affected rows and is rejected.
     *
     * @param  array<int>  $formationIds
     *
     * @throws PlacesEpuiseesException
     */
    public function reserver(Inscription $inscription, array $formationIds): void
    {
        if ($formationIds === []) {
            return;
        }

        DB::transaction(function () use ($inscription, $formationIds) {
            // Lock in a stable order so two concurrent multi-formation requests
            // can't deadlock by grabbing the same rows in opposite orders.
            sort($formationIds);

            foreach ($formationIds as $id) {
                $affected = Formation::whereKey($id)
                    ->whereColumn('inscriptions_count', '<', 'max_inscriptions')
                    ->increment('inscriptions_count');

                if ($affected === 0) {
                    throw new PlacesEpuiseesException(Formation::findOrFail($id));
                }
            }

            $inscription->formations()->sync($formationIds);
        });
    }

    /**
     * Give the seats back. Guarded by places_liberees so a double cancellation
     * can't decrement twice.
     */
    public function liberer(Inscription $inscription): void
    {
        DB::transaction(function () use ($inscription) {
            $verrouillee = Inscription::whereKey($inscription->id)
                ->lockForUpdate()
                ->first();

            if ($verrouillee->places_liberees) {
                return;
            }

            $ids = $verrouillee->formations()->pluck('formations.id')->sort()->values();

            foreach ($ids as $id) {
                Formation::whereKey($id)
                    ->where('inscriptions_count', '>', 0)
                    ->decrement('inscriptions_count');
            }

            $verrouillee->update([
                'places_liberees' => true,
                'places_liberees_le' => now(),
            ]);

            $inscription->refresh();
        });
    }
}
