<?php

namespace App\Http\Resources;

use App\Models\Entretien;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Entretien */
class EntretienResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),
            'est_final' => $this->statut->estFinal(),
            'lien_visio' => $this->lien_visio,
            'motif_annulation' => $this->motif_annulation,
            'confirme_le' => $this->confirme_le?->toIso8601String(),
            'creneau' => new CreneauResource($this->whenLoaded('creneau')),
            'candidature' => new CandidatureResource($this->whenLoaded('candidature')),
            // The recruiter's debrief note is theirs alone.
            'note' => $this->when($this->noteVisible ?? false, fn () => $this->note),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
