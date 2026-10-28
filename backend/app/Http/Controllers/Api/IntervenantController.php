<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formateur;
use App\Support\Fichier;
use Illuminate\Http\JsonResponse;

/**
 * The speakers, for the public page.
 *
 * Until now that page listed twelve names written into the frontend, so a
 * speaker added from the administration appeared nowhere a visitor could see
 * them — the organiser filled in a record and the site went on showing the
 * same twelve.
 *
 * Email and telephone are left out: they are there so organisers can reach a
 * speaker, not for the open web.
 */
class IntervenantController extends Controller
{
    public function index(): JsonResponse
    {
        $formateurs = Formateur::query()
            ->orderBy('nom')
            ->get(['id', 'nom', 'fonction', 'organisation', 'secteur', 'bio', 'photo']);

        return response()->json([
            'data' => $formateurs->map(fn (Formateur $f) => [
                'id' => $f->id,
                'nom' => $f->nom,
                'fonction' => $f->fonction,
                'organisation' => $f->organisation,
                'bio' => $f->bio,
                'photo' => Fichier::url($f->photo),
            ]),
        ]);
    }
}
