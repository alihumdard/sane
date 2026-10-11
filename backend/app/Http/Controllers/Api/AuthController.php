<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleUtilisateur;
use App\Http\Controllers\Controller;
use App\Http\Requests\InscriptionCompteRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Self-service account creation (Phase 5 — « Inscription/connexion »).
     *
     * A jobseeker gets their profile immediately so the rest of the space has a
     * row to hang off; a recruiter's company is created in the recruiter space,
     * where the company details are actually collected.
     */
    public function inscription(InscriptionCompteRequest $request): JsonResponse
    {
        $valide = $request->validated();

        $user = DB::transaction(function () use ($valide) {
            $user = User::create([
                'name' => $valide['nom'],
                'email' => $valide['email'],
                'telephone' => $valide['telephone'] ?? null,
                'password' => $valide['password'],
                'role' => $valide['role'],
                'statut' => 'actif',
            ]);

            if ($user->role === RoleUtilisateur::Demandeur) {
                $user->profilDemandeur()->create();
            }

            return $user;
        });

        return response()->json([
            'message' => 'Votre compte a bien été créé.',
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $this->profil($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! auth()->validate($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Ces identifiants ne correspondent à aucun compte.'],
            ]);
        }

        if ($user->statut !== 'actif') {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé.'],
            ]);
        }

        $user->update(['derniere_connexion_le' => now()]);

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $this->profil($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->profil($request->user())]);
    }

    private function profil(User $user): array
    {
        return [
            'id' => $user->id,
            'nom' => $user->name,
            'email' => $user->email,
            'telephone' => $user->telephone,
            'role' => $user->role->value,
            'role_label' => $user->role->label(),
            'photo' => $user->photo,
        ];
    }
}
