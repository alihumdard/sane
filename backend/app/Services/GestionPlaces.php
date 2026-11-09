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
     * Réserve ce qui est encore libre, et dit ce qui ne l'était plus.
     *
     * `reserver()` est tout-ou-rien : une formation complète fait échouer
     * l'ensemble. C'est le bon comportement au moment où la personne remplit
     * le formulaire — elle peut choisir autre chose.
     *
     * À la confirmation, ce n'est plus le bon : les places ne sont décomptées
     * qu'une fois l'adresse vérifiée, et une formation peut s'être remplie
     * entre l'envoi du courrier et le clic. Annuler toute l'inscription parce
     * qu'un atelier sur trois est complet punirait la personne pour une
     * lenteur qui n'est pas la sienne — sa venue au salon, elle, n'a pas de
     * quota.
     *
     * On réserve donc ce qui reste, et on renvoie les intitulés des formations
     * manquées pour que la page de confirmation le dise franchement.
     *
     * @param  array<int>  $formationIds
     * @return array<string> les formations qui étaient complètes
     */
    public function reserverCeQuiReste(Inscription $inscription, array $formationIds): array
    {
        if ($formationIds === []) {
            return [];
        }

        $complets = [];
        $obtenues = [];

        DB::transaction(function () use ($formationIds, &$complets, &$obtenues) {
            // Même ordre stable que reserver() : deux confirmations simultanées
            // ne doivent pas prendre les mêmes lignes en sens inverse.
            sort($formationIds);

            foreach ($formationIds as $id) {
                $affected = Formation::whereKey($id)
                    ->whereColumn('inscriptions_count', '<', 'max_inscriptions')
                    ->increment('inscriptions_count');

                if ($affected === 0) {
                    $complets[] = Formation::whereKey($id)->value('titre') ?? "Formation #{$id}";

                    continue;
                }

                $obtenues[] = $id;
            }
        });

        // sync() hors de la boucle : une seule écriture de la table pivot.
        $inscription->formations()->sync($obtenues);

        return $complets;
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
