<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FormationRequest;
use App\Http\Resources\FormationResource;
use App\Http\Resources\InscriptionResource;
use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FormationAdminController extends Controller
{
    use FiltreLesListes;

    public function index(Request $request): JsonResponse
    {
        $query = Formation::query()->with(['categorie', 'formateur', 'edition:id,annee']);

        if ($editionId = $request->integer('edition_id')) {
            $query->where('edition_id', $editionId);
        }

        $page = $this->listePaginee(
            $query,
            $request,
            recherchables: ['titre', 'description'],
            filtrables: ['niveau', 'format', 'categorie_id'],
            triables: ['titre', 'niveau', 'format', 'max_inscriptions', 'inscriptions_count', 'date_debut'],
        );

        return response()->json([
            'data' => FormationResource::collection($page->items()),
            'meta' => $this->meta($page),
        ]);
    }

    public function store(FormationRequest $request): JsonResponse
    {
        $donnees = $request->validated();
        $donnees['slug'] ??= Str::slug($donnees['titre']);

        $formation = Formation::create($donnees);
        $formation->load(['categorie', 'formateur']);

        return response()->json([
            'message' => 'Formation créée.',
            'data' => new FormationResource($formation),
        ], 201);
    }

    public function show(Formation $formation): JsonResponse
    {
        $formation->load(['categorie', 'formateur', 'edition']);

        return response()->json(['data' => new FormationResource($formation)]);
    }

    public function update(FormationRequest $request, Formation $formation): JsonResponse
    {
        $donnees = $request->validated();
        $donnees['slug'] ??= Str::slug($donnees['titre']);

        $formation->update($donnees);
        $formation->load(['categorie', 'formateur']);

        return response()->json([
            'message' => 'Formation mise à jour.',
            'data' => new FormationResource($formation),
        ]);
    }

    public function destroy(Formation $formation): JsonResponse
    {
        if ($formation->inscriptions_count > 0) {
            return response()->json([
                'message' => "Cette formation compte {$formation->inscriptions_count} inscrit(s) et ne peut pas être supprimée. Dépubliez-la à la place.",
            ], 422);
        }

        $formation->delete();

        return response()->json(['message' => 'Formation supprimée.']);
    }

    /** Who signed up for this course. */
    public function inscrits(Formation $formation): JsonResponse
    {
        $inscriptions = $formation->inscriptions()
            ->with('formations')
            ->orderBy('nom')
            ->get();

        return response()->json([
            'data' => InscriptionResource::collection($inscriptions),
            'meta' => [
                'formation' => ['id' => $formation->id, 'titre' => $formation->titre],
                'total' => $inscriptions->count(),
                'places_restantes' => $formation->places_restantes,
            ],
        ]);
    }
}
