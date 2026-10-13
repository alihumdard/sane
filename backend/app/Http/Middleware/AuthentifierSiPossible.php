<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the Sanctum user on a public route, without ever refusing the request.
 *
 * Some pages are readable by anyone but show more to a signed-in visitor: an
 * offer tells a job seeker that they have already applied, or saved it as a
 * favourite. `auth:sanctum` cannot do that job — it rejects anonymous callers,
 * and the offer must stay public. Without any guard, `$request->user()` is
 * always null even when the caller did send a valid token, so the extra fields
 * silently never appear.
 */
class AuthentifierSiPossible
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken() && ($user = Auth::guard('sanctum')->user())) {
            // Bound for the rest of the request, so `$request->user()` and the
            // `auth()` helper both see them, exactly as on a guarded route.
            Auth::setUser($user);
        }

        return $next($request);
    }
}
