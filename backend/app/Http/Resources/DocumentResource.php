<?php

namespace App\Http\Resources;

use App\Models\DocumentInscription;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Deliberately omits `chemin`: the storage path is never useful to a client and
 * knowing it is of no help anyway, since the file is served only through the
 * authenticated download route.
 *
 * @mixin DocumentInscription
 */
class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'nom_original' => $this->nom_original,
            'mime' => $this->mime,
            'taille' => $this->taille,
            'taille_lisible' => $this->tailleLisible(),
            'televerse_le' => $this->created_at->toIso8601String(),
        ];
    }
}
