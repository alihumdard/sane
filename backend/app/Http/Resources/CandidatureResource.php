<?php

namespace App\Http\Resources;

use App\Models\Candidature;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Candidature */
class CandidatureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,

            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),
            'est_final' => $this->statut->estFinal(),
            'peut_etre_retiree' => $this->statut->peutEtreRetiree(),

            'lettre_motivation' => $this->lettre_motivation,
            'reponse_1' => $this->reponse_1,
            'reponse_2' => $this->reponse_2,

            'offre' => new OffreResource($this->whenLoaded('offre')),
            'profil' => new ProfilDemandeurResource($this->whenLoaded('profil')),
            'cv' => new DocumentCandidatureResource($this->whenLoaded('cv')),

            // The recruiter's private note is never echoed back to the candidate.
            'note_recruteur' => $this->when($this->noteVisible ?? false, fn () => $this->note_recruteur),

            'statut_modifie_le' => $this->statut_modifie_le?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
