<?php

namespace App\Http\Controllers\Api\Entreprise;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntrepriseRequest;
use App\Http\Resources\EntrepriseResource;
use App\Models\Entreprise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** The recruiter's own company record. */
class EntrepriseController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $entreprise = $request->user()->entrepriseActive();

        if (! $entreprise) {
            return response()->json([
                'data' => null,
                'message' => "Aucune entreprise n'est encore associée à votre compte.",
            ]);
        }

        return response()->json(['data' => new EntrepriseResource($entreprise)]);
    }

    /**
     * Creates the company on first save, updates it afterwards. A recruiter
     * signs up before they have described their company, so the record cannot
     * be required at registration.
     */
    public function store(EntrepriseRequest $request): JsonResponse
    {
        $user = $request->user();
        $existante = $user->entrepriseActive();

        if ($existante) {
            $existante->update($request->validated());

            return response()->json([
                'message' => 'Profil entreprise mis à jour.',
                'data' => new EntrepriseResource($existante->refresh()),
            ]);
        }

        $entreprise = Entreprise::create([
            ...$request->validated(),
            'user_id' => $user->id,
            // Verification is an organiser's decision, never the applicant's.
            'verifiee' => false,
        ]);

        return response()->json([
            'message' => 'Profil entreprise créé. Il sera vérifié par les organisateurs avant publication de vos offres.',
            'data' => new EntrepriseResource($entreprise),
        ], 201);
    }
}
