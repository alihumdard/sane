<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\DocumentInscription */
class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'nom_original' => $this->nom_original,
            'taille' => $this->taille,
            'url' => $this->url(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
