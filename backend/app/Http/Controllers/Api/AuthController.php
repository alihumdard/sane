<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleUtilisateur;
use App\Http\Controllers\Controller;
use App\Http\Requests\InscriptionCompteRequest;
use App\Mail\BienvenueCompte;
use App\Mail\MotDePasseOublie;
use App\Mail\VerifierEmail;
use App\Models\User;
use App\Services\Notificateur;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly Notificateur $notificateur) {}

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

        // Les champs du piège n'ont rien à faire en base.
        unset($valide[config('antiabus.piege.champ', 'site_web')], $valide['_ouvert_le']);

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

        /*
         * Hors de la transaction, et sans faire échouer la création.
         *
         * Le compte existe : si le serveur de messagerie refuse, répondre que
         * l'inscription a échoué serait faux, et la retenter créerait un
         * doublon. L'échec part donc dans le journal, où il se voit, plutôt
         * qu'à l'écran — et l'email de confirmation se renvoie depuis la page
         * de connexion.
         *
         * La confirmation d'abord : c'est elle qui débloque le compte.
         */
        $this->notificateur->envoyer(
            new VerifierEmail($user),
            ['user_id' => $user->id, 'motif' => 'inscription'],
        );

        $this->notificateur->envoyer(
            new BienvenueCompte($user),
            ['user_id' => $user->id],
        );

        /*
         * Aucun jeton n'est délivré ici, contrairement à avant.
         *
         * Le compte ne sert à rien tant que l'adresse n'est pas confirmée :
         * connecter la personne sur-le-champ lui ferait découvrir le verrou à
         * sa prochaine visite, une fois le message de bienvenue oublié.
         */
        return response()->json([
            'message' => 'Votre compte a bien été créé. Confirmez votre adresse email pour l\'activer.',
            'verification_requise' => true,
            'email' => $user->email,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::whereRaw('lower(email) = ?', [mb_strtolower($credentials['email'])])->first();

        /*
         * Hash::check plutôt que auth()->validate().
         *
         * `auth()` rend le garde courant, qui n'est pas toujours celui des
         * sessions : sur une requête déjà authentifiée — un jeton Sanctum
         * encore en place, quelqu'un qui rouvre la page de connexion sans
         * s'être déconnecté — c'est le garde `sanctum` qui répond, et il
         * n'implémente pas validate(). La connexion partait alors en erreur
         * 500 au lieu de refuser poliment.
         *
         * Le hash factice quand le compte n'existe pas garde la durée de
         * réponse constante : sans lui, une réponse immédiate signale « cette
         * adresse n'existe pas » à qui mesure le temps.
         */
        $empreinte = $user?->password
            ?? '$2y$12$usuRQtkxnNS5pGUbNdH6qu5DRaJNMLYZYCfJaIEGqcEo1SmCKBbmy';

        if (! Hash::check($credentials['password'], $empreinte) || ! $user) {
            throw ValidationException::withMessages([
                'email' => ['Ces identifiants ne correspondent à aucun compte.'],
            ]);
        }

        if ($user->statut !== 'actif') {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé.'],
            ]);
        }

        /*
         * Le verrou. Il arrive après le contrôle du mot de passe, et non avant :
         * dire « confirmez votre adresse » à qui ne connaît pas le mot de passe
         * révélerait qu'un compte existe à cette adresse.
         *
         * Le code accompagne le message pour que la page de connexion puisse
         * proposer le renvoi sans avoir à reconnaître une phrase.
         */
        if (! $user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Confirmez votre adresse email avant de vous connecter. '
                    .'Un lien vous a été envoyé lors de la création de votre compte.'],
                'verification_requise' => ['1'],
            ]);
        }

        $user->update(['derniere_connexion_le' => now()]);

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $this->profil($user),
        ]);
    }

    /**
     * Always reports success, whether or not the email matches an account —
     * confirming it would let anyone probe which emails have accounts here.
     */
    public function motDePasseOublie(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', $request->input('email'))->first();

        if ($user) {
            $token = Password::broker()->createToken($user);
            $lien = sprintf(
                '%s/reinitialiser-mot-de-passe?token=%s&email=%s',
                rtrim(config('app.frontend_url'), '/'),
                $token,
                urlencode($user->email),
            );

            Mail::to($user->email)->send(new MotDePasseOublie($user, $lien));
        }

        return response()->json([
            'message' => 'Si cet email correspond à un compte, un lien de réinitialisation vient de lui être envoyé.',
        ]);
    }

    public function motDePasseReinitialiser(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[A-Za-z])(?=.*\d).+$/'],
        ]);

        $statut = Password::broker()->reset(
            [
                'email' => $valide['email'],
                'token' => $valide['token'],
                'password' => $valide['password'],
                'password_confirmation' => $request->input('password_confirmation'),
            ],
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();

                event(new PasswordReset($user));
            }
        );

        if ($statut !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'token' => [__($statut)],
            ]);
        }

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.']);
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
            'email_verifie' => $user->hasVerifiedEmail(),
        ];
    }
}
