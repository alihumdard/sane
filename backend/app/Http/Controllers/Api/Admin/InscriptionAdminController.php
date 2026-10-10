<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\StatutInscription;
use App\Enums\TypeParticipation;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Resources\InscriptionResource;
use App\Mail\InscriptionAnnulee;
use App\Mail\InscriptionConfirmee;
use App\Models\Edition;
use App\Models\Inscription;
use App\Services\GestionPlaces;
use App\Services\Notificateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InscriptionAdminController extends Controller
{
    use FiltreLesListes;

    public function __construct(
        private readonly GestionPlaces $places,
        private readonly Notificateur $notificateur,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Inscription::query()->with(['formations.categorie', 'edition:id,annee']);

        if ($editionId = $request->integer('edition_id')) {
            $query->where('edition_id', $editionId);
        }

        $page = $this->listePaginee(
            $query,
            $request,
            recherchables: ['nom', 'email', 'telephone', 'reference', 'ville'],
            filtrables: ['statut', 'type_participation', 'ville', 'domaine'],
            triables: ['nom', 'email', 'ville', 'statut', 'created_at'],
        );

        return response()->json([
            'data' => InscriptionResource::collection($page->items()),
            'meta' => $this->meta($page),
            'filtres' => [
                'statut' => collect(StatutInscription::cases())
                    ->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
                'type_participation' => collect(TypeParticipation::cases())
                    ->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
                'ville' => Inscription::distinct()->whereNotNull('ville')->orderBy('ville')->pluck('ville'),
            ],
            'resume' => $this->resume($request->integer('edition_id') ?: Edition::active()?->id),
        ]);
    }

    public function show(Inscription $inscription): JsonResponse
    {
        $inscription->load(['formations.categorie', 'documents', 'edition', 'confirmeePar:id,name']);

        return response()->json(['data' => new InscriptionResource($inscription)]);
    }

    /** Admin validation: en_attente → confirmee | annulee. */
    public function changerStatut(Request $request, Inscription $inscription): JsonResponse
    {
        $valide = $request->validate([
            'statut' => ['required', Rule::enum(StatutInscription::class)],
            'note_admin' => ['nullable', 'string', 'max:1000'],
        ]);

        $nouveau = StatutInscription::from($valide['statut']);

        if ($inscription->statut === $nouveau) {
            return response()->json([
                'message' => "Cette inscription est déjà « {$nouveau->label()} ».",
            ], 422);
        }

        // Cancelling frees the seats; they are not re-taken if it is un-cancelled,
        // since by then someone else may hold them.
        if ($nouveau === StatutInscription::Annulee) {
            $this->places->liberer($inscription);
        }

        $inscription->update([
            'statut' => $nouveau,
            'note_admin' => $valide['note_admin'] ?? $inscription->note_admin,
            'confirmee_le' => $nouveau === StatutInscription::Confirmee ? now() : null,
            'confirmee_par' => $nouveau === StatutInscription::Confirmee ? $request->user()->id : null,
        ]);

        $inscription->load(['formations.categorie', 'documents', 'edition']);

        $mail = match ($nouveau) {
            StatutInscription::Confirmee => new InscriptionConfirmee($inscription),
            StatutInscription::Annulee => new InscriptionAnnulee($inscription),
            default => null,
        };

        $envoye = $mail === null || $this->notificateur->envoyer(
            $mail,
            ['inscription' => $inscription->reference]
        );

        return response()->json([
            'message' => $envoye
                ? "Inscription « {$nouveau->label()} ». Le participant a été notifié par email."
                : "Inscription « {$nouveau->label()} ». L'email n'a pas pu être envoyé.",
            'data' => new InscriptionResource($inscription),
        ]);
    }

    public function destroy(Inscription $inscription): JsonResponse
    {
        $this->places->liberer($inscription);
        $inscription->delete();

        return response()->json(['message' => 'Inscription supprimée.']);
    }

    /** Bulk delete — the admin table already offers multi-select. */
    public function destroyPlusieurs(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:100'],
            'ids.*' => ['integer', 'exists:inscriptions,id'],
        ]);

        $inscriptions = Inscription::whereIn('id', $valide['ids'])->get();

        foreach ($inscriptions as $inscription) {
            $this->places->liberer($inscription);
            $inscription->delete();
        }

        return response()->json([
            'message' => $inscriptions->count().' inscription(s) supprimée(s).',
        ]);
    }

    private function resume(?int $editionId): array
    {
        if (! $editionId) {
            return ['total' => 0, 'en_attente' => 0, 'confirmee' => 0, 'annulee' => 0];
        }

        $counts = Inscription::where('edition_id', $editionId)
            ->selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return [
            'total' => $counts->sum(),
            'en_attente' => $counts[StatutInscription::EnAttente->value] ?? 0,
            'confirmee' => $counts[StatutInscription::Confirmee->value] ?? 0,
            'annulee' => $counts[StatutInscription::Annulee->value] ?? 0,
        ];
    }
}
