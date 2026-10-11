<?php

namespace App\Http\Resources;

use App\Models\Correspondance;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Correspondance */
class CorrespondanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'score' => $this->score,
            'statut' => $this->statut,
            // The breakdown is the point of criteria-based matching: the
            // recruiter sees why, not just how much.
            'details' => $this->details,
            'offre' => new OffreResource($this->whenLoaded('offre')),
            'profil' => new ProfilDemandeurResource($this->whenLoaded('profil')),
            'calcule_le' => $this->updated_at->toIso8601String(),
        ];
    }
}
