<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerifierEmail;
use App\Models\User;
use App\Services\Notificateur;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

/**
 * La confirmation d'adresse des comptes.
 *
 * Les inscriptions au salon ont leur propre chemin, dans
 * InscriptionController : elles ne reposent pas sur un compte, et leur jeton
 * est stocké en base plutôt que signé.
 */
class VerificationController extends Controller
{
    public function __construct(private readonly Notificateur $notificateur) {}

    /**
     * La route porte le middleware `signed` : Laravel a déjà rejeté une URL
     * trafiquée ou périmée avant d'arriver ici. Restent deux contrôles que la
     * signature ne couvre pas.
     */
    public function verifier(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::find($id);

        if (! $user) {
            // Générique à dessein : confirmer qu'un identifiant n'existe pas
            // revient à dire lesquels existent.
            return response()->json(['message' => 'Ce lien de confirmation n\'est plus valable.'], 404);
        }

        /*
         * L'empreinte porte sur l'adresse en vigueur maintenant, pas sur celle
         * d'hier. Si l'adresse a changé depuis l'envoi, l'ancien lien ne vaut
         * plus rien — sans quoi une demande émise pour une adresse servirait à
         * confirmer la suivante.
         *
         * hash_equals plutôt que == : la comparaison ne doit pas révéler, par
         * sa durée, combien de caractères étaient justes.
         */
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'Ce lien de confirmation n\'est plus valable.'], 403);
        }

        // Idempotent : on clique souvent deux fois, ou le lien est rouvert
        // depuis l'historique. Répondre « erreur » à quelqu'un qui a déjà fait
        // ce qu'on lui demandait n'a pas de sens.
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Votre adresse est déjà confirmée. Vous pouvez vous connecter.',
                'deja_confirme' => true,
            ]);
        }

        $user->markEmailAsVerified();

        event(new Verified($user));

        Log::info('Adresse email confirmée', ['user' => $user->id]);

        return response()->json([
            'message' => 'Votre adresse est confirmée. Vous pouvez maintenant vous connecter.',
            'deja_confirme' => false,
        ]);
    }

    /**
     * Renvoie la demande de confirmation.
     *
     * La réponse est la même que l'adresse corresponde à un compte ou non, et
     * qu'elle soit déjà confirmée ou non. Autrement, ce formulaire devient un
     * annuaire : il suffirait d'essayer des adresses pour savoir lesquelles
     * ont un compte ici.
     */
    public function renvoyer(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $user = User::whereRaw('lower(email) = ?', [mb_strtolower($valide['email'])])->first();

        if ($user && ! $user->hasVerifiedEmail()) {
            $this->notificateur->envoyer(
                new VerifierEmail($user),
                ['user_id' => $user->id, 'motif' => 'renvoi'],
            );
        }

        return response()->json([
            'message' => 'Si un compte existe avec cette adresse et attend une confirmation, '
                .'un nouvel email vient de partir.',
        ]);
    }

    /**
     * L'horodatage que les formulaires publics joignent à leur soumission.
     *
     * Chiffré, et non signé en clair : le navigateur n'a aucune raison de
     * savoir ce qu'il transporte, et un horodatage lisible serait un
     * horodatage qu'on recule d'une minute avant d'envoyer.
     *
     * PiegeARobots le déchiffre et refuse ce qui a été soumis trop vite.
     */
    public function jetonFormulaire(): JsonResponse
    {
        return response()->json([
            'jeton' => Crypt::encryptString((string) time()),
        ]);
    }
}
