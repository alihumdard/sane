<?php

namespace App\Http\Controllers\Api\Entreprise;

use App\Enums\StatutCandidature;
use App\Enums\StatutOffre;
use App\Http\Controllers\Controller;
use App\Http\Resources\CandidatureResource;
use App\Models\Candidature;
use App\Models\OffreEmploi;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Landing figures for the recruiter dashboard. */
class TableauBordController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $entreprise = $request->user()->entrepriseActive();

        if (! $entreprise) {
            return response()->json([
                'entreprise' => null,
                'message' => "Créez d'abord le profil de votre entreprise.",
            ]);
        }

        $offres = OffreEmploi::where('entreprise_id', $entreprise->id);

        $parStatut = (clone $offres)
            ->selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        $candidatures = Candidature::whereHas(
            'offre',
            fn (Builder $q) => $q->where('entreprise_id', $entreprise->id)
        );

        $candidaturesParStatut = (clone $candidatures)
            ->selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        $recentes = (clone $candidatures)
            ->with(['offre:id,titre,slug,statut,date_limite', 'profil.user:id,name,photo'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'entreprise' => [
                'nom' => $entreprise->nom,
                'verifiee' => $entreprise->verifiee,
            ],
            'offres' => [
                'total' => (int) $parStatut->sum(),
                'publiees' => (int) ($parStatut[StatutOffre::Publiee->value] ?? 0),
                'brouillons' => (int) ($parStatut[StatutOffre::Brouillon->value] ?? 0),
                'vues' => (int) (clone $offres)->sum('vues'),
            ],
            'candidatures' => [
                'total' => (int) $candidaturesParStatut->sum(),
                'nouvelles' => (int) ($candidaturesParStatut[StatutCandidature::Envoyee->value] ?? 0),
                'en_revue' => (int) ($candidaturesParStatut[StatutCandidature::EnRevue->value] ?? 0),
                'entretien' => (int) ($candidaturesParStatut[StatutCandidature::Entretien->value] ?? 0),
                'acceptees' => (int) ($candidaturesParStatut[StatutCandidature::Acceptee->value] ?? 0),
            ],
            'recentes' => CandidatureResource::collection($recentes),
        ]);
    }
}
