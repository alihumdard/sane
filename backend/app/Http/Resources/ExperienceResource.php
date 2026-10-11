<?php

namespace App\Http\Resources;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Experience */
class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'poste' => $this->poste,
            'entreprise' => $this->entreprise,
            'lieu' => $this->lieu,
            'date_debut' => $this->date_debut->toDateString(),
            'date_fin' => $this->date_fin?->toDateString(),
            'en_poste' => $this->en_poste,
            'description' => $this->description,
        ];
    }
}
