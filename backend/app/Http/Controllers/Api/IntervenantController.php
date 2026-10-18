<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

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
            ->get(['id', 'nom', 'fonction', 'organisation', 'bio', 'photo']);

        return response()->json([
            'data' => $formateurs->map(fn (Formateur $f) => [
                'id' => $f->id,
                'nom' => $f->nom,
                'fonction' => $f->fonction,
                'organisation' => $f->organisation,
                'bio' => $f->bio,
                'photo' => $this->photo($f->photo),
            ]),
        ]);
    }

    /**
     * Seeded speakers point at images shipped with the frontend (/images/...);
     * uploaded ones hold a path on the public disk. Both have to come back as
     * something the browser can fetch.
     */
    private function photo(?string $chemin): ?string
    {
        if (! $chemin) {
            return null;
        }

        if (str_starts_with($chemin, 'http') || str_starts_with($chemin, '/')) {
            return $chemin;
        }

        return Storage::disk('public')->url($chemin);
    }
}
