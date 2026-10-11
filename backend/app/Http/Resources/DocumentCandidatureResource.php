<?php

namespace App\Http\Resources;

use App\Models\DocumentCandidature;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Never exposes `chemin`: CVs live on the private disk and are served only
 * through an authorised download route.
 *
 * @mixin DocumentCandidature
 */
class DocumentCandidatureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'nom_original' => $this->nom_original,
            'taille_lisible' => $this->tailleLisible(),
            'principal' => $this->principal,
            'televerse_le' => $this->created_at->toIso8601String(),
        ];
    }
}
