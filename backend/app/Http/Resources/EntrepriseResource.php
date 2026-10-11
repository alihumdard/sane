<?php

namespace App\Http\Resources;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Entreprise */
class EntrepriseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'slug' => $this->slug,
            'secteur' => $this->secteur,
            'taille' => $this->taille,
            'logo' => $this->logo,
            'site_web' => $this->site_web,
            'description' => $this->description,
            'ville' => $this->ville,
            'verifiee' => $this->verifiee,
        ];
    }
}
