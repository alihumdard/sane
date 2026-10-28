<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ParametrePlateforme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/** The platform's one set of organisation settings — not a list, a record. */
class ParametreAdminController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => ParametrePlateforme::instance()]);
    }

    public function update(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'site_web' => ['nullable', 'url', 'max:255'],
            'facebook' => ['nullable', 'url', 'max:255'],
            'twitter' => ['nullable', 'url', 'max:255'],
            'instagram' => ['nullable', 'url', 'max:255'],
            'linkedin' => ['nullable', 'url', 'max:255'],
            'youtube' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $parametres = ParametrePlateforme::instance();

        if ($request->hasFile('logo')) {
            if ($parametres->logo) {
                Storage::disk('public')->delete($parametres->logo);
            }

            $valide['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $parametres->update($valide);

        return response()->json([
            'message' => 'Paramètres enregistrés.',
            'data' => $parametres->fresh(),
        ]);
    }
}
