<?php

namespace App\Http\Controllers\Api\Entreprise;

use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\CorrespondanceResource;
use App\Models\Correspondance;
use App\Models\OffreEmploi;
use App\Services\MoteurMatching;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Criteria-based matching, from the recruiter's side. */
class MatchingController extends Controller
{
    use FiltreLesListes;

    public function __construct(
        private readonly MoteurMatching $moteur,
    ) {}

    /**
     * Candidates matched to one offer, best first.
     *
     * Scores are read from the table rather than recomputed: the list is
     * sorted and paged in SQL, which a derived value could not be.
     */
    public function index(Request $request, OffreEmploi $offre): JsonResponse
    {
        $this->authorize('viewCandidatures', $offre);

        $page = Correspondance::where('offre_id', $offre->id)
            ->with(['profil.user:id,name,photo', 'profil.competences'])
            ->meilleures($request->integer('score_min') ?: 0)
            ->paginate(min($request->integer('par_page') ?: 15, 50));

        return response()->json([
            'data' => CorrespondanceResource::collection($page->items()),
            'meta' => $this->meta($page),
            'offre' => [
                'id' => $offre->id,
                'titre' => $offre->titre,
            ],
        ]);
    }

    /** Recalculates on demand, after an offer or the candidate pool changed. */
    public function recalculer(OffreEmploi $offre): JsonResponse
    {
        $this->authorize('update', $offre);

        $total = $this->moteur->calculerPourOffre($offre);

        return response()->json([
            'message' => $total > 0
                ? "{$total} candidat(s) correspondant(s) trouvé(s)."
                : 'Aucun candidat ne correspond actuellement à cette offre.',
            'total' => $total,
        ]);
    }

    /** Recruiter triages a suggestion. */
    public function changerStatut(Request $request, Correspondance $correspondance): JsonResponse
    {
        $this->authorize('update', $correspondance->offre);

        $valide = $request->validate([
            'statut' => ['required', Rule::in(['suggere', 'retenu', 'ecarte'])],
        ]);

        $correspondance->update($valide);

        return response()->json([
            'message' => 'Correspondance mise à jour.',
            'data' => new CorrespondanceResource($correspondance->refresh()),
        ]);
    }
}
