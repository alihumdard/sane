<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Referentiels;
use Illuminate\Http\JsonResponse;

/**
 * The option lists the forms offer.
 *
 * Public, because the registration form is filled in before anyone has an
 * account. Served from one place so the sector a participant picks is spelled
 * exactly like the sector a company picks — the matching engine compares them
 * as text.
 */
class ReferentielController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'secteurs' => Referentiels::SECTEURS,
            // Kept grouped: eighty-odd nationalities in one flat list is not a
            // dropdown anyone can use, so the form renders them under optgroups.
            'nationalites' => Referentiels::NATIONALITES,
            'villes' => Referentiels::VILLES,
        ]);
    }
}
