<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\StatutCandidature;
use App\Enums\StatutOffre;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\CandidatureResource;
use App\Http\Resources\OffreResource;
use App\Models\Candidature;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Organiser oversight of the job market: moderating offers, verifying
 * companies, and reading applications across every company.
 *
 * Unlike the recruiter space this is deliberately not scoped to one company —
 * the role middleware on these routes is what limits who gets here.
 */
class EmploiAdminController extends Controller
{
    use FiltreLesListes;

    public function offres(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            OffreEmploi::query()->with('entreprise:id,nom,slug,verifiee'),
            $request,
            recherchables: ['titre', 'secteur', 'ville'],
            filtrables: ['statut', 'secteur', 'ville', 'type_contrat'],
            triables: ['titre', 'statut', 'publiee_le', 'candidatures_count', 'vues', 'created_at'],
        );

        return response()->json([
            'data' => OffreResource::collection($page->items()),
            'meta' => $this->meta($page),
            'filtres' => [
                'statut' => collect(StatutOffre::cases())
                    ->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            ],
            'resume' => $this->resumeOffres(),
        ]);
    }

    /** Moderation: an organiser may close or reopen any offer. */
    public function changerStatutOffre(Request $request, OffreEmploi $offre): JsonResponse
    {
        $valide = $request->validate([
            'statut' => ['required', Rule::enum(StatutOffre::class)],
        ]);

        $statut = StatutOffre::from($valide['statut']);

        $offre->update([
            'statut' => $statut,
            'publiee_le' => $statut === StatutOffre::Publiee ? ($offre->publiee_le ?? now()) : $offre->publiee_le,
        ]);

        return response()->json([
            'message' => "Offre « {$statut->label()} ».",
            'data' => new OffreResource($offre->refresh()->load('entreprise')),
        ]);
    }

    public function supprimerOffre(OffreEmploi $offre): JsonResponse
    {
        $offre->delete();

        return response()->json(['message' => 'Offre supprimée.']);
    }

    public function entreprises(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            Entreprise::query()->withCount('offres'),
            $request,
            recherchables: ['nom', 'secteur', 'ville'],
            filtrables: ['secteur', 'ville'],
            triables: ['nom', 'secteur', 'verifiee', 'created_at'],
        );

        return response()->json([
            'data' => $page->items(),
            'meta' => $this->meta($page),
            'resume' => [
                'total' => Entreprise::count(),
                'verifiees' => Entreprise::where('verifiee', true)->count(),
                'en_attente' => Entreprise::where('verifiee', false)->count(),
            ],
        ]);
    }

    /**
     * Verification gate for companies.
     *
     * Only an organiser reaches this, which is what makes the recruiter-side
     * check meaningful: a company cannot vouch for itself.
     */
    public function verifierEntreprise(Request $request, Entreprise $entreprise): JsonResponse
    {
        $valide = $request->validate(['verifiee' => ['required', 'boolean']]);

        $entreprise->update($valide);

        // Withdrawing verification must also pull its live offers down,
        // otherwise the gate only applies at publication time.
        if (! $valide['verifiee']) {
            $entreprise->offres()
                ->where('statut', StatutOffre::Publiee->value)
                ->update(['statut' => StatutOffre::Fermee->value]);
        }

        return response()->json([
            'message' => $valide['verifiee']
                ? 'Entreprise vérifiée : elle peut désormais publier ses offres.'
                : 'Vérification retirée : ses offres publiées ont été fermées.',
            'data' => $entreprise->refresh(),
        ]);
    }

    public function candidatures(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            Candidature::query()->with([
                'offre:id,titre,slug,statut,date_limite,entreprise_id',
                'offre.entreprise:id,nom',
                'profil.user:id,name,email',
                'cv',
            ]),
            $request,
            recherchables: ['reference'],
            filtrables: ['statut'],
            triables: ['statut', 'created_at'],
        );

        return response()->json([
            'data' => CandidatureResource::collection($page->items()),
            'meta' => $this->meta($page),
            'filtres' => [
                'statut' => collect(StatutCandidature::cases())
                    ->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            ],
            'resume' => $this->resumeCandidatures(),
        ]);
    }

    private function resumeOffres(): array
    {
        $parStatut = OffreEmploi::selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return [
            'total' => (int) $parStatut->sum(),
            'publiees' => (int) ($parStatut[StatutOffre::Publiee->value] ?? 0),
            'brouillons' => (int) ($parStatut[StatutOffre::Brouillon->value] ?? 0),
            'candidatures' => (int) OffreEmploi::sum('candidatures_count'),
        ];
    }

    private function resumeCandidatures(): array
    {
        $parStatut = Candidature::selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return [
            'total' => (int) $parStatut->sum(),
            ...collect(StatutCandidature::cases())
                ->mapWithKeys(fn ($s) => [$s->value => (int) ($parStatut[$s->value] ?? 0)])
                ->all(),
        ];
    }
}
