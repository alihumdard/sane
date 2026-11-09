<?php

use App\Http\Middleware\AuthentifierSiPossible;
use App\Http\Middleware\EntetesSecurite;
use App\Http\Middleware\PiegeARobots;
use App\Http\Middleware\RefuserCorpsIllisible;
use App\Http\Middleware\VerifierRole;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\InvalidSignatureException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => VerifierRole::class,
            'auth.facultatif' => AuthentifierSiPossible::class,
            'piege' => PiegeARobots::class,
        ]);

        $middleware->api(prepend: [
            RefuserCorpsIllisible::class,
        ]);

        $middleware->api(append: [
            EntetesSecurite::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
         * API clients get JSON with a French message, never an HTML error page
         * or a stack trace. Without this, an unauthenticated API call is
         * redirected to a login route that does not exist on an API-only app.
         */
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Authentification requise.'], 401);
            }
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage() ?: "Vous n'avez pas les droits nécessaires pour cette action.",
                ], 403);
            }
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                // Deliberately generic: naming the model would confirm which
                // records exist to someone probing for ids.
                return response()->json(['message' => 'Ressource introuvable.'], 404);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Ressource introuvable.'], 404);
            }
        });

        /*
         * Un lien signé périmé ou trafiqué. Laravel répond « Invalid
         * signature. » en anglais, ce que lit la personne qui ouvre un lien
         * de confirmation vieux de trois jours — alors que la page attend un
         * message à lui montrer, en français, et qu'il n'y a rien d'anormal à
         * ce que ce lien ait expiré.
         */
        $exceptions->render(function (InvalidSignatureException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Ce lien n\'est plus valable. Il a peut-être expiré : demandez-en un nouveau.',
                ], 403);
            }
        });

        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Trop de requêtes. Veuillez patienter quelques instants.',
                ], 429);
            }
        });
    })->create();
