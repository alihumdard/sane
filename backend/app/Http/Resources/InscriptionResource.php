<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Inscription */
class InscriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,

            'type_participation' => $this->type_participation->value,
            'type_participation_label' => $this->type_participation->label(),
            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),

            'nom' => $this->nom,
            'naissance' => $this->naissance?->toDateString(),
            'email' => $this->email,
            'telephone' => $this->telephone,
            'genre' => $this->genre,
            'nationalite' => $this->nationalite,
            'ville' => $this->ville,
            'niveau' => $this->niveau,

            'statut_pro' => $this->statut_pro,
            'domaine' => $this->domaine,
            'experience' => $this->experience,
            'parcours' => $this->parcours,

            'interets' => $this->interets ?? [],
            'source' => $this->source,
            'newsletter' => $this->newsletter,

            'formations' => FormationResource::collection($this->whenLoaded('formations')),
            'documents' => $this->whenLoaded('documents', fn () => $this->documents->map(fn ($d) => [
                'type' => $d->type->value,
                'type_label' => $d->type->label(),
                'nom_original' => $d->nom_original,
                'url' => $d->url(),
            ])),

            'confirmee_le' => $this->confirmee_le?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
