<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * A request whose JSON body cannot be read is refused, not treated as empty.
 *
 * Laravel hands an unparseable body to the controller as no input at all. On
 * an endpoint where every field is optional — a profile update, say — that
 * passes validation, updates nothing and answers « Profil mis à jour. ». The
 * person is told their work is saved when none of it arrived, and no error is
 * written anywhere, so nobody finds out until they come back to an empty form.
 *
 * A truncated body is what a dropped connection leaves behind, which is not
 * rare on the connections this site is used over.
 */
class RefuserCorpsIllisible
{
    public function handle(Request $request, Closure $next): Response
    {
        $corps = $request->getContent();

        if ($request->isJson() && $corps !== '') {
            json_decode($corps, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'message' => "Votre demande n'est pas arrivée en entier. Vérifiez votre connexion et réessayez.",
                ], 400);
            }
        }

        return $next($request);
    }
}
