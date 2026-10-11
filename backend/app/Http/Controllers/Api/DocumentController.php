<?php

namespace App\Http\Controllers\Api;

use App\Enums\StatutInscription;
use App\Enums\TypeDocument;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Inscription;
use App\Services\GestionDocuments;
use Illuminate\Http\JsonResponse;

/**
 * Participant-facing document upload.
 *
 * The participant has no account — they hold a reference and the email they
 * registered with, and both must match before anything is written.
 */
class DocumentController extends Controller
{
    public function __construct(
        private readonly GestionDocuments $documents,
    ) {}

    public function store(StoreDocumentRequest $request, string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)->firstOrFail();

        if (! $this->appartientA($inscription, $request->string('email'))) {
            return response()->json([
                'message' => "L'adresse email ne correspond pas à cette inscription.",
                'errors' => ['email' => ["L'adresse email ne correspond pas à cette inscription."]],
            ], 403);
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

        return response()->json([
            'message' => "Le document « {$document->type->label()} » a bien été envoyé.",
            'data' => new DocumentResource($document),
        ], 201);
    }

    /** Lets the participant see what they have already sent, before validation. */
    public function index(string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)
            ->with('documents')
            ->firstOrFail();

        if (! $this->appartientA($inscription, request()->string('email'))) {
            return response()->json([
                'message' => "L'adresse email ne correspond pas à cette inscription.",
            ], 403);
        }

        return response()->json([
            'data' => DocumentResource::collection($inscription->documents),
            'requis' => collect(TypeDocument::cases())->map(fn (TypeDocument $t) => [
                'value' => $t->value,
                'label' => $t->label(),
                'obligatoire' => $t->obligatoire(),
                'formats' => $t->mimes(),
                'taille_max_ko' => TypeDocument::TAILLE_MAX_KO,
            ]),
        ]);
    }

    /**
     * Compared case-insensitively and in constant time, so that neither casing
     * nor response timing distinguishes a wrong email from a right one.
     */
    private function appartientA(Inscription $inscription, mixed $email): bool
    {
        return hash_equals(
            mb_strtolower($inscription->email),
            mb_strtolower(trim((string) $email)),
        );
    }
}
