<?php

namespace App\Http\Controllers\Api;

use App\Enums\NiveauCompetence;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProfilDemandeurRequest;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\FormationAcademiqueResource;
use App\Http\Resources\ProfilDemandeurResource;
use App\Models\Competence;
use App\Models\Experience;
use App\Models\FormationAcademique;
use App\Models\ProfilDemandeur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * The jobseeker's own profile.
 *
 * Every action resolves the profile from the authenticated user, never from a
 * route parameter, so there is no id a caller could swap to reach someone else.
 */
class ProfilController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->resource($this->profil($request))]);
    }

    public function update(ProfilDemandeurRequest $request): JsonResponse
    {
        $profil = $this->profil($request);
        $profil->update($request->validated());

        return response()->json([
            'message' => 'Profil mis à jour.',
            'data' => $this->resource($profil->refresh()),
        ]);
    }

    /* ─── Compétences ─── */

    public function ajouterCompetence(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'niveau' => ['required', Rule::enum(NiveauCompetence::class)],
        ]);

        $profil = $this->profil($request);
        $competence = Competence::trouverOuCreer($valide['nom']);

        // syncWithoutDetaching so re-adding a skill updates its level rather
        // than failing on the unique(profil_id, competence_id) index.
        $profil->competences()->syncWithoutDetaching([
            $competence->id => ['niveau' => $valide['niveau']],
        ]);

        return response()->json([
            'message' => 'Compétence ajoutée.',
            'data' => $this->resource($profil->refresh()),
        ], 201);
    }

    public function retirerCompetence(Request $request, Competence $competence): JsonResponse
    {
        $this->profil($request)->competences()->detach($competence->id);

        return response()->json(['message' => 'Compétence retirée.']);
    }

    /* ─── Formations académiques ─── */

    public function ajouterFormation(Request $request): JsonResponse
    {
        $valide = $request->validate($this->reglesFormation());

        $formation = $this->profil($request)->formations()->create($valide);

        return response()->json([
            'message' => 'Formation ajoutée.',
            'data' => new FormationAcademiqueResource($formation),
        ], 201);
    }

    public function modifierFormation(Request $request, FormationAcademique $formation): JsonResponse
    {
        $this->verifierProprietaire($request, $formation->profil_id);

        $formation->update($request->validate($this->reglesFormation()));

        return response()->json([
            'message' => 'Formation mise à jour.',
            'data' => new FormationAcademiqueResource($formation->refresh()),
        ]);
    }

    public function supprimerFormation(Request $request, FormationAcademique $formation): JsonResponse
    {
        $this->verifierProprietaire($request, $formation->profil_id);
        $formation->delete();

        return response()->json(['message' => 'Formation supprimée.']);
    }

    /* ─── Expériences ─── */

    public function ajouterExperience(Request $request): JsonResponse
    {
        $valide = $request->validate($this->reglesExperience());

        $experience = $this->profil($request)->experiences()->create($valide);

        return response()->json([
            'message' => 'Expérience ajoutée.',
            'data' => new ExperienceResource($experience),
        ], 201);
    }

    public function modifierExperience(Request $request, Experience $experience): JsonResponse
    {
        $this->verifierProprietaire($request, $experience->profil_id);

        $experience->update($request->validate($this->reglesExperience()));

        return response()->json([
            'message' => 'Expérience mise à jour.',
            'data' => new ExperienceResource($experience->refresh()),
        ]);
    }

    public function supprimerExperience(Request $request, Experience $experience): JsonResponse
    {
        $this->verifierProprietaire($request, $experience->profil_id);
        $experience->delete();

        return response()->json(['message' => 'Expérience supprimée.']);
    }

    /* ─── Interne ─── */

    private function reglesFormation(): array
    {
        return [
            'diplome' => ['required', 'string', 'max:200'],
            'etablissement' => ['required', 'string', 'max:200'],
            'domaine' => ['nullable', 'string', 'max:150'],
            'annee_debut' => ['nullable', 'integer', 'min:1950', 'max:'.(date('Y') + 10)],
            'annee_fin' => ['nullable', 'integer', 'min:1950', 'max:'.(date('Y') + 10), 'gte:annee_debut'],
            'en_cours' => ['boolean'],
        ];
    }

    private function reglesExperience(): array
    {
        return [
            'poste' => ['required', 'string', 'max:200'],
            'entreprise' => ['required', 'string', 'max:200'],
            'lieu' => ['nullable', 'string', 'max:150'],
            'date_debut' => ['required', 'date', 'before_or_equal:'.now()->toDateString()],
            'date_fin' => ['nullable', 'date', 'after_or_equal:date_debut', 'before_or_equal:'.now()->toDateString()],
            'en_poste' => ['boolean'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }

    private function profil(Request $request): ProfilDemandeur
    {
        return $request->user()->profilDemandeurOuCreer();
    }

    /** Guards the nested resources, which are addressed by their own id. */
    private function verifierProprietaire(Request $request, int $profilId): void
    {
        abort_unless($this->profil($request)->id === $profilId, 403, 'Cette entrée ne vous appartient pas.');
    }

    private function resource(ProfilDemandeur $profil): ProfilDemandeurResource
    {
        $profil->load(['user', 'competences', 'formations', 'experiences', 'documents']);
        $profil->contactVisible = true;
        $profil->tauxCompletionVisible = true;

        return new ProfilDemandeurResource($profil);
    }
}
