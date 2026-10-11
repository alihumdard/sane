<?php

namespace App\Http\Controllers\Api\Entreprise;

use App\Enums\StatutOffre;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Requests\OffreRequest;
use App\Http\Resources\OffreResource;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** CRUD over the company's own offers. */
class OffreEntrepriseController extends Controller
{
    use FiltreLesListes;

    public function index(Request $request): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        // Scoped to the company before any filter runs, so there is no path
        // by which another company's rows can enter the result set.
        $query = OffreEmploi::where('entreprise_id', $entreprise->id)->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        $page = $query->paginate(min($request->integer('par_page') ?: 15, 50));

        return response()->json([
            'data' => OffreResource::collection($page->items()),
            'meta' => $this->meta($page),
            'resume' => $this->resume($entreprise),
        ]);
    }

    public function store(OffreRequest $request): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        $donnees = $request->validated();
        $statut = StatutOffre::tryFrom($donnees['statut'] ?? '') ?? StatutOffre::Brouillon;

        if ($statut === StatutOffre::Publiee && ! $entreprise->verifiee) {
            return response()->json([
                'message' => 'Votre entreprise doit être vérifiée par les organisateurs avant de publier une offre.',
            ], 403);
        }

        $offre = OffreEmploi::create([
            ...$donnees,
            'entreprise_id' => $entreprise->id,
            'statut' => $statut,
            'publiee_le' => $statut === StatutOffre::Publiee ? now() : null,
        ]);

        return response()->json([
            'message' => $statut === StatutOffre::Publiee ? 'Offre publiée.' : 'Offre enregistrée en brouillon.',
            'data' => new OffreResource($offre->load('entreprise')),
        ], 201);
    }

    public function show(Request $request, OffreEmploi $offre): JsonResponse
    {
        $this->authorize('view', $offre);

        return response()->json(['data' => new OffreResource($offre->load('entreprise'))]);
    }

    public function update(OffreRequest $request, OffreEmploi $offre): JsonResponse
    {
        $this->authorize('update', $offre);

        $donnees = $request->validated();
        $statut = StatutOffre::tryFrom($donnees['statut'] ?? '') ?? $offre->statut;

        if ($statut === StatutOffre::Publiee && $offre->statut !== StatutOffre::Publiee) {
            $this->authorize('publish', $offre);
        }

        $offre->update([
            ...$donnees,
            'statut' => $statut,
            // Stamped the first time it goes live, and kept thereafter.
            'publiee_le' => $statut === StatutOffre::Publiee
                ? ($offre->publiee_le ?? now())
                : $offre->publiee_le,
        ]);

        return response()->json([
            'message' => 'Offre mise à jour.',
            'data' => new OffreResource($offre->refresh()->load('entreprise')),
        ]);
    }

    public function destroy(Request $request, OffreEmploi $offre): JsonResponse
    {
        $this->authorize('delete', $offre);

        $offre->delete();

        return response()->json(['message' => 'Offre supprimée.']);
    }

    /** Publish / close without sending the whole form back. */
    public function changerStatut(Request $request, OffreEmploi $offre): JsonResponse
    {
        $this->authorize('update', $offre);

        $valide = $request->validate([
            'statut' => ['required', Rule::enum(StatutOffre::class)],
        ]);

        $statut = StatutOffre::from($valide['statut']);

        if ($statut === StatutOffre::Publiee) {
            $this->authorize('publish', $offre);
        }

        $offre->update([
            'statut' => $statut,
            'publiee_le' => $statut === StatutOffre::Publiee ? ($offre->publiee_le ?? now()) : $offre->publiee_le,
        ]);

        return response()->json([
            'message' => "Offre « {$statut->label()} ».",
            'data' => new OffreResource($offre->refresh()),
        ]);
    }

    private function entreprise(Request $request): Entreprise
    {
        $entreprise = $request->user()->entrepriseActive();

        abort_if($entreprise === null, 409, "Créez d'abord le profil de votre entreprise.");

        return $entreprise;
    }

    /** Counts for the recruiter dashboard, in one grouped query. */
    private function resume(Entreprise $entreprise): array
    {
        $parStatut = OffreEmploi::where('entreprise_id', $entreprise->id)
            ->selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return [
            'total' => (int) $parStatut->sum(),
            'publiees' => (int) ($parStatut[StatutOffre::Publiee->value] ?? 0),
            'brouillons' => (int) ($parStatut[StatutOffre::Brouillon->value] ?? 0),
            'candidatures' => (int) OffreEmploi::where('entreprise_id', $entreprise->id)->sum('candidatures_count'),
        ];
    }
}
