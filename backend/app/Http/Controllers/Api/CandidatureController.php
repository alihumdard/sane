<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\CandidatureImpossibleException;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\CandidatureResource;
use App\Http\Resources\OffreResource;
use App\Models\Candidature;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use App\Services\GestionCandidatures;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** The candidate's side: applying, tracking, withdrawing. */
class CandidatureController extends Controller
{
    use FiltreLesListes;

    public function __construct(
        private readonly GestionCandidatures $candidatures,
    ) {}

    public function postuler(Request $request, string $slug): JsonResponse
    {
        $profil = $this->profil($request);

        $offre = OffreEmploi::where('slug', $slug)->publiques()->firstOrFail();

        $valide = $request->validate([
            'lettre_motivation' => ['nullable', 'string', 'max:5000'],
            'cv_document_id' => [
                'nullable',
                // Scoped to this profile: a candidate cannot attach someone
                // else's CV by passing its id.
                Rule::exists('documents_candidature', 'id')->where('profil_id', $profil->id),
            ],

            // Required only where the offer asks: the employer set these as
            // selection criteria, so an unanswered one is a gap in the file.
            'reponse_1' => [$offre->question_1 ? 'required' : 'nullable', 'string', 'max:2000'],
            'reponse_2' => [$offre->question_2 ? 'required' : 'nullable', 'string', 'max:2000'],
        ], [
            'reponse_1.required' => 'Merci de répondre à la première question du recruteur.',
            'reponse_2.required' => 'Merci de répondre à la seconde question du recruteur.',
        ]);

        try {
            $candidature = $this->candidatures->postuler(
                $profil,
                $offre,
                $valide['lettre_motivation'] ?? null,
                $valide['cv_document_id'] ?? $profil->cv()?->id,
                $valide['reponse_1'] ?? null,
                $valide['reponse_2'] ?? null,
            );
        } catch (CandidatureImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        $candidature->load(['offre.entreprise', 'cv']);

        return response()->json([
            'message' => 'Votre candidature a bien été envoyée.',
            'data' => new CandidatureResource($candidature),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = $this->profil($request)
            ->candidatures()
            ->with(['offre.entreprise', 'cv'])
            ->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        $page = $query->paginate(min($request->integer('par_page') ?: 15, 50));

        return response()->json([
            'data' => CandidatureResource::collection($page->items()),
            'meta' => $this->meta($page),
        ]);
    }

    public function show(Request $request, Candidature $candidature): JsonResponse
    {
        $this->verifierProprietaire($request, $candidature);

        $candidature->load(['offre.entreprise', 'cv']);

        return response()->json(['data' => new CandidatureResource($candidature)]);
    }

    public function retirer(Request $request, Candidature $candidature): JsonResponse
    {
        $this->verifierProprietaire($request, $candidature);

        try {
            $this->candidatures->retirer($candidature);
        } catch (CandidatureImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json(['message' => 'Candidature retirée.']);
    }

    /* ─── Favoris ─── */

    public function favoris(Request $request): JsonResponse
    {
        $offres = $this->profil($request)
            ->favoris()
            ->with('entreprise:id,nom,slug,logo,secteur,ville,verifiee')
            ->latest('favoris.created_at')
            ->get();

        return response()->json([
            'data' => OffreResource::collection($offres),
        ]);
    }

    public function basculerFavori(Request $request, OffreEmploi $offre): JsonResponse
    {
        $resultat = $this->profil($request)->favoris()->toggle($offre->id);

        return response()->json([
            'message' => $resultat['attached'] ? 'Offre ajoutée aux favoris.' : 'Offre retirée des favoris.',
            'en_favori' => (bool) $resultat['attached'],
        ]);
    }

    private function profil(Request $request): ProfilDemandeur
    {
        return $request->user()->profilDemandeurOuCreer();
    }

    private function verifierProprietaire(Request $request, Candidature $candidature): void
    {
        abort_unless(
            $candidature->profil_id === $this->profil($request)->id,
            403,
            'Cette candidature ne vous appartient pas.',
        );
    }
}
