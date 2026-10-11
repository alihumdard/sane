<?php

namespace App\Http\Controllers\Api\Entreprise;

use App\Enums\ModeEntretien;
use App\Exceptions\EntretienImpossibleException;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreneauResource;
use App\Http\Resources\EntretienResource;
use App\Models\Candidature;
use App\Models\CreneauEntretien;
use App\Models\Entreprise;
use App\Models\Entretien;
use App\Services\GestionEntretiens;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Slots and interviews, from the recruiter's side. */
class EntretienEntrepriseController extends Controller
{
    use FiltreLesListes;

    public function __construct(
        private readonly GestionEntretiens $entretiens,
    ) {}

    /* ─── Créneaux ─── */

    public function creneaux(Request $request): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        $query = CreneauEntretien::where('entreprise_id', $entreprise->id)
            ->with('entretien.candidature.profil.user:id,name')
            ->orderBy('debut');

        if ($request->boolean('disponibles')) {
            $query->disponibles();
        }

        return response()->json(['data' => CreneauResource::collection($query->get())]);
    }

    public function creerCreneau(Request $request): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        $valide = $request->validate([
            'debut' => ['required', 'date', 'after:now'],
            'fin' => ['required', 'date', 'after:debut'],
            'mode' => ['required', Rule::enum(ModeEntretien::class)],
            'lieu' => ['nullable', 'string', 'max:255'],
        ], [
            'debut.after' => 'Le créneau doit se situer dans le futur.',
            'fin.after' => 'La fin doit suivre le début.',
        ]);

        // An in-person interview without an address is not actionable.
        if (ModeEntretien::from($valide['mode'])->demandeUnLieu() && empty($valide['lieu'])) {
            return response()->json([
                'message' => 'Un entretien en présentiel nécessite un lieu.',
                'errors' => ['lieu' => ['Un entretien en présentiel nécessite un lieu.']],
            ], 422);
        }

        if ($this->chevauche($entreprise, $valide['debut'], $valide['fin'])) {
            return response()->json([
                'message' => 'Ce créneau en chevauche un autre.',
                'errors' => ['debut' => ['Ce créneau en chevauche un autre.']],
            ], 422);
        }

        $creneau = CreneauEntretien::create([...$valide, 'entreprise_id' => $entreprise->id]);

        return response()->json([
            'message' => 'Créneau ajouté.',
            'data' => new CreneauResource($creneau),
        ], 201);
    }

    public function supprimerCreneau(Request $request, CreneauEntretien $creneau): JsonResponse
    {
        $this->exigerProprietaire($request, $creneau->entreprise_id);

        if ($creneau->reserve) {
            return response()->json([
                'message' => 'Ce créneau est réservé : annulez d\'abord l\'entretien.',
            ], 409);
        }

        $creneau->delete();

        return response()->json(['message' => 'Créneau supprimé.']);
    }

    /* ─── Entretiens ─── */

    public function index(Request $request): JsonResponse
    {
        $entreprise = $this->entreprise($request);

        $query = Entretien::query()
            ->whereHas('candidature.offre', fn (Builder $q) => $q->where('entreprise_id', $entreprise->id))
            ->with(['creneau', 'candidature.offre:id,titre,slug,statut,date_limite', 'candidature.profil.user:id,name,photo'])
            ->join('creneaux_entretien', 'entretiens.creneau_id', '=', 'creneaux_entretien.id')
            ->orderBy('creneaux_entretien.debut')
            ->select('entretiens.*');

        if ($request->filled('statut')) {
            $query->where('entretiens.statut', $request->query('statut'));
        }

        $page = $query->paginate(min($request->integer('par_page') ?: 20, 50));

        $items = collect($page->items())->each(fn (Entretien $e) => $e->noteVisible = true);

        return response()->json([
            'data' => EntretienResource::collection($items),
            'meta' => $this->meta($page),
        ]);
    }

    public function proposer(Request $request, Candidature $candidature): JsonResponse
    {
        $this->authorize('update', $candidature);

        $valide = $request->validate([
            'creneau_id' => ['required', 'integer', 'exists:creneaux_entretien,id'],
            'lien_visio' => ['nullable', 'url', 'max:255'],
        ]);

        $creneau = CreneauEntretien::findOrFail($valide['creneau_id']);

        try {
            $entretien = $this->entretiens->proposer(
                $candidature,
                $creneau,
                $valide['lien_visio'] ?? null,
            );
        } catch (EntretienImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        $entretien->noteVisible = true;

        return response()->json([
            'message' => 'Entretien proposé. Le candidat a été notifié par email.',
            'data' => new EntretienResource($entretien),
        ], 201);
    }

    public function annuler(Request $request, Entretien $entretien): JsonResponse
    {
        $this->authorize('update', $entretien->candidature);

        $valide = $request->validate(['motif' => ['nullable', 'string', 'max:500']]);

        try {
            $entretien = $this->entretiens->annuler($entretien, $valide['motif'] ?? null);
        } catch (EntretienImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'message' => 'Entretien annulé. Le candidat a été notifié.',
            'data' => new EntretienResource($entretien->load('creneau')),
        ]);
    }

    public function terminer(Request $request, Entretien $entretien): JsonResponse
    {
        $this->authorize('update', $entretien->candidature);

        $valide = $request->validate(['note' => ['nullable', 'string', 'max:2000']]);

        try {
            $entretien = $this->entretiens->terminer($entretien, $valide['note'] ?? null);
        } catch (EntretienImpossibleException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        $entretien->noteVisible = true;

        return response()->json([
            'message' => 'Entretien marqué comme terminé.',
            'data' => new EntretienResource($entretien->load('creneau')),
        ]);
    }

    /* ─── Interne ─── */

    private function entreprise(Request $request): Entreprise
    {
        $entreprise = $request->user()->entrepriseActive();

        abort_if($entreprise === null, 409, "Créez d'abord le profil de votre entreprise.");

        return $entreprise;
    }

    private function exigerProprietaire(Request $request, int $entrepriseId): void
    {
        abort_unless(
            $this->entreprise($request)->id === $entrepriseId,
            403,
            'Ce créneau ne vous appartient pas.',
        );
    }

    /** Two interviews at once would double-book the same interviewer. */
    private function chevauche(Entreprise $entreprise, string $debut, string $fin): bool
    {
        return CreneauEntretien::where('entreprise_id', $entreprise->id)
            ->where('debut', '<', $fin)
            ->where('fin', '>', $debut)
            ->exists();
    }
}
