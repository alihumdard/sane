<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Formation */
class FormationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'slug' => $this->slug,
            'description' => $this->description,
            'prerequis' => $this->prerequis,
            'duree' => $this->duree,
            'lieu' => $this->lieu,
            'niveau' => $this->niveau,
            'format' => $this->format,
            'image' => $this->image,
            'date_debut' => $this->date_debut?->toDateString(),
            'date_fin' => $this->date_fin?->toDateString(),

            'categorie' => $this->whenLoaded('categorie', fn () => [
                'id' => $this->categorie->id,
                'nom' => $this->categorie->nom,
                'slug' => $this->categorie->slug,
            ]),

            'formateur' => $this->whenLoaded('formateur', fn () => [
                'id' => $this->formateur->id,
                'nom' => $this->formateur->nom,
                'fonction' => $this->formateur->fonction,
                'photo' => $this->formateur->photo,
            ]),

            'max_inscriptions' => $this->max_inscriptions,
            'inscriptions_count' => $this->inscriptions_count,
            'places_restantes' => $this->places_restantes,
            'taux_remplissage' => $this->taux_remplissage,
            'complete' => $this->complete,
            'publiee' => $this->publiee,
        ];
    }
}
