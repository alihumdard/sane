<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormationResource;
use App\Models\Edition;
use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $edition = Edition::active();

        if (! $edition) {
            return response()->json(['data' => [], 'meta' => ['total' => 0]]);
        }

        $query = Formation::query()
            ->with(['categorie', 'formateur'])
            ->pourEdition($edition->id)
            ->publiee();

        if ($q = $request->string('q')->trim()->value()) {
            $query->where(function ($sub) use ($q) {
                $sub->where('titre', 'ilike', "%{$q}%")
                    ->orWhere('description', 'ilike', "%{$q}%");
            });
        }

        if ($categorie = $request->string('categorie')->trim()->value()) {
            $query->whereHas('categorie', fn ($c) => $c->where('slug', $categorie));
        }

        foreach (['niveau', 'format'] as $champ) {
            if ($valeur = $request->string($champ)->trim()->value()) {
                $query->where($champ, $valeur);
            }
        }

        if ($request->boolean('disponibles_seulement')) {
            $query->whereColumn('inscriptions_count', '<', 'max_inscriptions');
        }

        $formations = $query->orderBy('date_debut')->orderBy('titre')->get();

        return response()->json([
            'data' => FormationResource::collection($formations),
            'meta' => [
                'total' => $formations->count(),
                'edition' => ['id' => $edition->id, 'annee' => $edition->annee, 'nom' => $edition->nom],
            ],
            'filtres' => [
                'niveaux' => Formation::pourEdition($edition->id)->publiee()->distinct()->orderBy('niveau')->pluck('niveau'),
                'formats' => Formation::pourEdition($edition->id)->publiee()->distinct()->orderBy('format')->pluck('format'),
            ],
        ]);
    }

    public function show(Formation $formation): JsonResponse
    {
        abort_unless($formation->publiee, 404);

        $formation->load(['categorie', 'formateur', 'edition']);

        return response()->json(['data' => new FormationResource($formation)]);
    }
}
