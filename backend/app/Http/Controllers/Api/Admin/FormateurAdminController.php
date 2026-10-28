<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FormateurRequest;
use App\Models\Formateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Speakers and trainers — the people who run the sessions. */
class FormateurAdminController extends Controller
{
    use FiltreLesListes;

    public function index(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            Formateur::query()->withCount('formations'),
            $request,
            recherchables: ['nom', 'email', 'fonction', 'organisation'],
            filtrables: ['organisation', 'secteur'],
            triables: ['nom', 'organisation', 'created_at'],
        );

        return response()->json([
            'data' => collect($page->items())->map(fn (Formateur $f) => $this->presenter($f)),
            'meta' => $this->meta($page),
            'filtres' => [
                'organisation' => Formateur::distinct()
                    ->whereNotNull('organisation')
                    ->orderBy('organisation')
                    ->pluck('organisation'),
                'secteur' => Formateur::distinct()
                    ->whereNotNull('secteur')
                    ->orderBy('secteur')
                    ->pluck('secteur'),
            ],
            'resume' => [
                'total' => Formateur::count(),
                'avec_formation' => Formateur::has('formations')->count(),
            ],
        ]);
    }

    public function show(Formateur $formateur): JsonResponse
    {
        $formateur->loadCount('formations');
        $formateur->load('formations:id,formateur_id,titre,slug');

        return response()->json([
            'data' => [
                ...$this->presenter($formateur),
                'formations' => $formateur->formations->map(fn ($f) => [
                    'id' => $f->id,
                    'titre' => $f->titre,
                ]),
            ],
        ]);
    }

    public function store(FormateurRequest $request): JsonResponse
    {
        $formateur = Formateur::create($request->validated());

        return response()->json([
            'message' => "Intervenant « {$formateur->nom} » ajouté.",
            'data' => $this->presenter($formateur),
        ], 201);
    }

    public function update(FormateurRequest $request, Formateur $formateur): JsonResponse
    {
        $formateur->update($request->validated());

        return response()->json([
            'message' => 'Intervenant mis à jour.',
            'data' => $this->presenter($formateur->refresh()->loadCount('formations')),
        ]);
    }

    public function destroy(Formateur $formateur): JsonResponse
    {
        // formations.formateur_id is nullOnDelete, so removing a speaker would
        // quietly leave their courses with nobody assigned. Refusing is
        // clearer than letting an organiser discover it later.
        if ($formateur->formations()->exists()) {
            return response()->json([
                'message' => "Cet intervenant anime {$formateur->formations()->count()} formation(s) : retirez-le d'abord de ces formations.",
            ], 409);
        }

        $formateur->delete();

        return response()->json(['message' => 'Intervenant supprimé.']);
    }

    private function presenter(Formateur $formateur): array
    {
        return [
            'id' => $formateur->id,
            'nom' => $formateur->nom,
            'email' => $formateur->email,
            'telephone' => $formateur->telephone,
            'fonction' => $formateur->fonction,
            'organisation' => $formateur->organisation,
            'secteur' => $formateur->secteur,
            'bio' => $formateur->bio,
            'photo' => $formateur->photo,
            'formations_count' => $formateur->formations_count ?? 0,
            'created_at' => $formateur->created_at->toIso8601String(),
        ];
    }
}
