<?php

namespace App\Http\Controllers\Api;

use App\Enums\TypeDocument;
use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentCandidatureResource;
use App\Models\DocumentCandidature;
use App\Models\ProfilDemandeur;
use App\Services\GestionDocuments;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * CVs and cover letters on a jobseeker profile.
 *
 * Reuses GestionDocuments so these files get the same treatment as the Phase 4
 * documents: private disk, UUID filenames, content-sniffed format check.
 */
class DocumentCandidatureController extends Controller
{
    public function __construct(
        private readonly GestionDocuments $documents,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'type' => ['required', Rule::in([TypeDocument::Cv->value, TypeDocument::LettreMotivation->value])],
            'fichier' => ['required', 'file', 'max:'.TypeDocument::TAILLE_MAX_KO],
        ], [
            'fichier.max' => 'Le fichier ne doit pas dépasser 2 Mo.',
            'type.in' => 'Seuls un CV ou une lettre de motivation peuvent être déposés ici.',
        ]);

        $type = TypeDocument::from($valide['type']);

        // The declared extension is never trusted; the file's own bytes decide.
        $extension = strtolower((string) $request->file('fichier')->guessExtension());

        if (! in_array($extension, explode(',', $type->mimes()), true)) {
            return response()->json([
                'message' => sprintf('Le document doit être au format %s.', strtoupper($type->mimes())),
                'errors' => ['fichier' => [sprintf('Le document doit être au format %s.', strtoupper($type->mimes()))]],
            ], 422);
        }

        $profil = $this->profil($request);

        $document = $this->documents->enregistrerPourProfil($profil, $type, $request->file('fichier'));

        return response()->json([
            'message' => "Le document « {$type->label()} » a bien été envoyé.",
            'data' => new DocumentCandidatureResource($document),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => DocumentCandidatureResource::collection(
                $this->profil($request)->documents()->latest()->get()
            ),
        ]);
    }

    public function download(Request $request, DocumentCandidature $document): StreamedResponse
    {
        abort_unless($this->peutLire($request, $document), 403, 'Ce document ne vous est pas accessible.');

        return $document->contenu();
    }

    public function destroy(Request $request, DocumentCandidature $document): JsonResponse
    {
        abort_unless($document->profil_id === $this->profil($request)->id, 403);

        $this->documents->supprimerDocument($document);

        return response()->json(['message' => 'Document supprimé.']);
    }

    /**
     * Its owner, an organiser, or a recruiter the candidate actually applied to.
     * A recruiter browsing the candidate search cannot pull down CVs.
     */
    private function peutLire(Request $request, DocumentCandidature $document): bool
    {
        $user = $request->user();

        if ($user->role->estAdministratif()) {
            return true;
        }

        if ($user->profilDemandeur?->id === $document->profil_id) {
            return true;
        }

        $entreprise = $user->entreprise;

        return $entreprise !== null
            && $document->profil->candidatures()
                ->whereHas('offre', fn ($q) => $q->where('entreprise_id', $entreprise->id))
                ->exists();
    }

    private function profil(Request $request): ProfilDemandeur
    {
        return $request->user()->profilDemandeurOuCreer();
    }
}
