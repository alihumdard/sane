<?php

namespace App\Http\Controllers\Api;

use App\Enums\StatutInscription;
use App\Exceptions\PlacesEpuiseesException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInscriptionRequest;
use App\Http\Resources\InscriptionResource;
use App\Mail\InscriptionRecue;
use App\Models\Edition;
use App\Models\Inscription;
use App\Services\GestionPlaces;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class InscriptionController extends Controller
{
    public function __construct(private readonly GestionPlaces $places) {}

    public function store(StoreInscriptionRequest $request): JsonResponse
    {
        $edition = Edition::active();

        if (! $edition || ! $edition->inscriptions_ouvertes) {
            return response()->json([
                'message' => 'Les inscriptions ne sont pas ouvertes actuellement.',
            ], 422);
        }

        $donnees = $request->validated();
        $formationIds = $donnees['formations'] ?? [];
        unset($donnees['formations']);

        try {
            $inscription = DB::transaction(function () use ($donnees, $formationIds, $edition) {
                $inscription = Inscription::create([
                    ...$donnees,
                    'edition_id' => $edition->id,
                    'user_id' => auth()->id(),
                    'reference' => Inscription::genererReference($edition),
                    'statut' => StatutInscription::EnAttente,
                ]);

                $this->places->reserver($inscription, $formationIds);

                return $inscription;
            });
        } catch (PlacesEpuiseesException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => ['formations' => [$e->getMessage()]],
            ], 409);
        }

        $inscription->load(['formations.categorie', 'formations.formateur', 'edition']);

        // The registration is already committed, so a mail failure must not fail
        // the request — the participant would retry and hit the unique email rule.
        try {
            Mail::send(new InscriptionRecue($inscription));
        } catch (Throwable $e) {
            Log::error('Envoi de l\'email de confirmation échoué', [
                'inscription' => $inscription->reference,
                'erreur' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Votre inscription a bien été enregistrée. Vous recevrez un email de confirmation.',
            'data' => new InscriptionResource($inscription),
        ], 201);
    }

    /** Public recap, reachable with the reference the participant was given. */
    public function show(string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)
            ->with(['formations.categorie', 'formations.formateur', 'documents', 'edition'])
            ->firstOrFail();

        return response()->json(['data' => new InscriptionResource($inscription)]);
    }
}
