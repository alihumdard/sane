<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Le piège à robots des formulaires publics.
 *
 * Deux signaux, aucun des deux visible pour la personne qui remplit :
 *
 * 1. **Un champ appât.** Invisible à l'écran, nommé comme un champ banal.
 *    Un humain ne le voit pas et ne le remplit pas ; un robot qui remplit
 *    tout ce qu'il trouve le remplit.
 *
 * 2. **Le temps passé.** Un formulaire en plusieurs étapes soumis en moins de
 *    trois secondes n'a pas été lu. L'horodatage d'ouverture est chiffré par
 *    le serveur, donc ni lisible ni falsifiable depuis le navigateur.
 *
 * Ce qui se passe quand le piège se referme est le point important : la
 * requête reçoit un **faux succès**, et rien n'est créé. Une erreur 422
 * apprendrait au robot ce qui l'a trahi, et la prochaine version du script
 * contournerait le contrôle. Un succès le laisse repartir satisfait.
 *
 * Le piège n'est pas une défense à lui seul — il arrête les robots bêtes, qui
 * sont l'immense majorité. Ce qui reste est arrêté par la vérification de
 * l'email, le throttle et la liste des domaines jetables.
 */
class PiegeARobots
{
    public function handle(Request $request, Closure $next, string $message = null): Response
    {
        $champ = config('antiabus.piege.champ', 'site_web');

        if (filled($request->input($champ))) {
            return $this->fauxSucces($request, 'champ appât rempli', $message);
        }

        if ($motif = $this->delaiSuspect($request)) {
            return $this->fauxSucces($request, $motif, $message);
        }

        return $next($request);
    }

    /**
     * Retourne le motif du refus, ou null si le délai est plausible.
     *
     * L'absence d'horodatage n'est pas un refus : un client qui n'en envoie
     * pas — une ancienne page encore ouverte, un appel légitime hors
     * navigateur — ne doit pas être bloqué par un contrôle que rien ne lui a
     * demandé de passer. Le reste des défenses s'applique toujours.
     */
    private function delaiSuspect(Request $request): ?string
    {
        $jeton = $request->input('_ouvert_le');

        if (blank($jeton)) {
            return null;
        }

        try {
            $ouvertLe = (int) Crypt::decryptString($jeton);
        } catch (\Throwable) {
            // Un horodatage illisible a été fabriqué ou trafiqué : le client
            // honnête renvoie celui que nous lui avons donné, tel quel.
            return 'horodatage illisible';
        }

        $ecoule = time() - $ouvertLe;

        if ($ecoule < config('antiabus.piege.delai_minimal', 3)) {
            return "soumis en {$ecoule}s";
        }

        if ($ecoule > config('antiabus.piege.delai_maximal', 21600)) {
            return 'horodatage périmé';
        }

        return null;
    }

    /**
     * Le journal est le seul endroit où ces refus se voient : c'est lui qui
     * permettra de dire, le jour venu, si une vague de faux trafic a eu lieu.
     */
    private function fauxSucces(Request $request, string $motif, ?string $message): Response
    {
        Log::info('Piège à robots déclenché', [
            'motif' => $motif,
            'route' => $request->path(),
            'ip' => $request->ip(),
            'agent' => substr((string) $request->userAgent(), 0, 200),
        ]);

        return response()->json([
            'message' => $message ?: 'Votre demande a bien été enregistrée. Vous recevrez un email de confirmation.',
        ], 201);
    }
}
