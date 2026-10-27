<?php

namespace App\Http\Resources;

use App\Models\ProfilDemandeur;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProfilDemandeur */
class ProfilDemandeurResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->whenLoaded('user', fn () => $this->user->name),
            'photo' => $this->whenLoaded('user', fn () => $this->user->photo),

            // Contact details reach a recruiter only once the candidate has
            // applied to them; the candidate search must not become a directory
            // of phone numbers. The controller decides by loading `contact`.
            'email' => $this->when($this->contactVisible ?? false, fn () => $this->user?->email),
            'telephone' => $this->when($this->contactVisible ?? false, fn () => $this->user?->telephone),

            'titre_pro' => $this->titre_pro,
            'resume' => $this->resume,
            'secteur' => $this->secteur,
            'ville' => $this->ville,
            'type_emploi' => $this->type_emploi,
            'disponibilite' => $this->disponibilite,
            'linkedin' => $this->linkedin,
            'portfolio' => $this->portfolio,
            'visible' => $this->visible,

            'competences' => $this->whenLoaded('competences', fn () => $this->competences->map(fn ($c) => [
                'id' => $c->id,
                'nom' => $c->nom,
                'niveau' => $c->pivot->niveau,
            ])),
            'formations' => FormationAcademiqueResource::collection($this->whenLoaded('formations')),
            'experiences' => ExperienceResource::collection($this->whenLoaded('experiences')),
            'documents' => DocumentCandidatureResource::collection($this->whenLoaded('documents')),

            'taux_completion' => $this->when(
                $this->tauxCompletionVisible ?? false,
                fn () => $this->tauxCompletion()
            ),

            /*
             * What an application still needs, so the offer page can say so
             * before the visitor writes a covering letter and presses send.
             * GestionCandidatures refuses the same two; this only reports them.
             */
            'peut_postuler' => $this->when(
                $this->tauxCompletionVisible ?? false,
                fn () => $this->cv() !== null && $this->formations()->exists()
            ),
            'manque_pour_postuler' => $this->when(
                $this->tauxCompletionVisible ?? false,
                fn () => array_values(array_filter([
                    $this->cv() === null ? 'cv' : null,
                    $this->formations()->exists() ? null : 'formation',
                ]))
            ),
        ];
    }
}
