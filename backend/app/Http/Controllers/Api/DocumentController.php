<?php

namespace App\Http\Controllers\Api;

use App\Enums\TypeDocument;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\DocumentInscription;
use App\Models\Inscription;
use App\Services\GestionDocuments;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function __construct(private readonly GestionDocuments $documents) {}

    /**
     * Upload into one of the four slots.
     *
     * Registration is public, so the route is too — but it is keyed by the
     * reference, which is only ever shown to the participant who registered.
     * Guessing one gets you nothing: an unknown reference 404s.
     */
    public function store(StoreDocumentRequest $request, string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)->firstOrFail();

        $document = $this->documents->enregistrer(
            $inscription,
            TypeDocument::from($request->string('type')->value()),
            $request->file('fichier'),
        );

        $inscription->load('documents');

        return response()->json([
            'message' => "« {$document->type->label()} » enregistré.",
            'data' => $this->presenter($document),
            'manquants' => $this->documents->manquants($inscription),
        ], 201);
    }

    /** What has been uploaded so far, and what is still missing. */
    public function index(string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)
            ->with('documents')
            ->firstOrFail();

        return response()->json([
            'data' => $inscription->documents->map(fn ($d) => $this->presenter($d)),
            'manquants' => $this->documents->manquants($inscription),
            'attendus' => collect(TypeDocument::cases())->map(fn (TypeDocument $t) => [
                'type' => $t->value,
                'label' => $t->label(),
                'obligatoire' => $t->obligatoire(),
                'formats' => strtoupper(str_replace(',', ', ', $t->mimes())),
                'taille_max_mo' => round(TypeDocument::TAILLE_MAX_KO / 1024, 1),
            ]),
        ]);
    }

    public function destroy(string $reference, DocumentInscription $document): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)->firstOrFail();

        abort_unless($document->inscription_id === $inscription->id, 404);

        $label = $document->type->label();
        $this->documents->supprimer($document);

        return response()->json(['message' => "« {$label} » supprimé."]);
    }

    /**
     * Streams the file. Reached by id rather than path, so the storage layout
     * is never exposed and the row is checked against the registration first.
     */
    public function telecharger(string $inscription, DocumentInscription $document): StreamedResponse
    {
        abort_unless((string) $document->inscription_id === $inscription, 404);
        abort_unless(Storage::disk(GestionDocuments::DISQUE)->exists($document->chemin), 404);

        return Storage::disk(GestionDocuments::DISQUE)->download(
            $document->chemin,
            $document->nom_original,
        );
    }

    private function presenter(DocumentInscription $document): array
    {
        return [
            'id' => $document->id,
            'type' => $document->type->value,
            'type_label' => $document->type->label(),
            'nom_original' => $document->nom_original,
            'taille' => $document->taille,
            'url' => $document->url(),
            'created_at' => $document->created_at->toIso8601String(),
        ];
    }
}
