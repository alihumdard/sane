<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParametrePlateforme;
use Illuminate\Http\JsonResponse;

/**
 * What the public site is allowed to read from the organisation's settings.
 *
 * The footer, the contact page and the legal pages all want the same handful
 * of facts — a phone number, an address, the social accounts — and all three
 * had them written into the source, where a wrong number means a deployment.
 *
 * Listed field by field rather than returning the record: the settings also
 * hold things a visitor has no business reading.
 */
class ParametrePublicController extends Controller
{
    public function show(): JsonResponse
    {
        $p = ParametrePlateforme::instance();

        return response()->json([
            'data' => [
                'nom' => $p->nom,
                'email' => $p->email,
                'telephone' => $p->telephone,
                'adresse' => $p->adresse,
                'site_web' => $p->site_web,
                'logo_url' => $p->logo_url,

                // Only the accounts that have an address: the interface shows
                // an icon for each key present, so an empty one must not be here.
                'reseaux' => collect(ParametrePlateforme::RESEAUX)
                    ->mapWithKeys(fn (string $r) => [$r => $p->{$r}])
                    ->filter()
                    ->all(),
            ],
        ]);
    }
}
