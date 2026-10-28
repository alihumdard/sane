<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Shared CRUD for the editorial resources — news, FAQ, partners, press.
 *
 * They differ only in their table, their validation rules and which columns
 * are searchable, so each gets a thin subclass rather than a fourth copy of
 * the same index/store/update/destroy.
 */
abstract class ContenuAdminController extends Controller
{
    use FiltreLesListes;

    /** @return class-string<Model> */
    abstract protected function modele(): string;

    /** @return array<string, mixed> */
    abstract protected function regles(Request $request, ?Model $existant = null): array;

    /** @return array<string> */
    abstract protected function recherchables(): array;

    /** @return array<string> */
    protected function filtrables(): array
    {
        return [];
    }

    /** @return array<string> */
    protected function triables(): array
    {
        return ['created_at'];
    }

    /** French wording for the rules a subclass cannot express plainly. */
    protected function messages(): array
    {
        return [];
    }

    /** Hook for subclasses that need to shape input before it is saved. */
    protected function preparer(array $donnees, Request $request): array
    {
        return $donnees;
    }

    /** Extra payload alongside the list, e.g. the available categories. */
    protected function metaSupplementaire(): array
    {
        return [];
    }

    public function index(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            $this->modele()::query(),
            $request,
            recherchables: $this->recherchables(),
            filtrables: $this->filtrables(),
            triables: $this->triables(),
        );

        return response()->json([
            'data' => $page->items(),
            'meta' => $this->meta($page),
            ...$this->metaSupplementaire(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => $this->modele()::findOrFail($id)]);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $this->preparer(
            $request->validate($this->regles($request), $this->messages()),
            $request,
        );

        $modele = $this->modele()::create($donnees);

        return response()->json([
            'message' => 'Élément créé.',
            'data' => $modele,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $modele = $this->modele()::findOrFail($id);

        $donnees = $this->preparer(
            $request->validate($this->regles($request, $modele), $this->messages()),
            $request,
        );

        $modele->update($donnees);

        return response()->json([
            'message' => 'Élément mis à jour.',
            'data' => $modele->refresh(),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->modele()::findOrFail($id)->delete();

        return response()->json(['message' => 'Élément supprimé.']);
    }
}
