<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Baseline security headers on every API response.
 *
 * HSTS is only sent over HTTPS: asserting it on a plain-HTTP dev server would
 * pin localhost to HTTPS in the developer's browser and lock them out of it.
 */
class EntetesSecurite
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // API responses carry personal data; no shared cache should hold them.
        $response->headers->set('Cache-Control', 'no-store, private');

        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains',
            );
        }

        return $response;
    }
}
