<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\OffreResource;
use App\Models\OffreEmploi;
use App\Services\RechercheOffres;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Public job board — no authentication required. */
class OffreController extends Controller
{
    use FiltreLesListes;

    public function __construct(
        private readonly RechercheOffres $recherche,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $page = $this->recherche->paginer($request);

        return response()->json([
            'data' => OffreResource::collection($page->items()),
            'meta' => $this->meta($page),
            'filtres' => $this->recherche->filtresDisponibles(),
        ]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $offre = OffreEmploi::where('slug', $slug)
            ->publiques()
            ->with('entreprise')
            ->firstOrFail();

        $this->compterVue($offre);

        if ($profil = $request->user()?->profilDemandeur) {
            $offre->deja_postule = $profil->candidatures()->where('offre_id', $offre->id)->exists();
            $offre->en_favori = $profil->favoris()->where('offre_id', $offre->id)->exists();
        }

        return response()->json(['data' => new OffreResource($offre)]);
    }

    /**
     * Counted with a bare SQL increment rather than a model save: the view count
     * is incidental to the page, so it must not touch `updated_at`, fire model
     * events, or risk clobbering a concurrent edit of the offer.
     */
    private function compterVue(OffreEmploi $offre): void
    {
        DB::table('offres_emploi')->where('id', $offre->id)->increment('vues');
    }

    /** Sector list with live counts, for the landing page tiles. */
    public function secteurs(): JsonResponse
    {
        return response()->json([
            'data' => $this->recherche->filtresDisponibles()['secteur'],
        ]);
    }
}
