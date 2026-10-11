<?php

namespace App\Http\Resources;

use App\Models\CreneauEntretien;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CreneauEntretien */
class CreneauResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'debut' => $this->debut->toIso8601String(),
            'fin' => $this->fin->toIso8601String(),
            'duree_minutes' => $this->debut->diffInMinutes($this->fin),
            'mode' => $this->mode->value,
            'mode_label' => $this->mode->label(),
            'lieu' => $this->lieu,
            'reserve' => $this->reserve,
            'passe' => $this->estPasse(),
        ];
    }
}
