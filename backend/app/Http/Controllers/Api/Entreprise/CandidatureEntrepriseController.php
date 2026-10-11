<?php

namespace App\Http\Controllers\Api\Entreprise;

use App\Enums\StatutCandidature;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\CandidatureResource;
use App\Http\Resources\ProfilDemandeurResource;
use App\Models\Candidature;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use App\Services\GestionCandidatures;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Applications received, candidate search, and recruitment tracking. */
class CandidatureEntrepriseController extends Controller
{
    use FiltreLesListes;

    public function __construct(
        private readonly GestionCandidatures $candidatures,
    ) {}

    /** Every application across the company's offers. */
    public function index(Request $request): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        $query = Candidature::query()
            ->whereHas('offre', fn (Builder $q) => $q->where('entreprise_id', $entreprise->id))
            ->with(['offre:id,titre,slug,ville,type_contrat,statut,date_limite', 'profil.user:id,name,photo', 'cv'])
            ->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        if ($request->filled('offre_id')) {
            $query->where('offre_id', $request->integer('offre_id'));
        }

        $page = $query->paginate(min($request->integer('par_page') ?: 15, 50));

        $items = collect($page->items())->each(fn (Candidature $c) => $c->noteVisible = true);

        return response()->json([
            'data' => CandidatureResource::collection($items),
            'meta' => $this->meta($page),
            'resume' => $this->resume($entreprise),
            'filtres' => [
                'statut' => collect(StatutCandidature::cases())
                    ->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            ],
        ]);
    }

    /** Applications for one offer. */
    public function parOffre(Request $request, OffreEmploi $offre): JsonResponse
    {
        $this->authorize('viewCandidatures', $offre);

        $page = $offre->candidatures()
            ->with(['profil.user:id,name,photo', 'profil.competences', 'cv'])
            ->latest()
            ->paginate(min($request->integer('par_page') ?: 15, 50));

        $items = collect($page->items())->each(fn (Candidature $c) => $c->noteVisible = true);

        return response()->json([
            'data' => CandidatureResource::collection($items),
            'meta' => $this->meta($page),
        ]);
    }

    public function show(Candidature $candidature): JsonResponse
    {
        $this->authorize('view', $candidature);

        $candidature->load([
            'offre.entreprise',
            'profil.user:id,name,photo,email,telephone',
            'profil.competences',
            'profil.formations',
            'profil.experiences',
            'cv',
        ]);

        // The recruiter received this application, so the candidate's contact
        // details and the private note are theirs to see.
        $candidature->noteVisible = true;
        $candidature->profil->contactVisible = true;

        return response()->json(['data' => new CandidatureResource($candidature)]);
    }

    public function changerStatut(Request $request, Candidature $candidature): JsonResponse
    {
        $this->authorize('update', $candidature);

        $valide = $request->validate([
            'statut' => ['required', Rule::enum(StatutCandidature::class)],
            'note_recruteur' => ['nullable', 'string', 'max:2000'],
        ]);

        $statut = StatutCandidature::from($valide['statut']);

        if (array_key_exists('note_recruteur', $valide)) {
            $candidature->note_recruteur = $valide['note_recruteur'];
        }

        $this->candidatures->changerStatut($candidature, $statut);

        $candidature->load(['offre.entreprise', 'profil.user', 'cv']);
        $candidature->noteVisible = true;

        return response()->json([
            'message' => "Candidature « {$statut->label()} ».",
            'data' => new CandidatureResource($candidature),
        ]);
    }

    public function telechargerCv(Candidature $candidature): StreamedResponse
    {
        $this->authorize('downloadCv', $candidature);

        abort_if($candidature->cv === null, 404, "Aucun CV n'est joint à cette candidature.");

        return $candidature->cv->contenu();
    }

    /**
     * Candidate search.
     *
     * Only profiles whose owner opted into visibility are listed, and contact
     * details are withheld: a recruiter sees enough to decide whether to
     * engage, not a harvestable directory of phone numbers.
     */
    public function candidats(Request $request): JsonResponse
    {
        $this->entreprise($request);

        $query = ProfilDemandeur::query()
            ->visible()
            ->with(['user:id,name,photo', 'competences'])
            ->whereHas('user');

        if ($q = trim((string) $request->query('q', ''))) {
            $query->where(function (Builder $sous) use ($q) {
                $sous->where('titre_pro', 'ilike', "%{$q}%")
                    ->orWhere('resume', 'ilike', "%{$q}%")
                    ->orWhereHas('competences', fn (Builder $c) => $c->where('nom', 'ilike', "%{$q}%"));
            });
        }

        $query
            ->when($request->filled('secteur'), fn (Builder $q2) => $q2->where('secteur', $request->query('secteur')))
            ->when($request->filled('ville'), fn (Builder $q2) => $q2->where('ville', $request->query('ville')))
            ->when($request->filled('type_emploi'), fn (Builder $q2) => $q2->where('type_emploi', $request->query('type_emploi')));

        $page = $query->latest('updated_at')->paginate(min($request->integer('par_page') ?: 12, 50));

        return response()->json([
            'data' => ProfilDemandeurResource::collection($page->items()),
            'meta' => $this->meta($page),
        ]);
    }

    public function candidat(Request $request, ProfilDemandeur $profil): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        abort_unless($profil->visible, 404);

        // Contact details unlock only once this candidate has applied here.
        $contactVisible = $profil->candidatures()
            ->whereHas('offre', fn (Builder $q) => $q->where('entreprise_id', $entreprise->id))
            ->exists();

        // email/telephone are only selected when the recruiter is entitled to
        // them, so an unentitled caller cannot have them in memory at all.
        $profil->load([
            'user:id,name,photo'.($contactVisible ? ',email,telephone' : ''),
            'competences', 'formations', 'experiences',
        ]);

        $profil->contactVisible = $contactVisible;

        return response()->json(['data' => new ProfilDemandeurResource($profil)]);
    }

    private function entreprise(Request $request): Entreprise
    {
        $entreprise = $request->user()->entrepriseActive();

        abort_if($entreprise === null, 409, "Créez d'abord le profil de votre entreprise.");

        return $entreprise;
    }

    private function resume(Entreprise $entreprise): array
    {
        $parStatut = Candidature::query()
            ->whereHas('offre', fn (Builder $q) => $q->where('entreprise_id', $entreprise->id))
            ->selectRaw('statut, count(*) as total')
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
