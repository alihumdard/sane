<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\EntretienImpossibleException;
use App\Http\Controllers\Controller;
use App\Http\Resources\CorrespondanceResource;
use App\Http\Resources\EntretienResource;
use App\Models\Correspondance;
use App\Models\Entretien;
use App\Services\GestionEntretiens;
use App\Services\MoteurMatching;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** The candidate's side: their interviews, and offers matched to them. */
class EntretienController extends Controller
{
    public function __construct(
        private readonly GestionEntretiens $entretiens,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $profil = $request->user()->profilDemandeurOuCreer();

        $entretiens = Entretien::query()
            ->whereHas('candidature', fn (Builder $q) => $q->where('profil_id', $profil->id))
            ->with(['creneau', 'candidature.offre.entreprise'])
            ->get()
            // Sorted by slot time, which lives on the related row.
            ->sortBy(fn (Entretien $e) => $e->creneau->debut)
            ->values();

        return response()->json(['data' => EntretienResource::collection($entretiens)]);
    }

    public function confirmer(Request $request, Entretien $entretien): JsonResponse
    {
        $this->exigerCandidat($request, $entretien);

        try {
            $entretien = $this->entretiens->confirmer($entretien);
        } catch (EntretienImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'message' => 'Votre présence est confirmée.',
            'data' => new EntretienResource($entretien->load('creneau')),
        ]);
    }

    public function annuler(Request $request, Entretien $entretien): JsonResponse
    {
        $this->exigerCandidat($request, $entretien);

        $valide = $request->validate(['motif' => ['nullable', 'string', 'max:500']]);

        try {
            $entretien = $this->entretiens->annuler($entretien, $valide['motif'] ?? null);
        } catch (EntretienImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'message' => 'Entretien annulé.',
            'data' => new EntretienResource($entretien->load('creneau')),
        ]);
    }

    /** Offers matched to this candidate, best first. */
    public function correspondances(Request $request): JsonResponse
    {
        $profil = $request->user()->profilDemandeurOuCreer();

        $correspondances = Correspondance::where('profil_id', $profil->id)
            ->whereHas('offre', fn (Builder $q) => $q->publiques())
            ->with('offre.entreprise:id,nom,slug,logo,secteur,ville,verifiee')
            ->meilleures(MoteurMatching::SCORE_MINIMUM)
            ->limit(20)
            ->get();

        return response()->json(['data' => CorrespondanceResource::collection($correspondances)]);
    }

    private function exigerCandidat(Request $request, Entretien $entretien): void
    {
        abort_unless(
            $entretien->candidature->profil_id === $request->user()->profilDemandeurOuCreer()->id,
            403,
            'Cet entretien ne vous concerne pas.',
        );
    }
}
