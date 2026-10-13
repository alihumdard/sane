<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EditionRequest;
use App\Models\Edition;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Editions — the event itself: its year, dates, venue, and whether
 * registration is open.
 *
 * Exactly one edition is active at a time: Edition::active() is what the
 * public registration flow reads to decide which event someone is signing up
 * for, so activating one must deactivate the rest.
 */
class EditionAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $editions = Edition::withCount(['formations', 'inscriptions'])
            ->orderByDesc('annee')
            ->get();

        return response()->json([
            'data' => $editions->map(fn (Edition $e) => $this->presenter($e)),
        ]);
    }

    public function show(Edition $edition): JsonResponse
    {
        $edition->loadCount(['formations', 'inscriptions']);

        return response()->json(['data' => $this->presenter($edition)]);
    }

    public function store(EditionRequest $request): JsonResponse
    {
        $edition = DB::transaction(function () use ($request) {
            $edition = Edition::create($request->validated());

            if ($edition->active) {
                $this->desactiverLesAutres($edition);
            }

            return $edition;
        });

        return response()->json([
            'message' => "Édition {$edition->annee} créée.",
            'data' => $this->presenter($edition->loadCount(['formations', 'inscriptions'])),
        ], 201);
    }

    public function update(EditionRequest $request, Edition $edition): JsonResponse
    {
        DB::transaction(function () use ($request, $edition) {
            $edition->update($request->validated());

            if ($edition->active) {
                $this->desactiverLesAutres($edition);
            }
        });

        return response()->json([
            'message' => 'Édition mise à jour.',
            'data' => $this->presenter($edition->refresh()->loadCount(['formations', 'inscriptions'])),
        ]);
    }

    public function destroy(Edition $edition): JsonResponse
    {
        // Deleting an edition would take its registrations and courses with it,
        // so an edition that has been used is kept and merely deactivated.
        if ($edition->inscriptions()->exists() || $edition->formations()->exists()) {
            return response()->json([
                'message' => 'Cette édition contient des inscriptions ou des formations : elle ne peut pas être supprimée.',
            ], 409);
        }

        if ($edition->active) {
            return response()->json([
                'message' => "L'édition active ne peut pas être supprimée. Activez-en une autre d'abord.",
            ], 409);
        }

        $edition->delete();

        return response()->json(['message' => 'Édition supprimée.']);
    }

    /** Opening or closing registration without resending the whole form. */
    public function basculerInscriptions(Edition $edition): JsonResponse
    {
        $edition->update(['inscriptions_ouvertes' => ! $edition->inscriptions_ouvertes]);

        return response()->json([
            'message' => $edition->inscriptions_ouvertes
                ? 'Les inscriptions sont ouvertes.'
                : 'Les inscriptions sont fermées.',
            'data' => $this->presenter($edition->loadCount(['formations', 'inscriptions'])),
        ]);
    }

    public function activer(Edition $edition): JsonResponse
    {
        DB::transaction(function () use ($edition) {
            $edition->update(['active' => true]);
            $this->desactiverLesAutres($edition);
        });

        return response()->json([
            'message' => "L'édition {$edition->annee} est désormais active.",
            'data' => $this->presenter($edition->refresh()->loadCount(['formations', 'inscriptions'])),
        ]);
    }

    private function desactiverLesAutres(Edition $edition): void
    {
        Edition::whereKeyNot($edition->id)->update(['active' => false]);
    }

    private function presenter(Edition $edition): array
    {
        return [
            'id' => $edition->id,
            'annee' => $edition->annee,
            'nom' => $edition->nom,
            'date_debut' => $edition->date_debut->toDateString(),
            'date_fin' => $edition->date_fin->toDateString(),
            'lieu' => $edition->lieu,
            'active' => $edition->active,
            'inscriptions_ouvertes' => $edition->inscriptions_ouvertes,
            'formations_count' => $edition->formations_count ?? 0,
            'inscriptions_count' => $edition->inscriptions_count ?? 0,
        ];
    }
}
