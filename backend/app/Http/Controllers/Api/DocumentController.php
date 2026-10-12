<?php

namespace App\Http\Controllers\Api;

use App\Enums\StatutInscription;
use App\Enums\TypeDocument;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\DocumentInscription;
use App\Models\Inscription;
use App\Services\GestionDocuments;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Participant-facing document upload.
 *
 * The participant has no account — they hold a reference and the email they
 * registered with. References are sequential (INS2026-0001), so the reference
 * alone is guessable and cannot be the sole key to attaching or reading
 * someone's identity papers; both must match before anything is written or
 * returned.
 */
class DocumentController extends Controller
{
    public function __construct(
        private readonly GestionDocuments $documents,
    ) {}

    /** Upload into one of the four slots. */
    public function store(StoreDocumentRequest $request, string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)->firstOrFail();

        if ($refus = $this->refuser($inscription, $request->string('email'))) {
            return $refus;
        }

        // A cancelled registration is closed; a confirmed one has already been
        // reviewed, and letting its papers change afterwards would undo the check.
        if ($inscription->statut !== StatutInscription::EnAttente) {
            return response()->json([
                'message' => "Cette inscription est « {$inscription->statut->label()} » : les documents ne peuvent plus être modifiés.",
            ], 409);
        }

        $document = $this->documents->enregistrer(
            $inscription,
            TypeDocument::from($request->string('type')->value()),
            $request->file('fichier'),
        );

        $inscription->load('documents');

        return response()->json([
            'message' => "Le document « {$document->type->label()} » a bien été envoyé.",
            'data' => new DocumentResource($document),
            'manquants' => $this->documents->manquants($inscription),
        ], 201);
    }

    /** What has been uploaded so far, and what is still missing. */
    public function index(Request $request, string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)
            ->with('documents')
            ->firstOrFail();

        if ($refus = $this->refuser($inscription, $request->string('email'))) {
            return $refus;
        }

        return response()->json([
            'data' => DocumentResource::collection($inscription->documents),
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

    public function destroy(Request $request, string $reference, DocumentInscription $document): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)->firstOrFail();

        if ($refus = $this->refuser($inscription, $request->string('email'))) {
            return $refus;
        }

        abort_unless($document->inscription_id === $inscription->id, 404);

        $label = $document->type->label();
        $this->documents->supprimer($document);

        return response()->json(['message' => "« {$label} » supprimé."]);
    }

    /**
     * Streams the file to a member of staff. Reached by id rather than path,
     * so the storage layout is never exposed, and the row is checked against
     * the registration first.
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

    /**
     * Returns a refusal when the email does not match, or null when it does.
     *
     * Compared case-insensitively and in constant time, so that neither casing
     * nor response timing distinguishes a wrong email from a right one.
     */
    private function refuser(Inscription $inscription, mixed $email): ?JsonResponse
    {
        $correspond = hash_equals(
            mb_strtolower($inscription->email),
            mb_strtolower(trim((string) $email)),
        );

        if ($correspond) {
            return null;
        }

        return response()->json([
            'message' => "L'adresse email ne correspond pas à cette inscription.",
            'errors' => ['email' => ["L'adresse email ne correspond pas à cette inscription."]],
        ], 403);
    }
}
