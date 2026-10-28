<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\StatutCandidature;
use App\Enums\StatutEntretien;
use App\Enums\StatutOffre;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\CandidatureResource;
use App\Http\Resources\EntretienResource;
use App\Http\Resources\OffreResource;
use App\Models\Candidature;
use App\Models\Entreprise;
use App\Models\Entretien;
use App\Models\OffreEmploi;
use App\Services\Notificateur;
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
            // The recruiter rides along: verifying a company means vouching
            // for it, and the moderator could see a name and an offer count
            // but not who was behind it.
            Entreprise::query()
                ->with('user:id,name,email,telephone')
                ->withCount(['offres', 'offres as offres_publiees_count' => fn ($q) => $q->where('statut', StatutOffre::Publiee->value)]),
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
    public function verifierEntreprise(
        Request $request,
        Entreprise $entreprise,
        Notificateur $notificateur,
    ): JsonResponse {
        $valide = $request->validate(['verifiee' => ['required', 'boolean']]);

        $entreprise->update($valide);

        if ($valide['verifiee']) {
            return response()->json([
                // Offers closed by an earlier withdrawal stay closed: one the
                // recruiter shut themselves, because the post was filled,
                // looks exactly the same from here, and reopening both would
                // put filled jobs back on the board.
                'message' => "Entreprise vérifiée : elle peut de nouveau publier ses offres. Celles fermées lors d'un retrait restent fermées, à elle de les republier.",
                'data' => $entreprise->refresh(),
            ]);
        }

        // Withdrawing verification must also pull its live offers down,
        // otherwise the gate only applies at publication time.
        $fermees = $entreprise->offres()
            ->where('statut', StatutOffre::Publiee->value)
            ->update(['statut' => StatutOffre::Fermee->value]);

        /*
         * The recruiter hears it from us, not from an empty board.
         *
         * This closes postings belonging to someone who is not in the room;
         * without a word they would open their dashboard to find them closed,
         * with nothing saying why or by whom.
         */
        if ($fermees > 0 && $utilisateur = $entreprise->user) {
            $notificateur->notifier(
                $utilisateur,
                'Vos offres ont été fermées',
                sprintf(
                    '%s fermée%s car la vérification de votre entreprise a été retirée. Contactez les organisateurs du SANEM : vous pourrez les republier une fois la vérification rétablie.',
                    $fermees === 1 ? 'Une offre a été' : $fermees.' offres ont été',
                    $fermees === 1 ? '' : 's',
                ),
                '/dashboard/recruteur/offres',
                'offre',
            );
        }

        return response()->json([
            'message' => $fermees > 0
                ? sprintf(
                    'Vérification retirée : %d offre%s fermée%s, le recruteur a été prévenu.',
                    $fermees,
                    $fermees === 1 ? '' : 's',
                    $fermees === 1 ? '' : 's',
                )
                : 'Vérification retirée.',
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

    /** Every interview across every company — organiser oversight, not a recruiter's own calendar. */
    public function entretiens(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            Entretien::query()->with([
                'creneau',
                'candidature.offre:id,titre,entreprise_id',
                'candidature.offre.entreprise:id,nom',
                'candidature.profil.user:id,name',
            ]),
            $request,
            recherchables: ['reference'],
            filtrables: ['statut'],
            triables: ['statut', 'created_at'],
        );

        return response()->json([
            'data' => EntretienResource::collection($page->items()),
            'meta' => $this->meta($page),
            'filtres' => [
                'statut' => collect(StatutEntretien::cases())
                    ->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            ],
            'resume' => $this->resumeEntretiens(),
        ]);
    }

    private function resumeEntretiens(): array
    {
        $parStatut = Entretien::selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return [
            'total' => (int) $parStatut->sum(),
            ...collect(StatutEntretien::cases())
                ->mapWithKeys(fn ($s) => [$s->value => (int) ($parStatut[$s->value] ?? 0)])
                ->all(),
        ];
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
