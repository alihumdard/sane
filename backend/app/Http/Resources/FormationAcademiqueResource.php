<?php

namespace App\Http\Resources;

use App\Models\FormationAcademique;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FormationAcademique */
class FormationAcademiqueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'diplome' => $this->diplome,
            'etablissement' => $this->etablissement,
            'domaine' => $this->domaine,
            'annee_debut' => $this->annee_debut,
            'annee_fin' => $this->annee_fin,
            'en_cours' => $this->en_cours,
        ];
    }
}
