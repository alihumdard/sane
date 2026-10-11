<?php

namespace App\Http\Resources;

use App\Models\OffreEmploi;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OffreEmploi */
class OffreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'slug' => $this->slug,
            'description' => $this->description,
            'missions' => $this->missions,
            'profil_recherche' => $this->profil_recherche,

            'type_contrat' => $this->type_contrat->value,
            'type_contrat_label' => $this->type_contrat->label(),
            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),

            'secteur' => $this->secteur,
            'ville' => $this->ville,
            'salaire_min' => $this->salaire_min,
            'salaire_max' => $this->salaire_max,
            'experience_requise' => $this->experience_requise,
            'niveau_etude' => $this->niveau_etude,

            'date_limite' => $this->date_limite?->toDateString(),
            'publiee_le' => $this->publiee_le?->toIso8601String(),
            'expiree' => $this->expiree,
            'ouverte' => $this->ouverte,
            'vues' => $this->vues,
            'candidatures_count' => $this->candidatures_count,

            'entreprise' => new EntrepriseResource($this->whenLoaded('entreprise')),

            // Set by the controller only where it resolved them for this user.
            'deja_postule' => $this->when(isset($this->deja_postule), fn () => (bool) $this->deja_postule),
            'en_favori' => $this->when(isset($this->en_favori), fn () => (bool) $this->en_favori),
        ];
    }
}
