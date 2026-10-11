<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\DocumentInscription;
use App\Models\Inscription;
use App\Services\GestionDocuments;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Back-office access to participant documents — review, download, remove. */
class DocumentAdminController extends Controller
{
    public function __construct(
        private readonly GestionDocuments $documents,
    ) {}

    public function index(Inscription $inscription): JsonResponse
    {
        return response()->json([
            'data' => DocumentResource::collection($inscription->documents()->get()),
        ]);
    }

    /**
     * Streams the file rather than redirecting to it: the private disk has no
     * public URL, so this route is the only way the bytes leave the server and
     * every read passes the auth + role middleware.
     */
    public function download(DocumentInscription $document): StreamedResponse
    {
        return $document->contenu();
    }

    public function destroy(DocumentInscription $document): JsonResponse
    {
        $this->documents->supprimer($document);

        return response()->json(['message' => 'Document supprimé.']);
    }
}
