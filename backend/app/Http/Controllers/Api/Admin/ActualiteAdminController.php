<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Actualite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActualiteAdminController extends ContenuAdminController
{
    protected function modele(): string
    {
        return Actualite::class;
    }

    protected function regles(Request $request, ?Model $existant = null): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'categorie' => ['required', 'string', 'max:50'],
            'extrait' => ['nullable', 'string', 'max:500'],
            'contenu' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'auteur' => ['nullable', 'string', 'max:150'],
            'publiee' => ['boolean'],
        ];
    }

    protected function recherchables(): array
    {
        return ['titre', 'extrait', 'auteur'];
    }

    protected function filtrables(): array
    {
        return ['categorie'];
    }

    protected function triables(): array
    {
        return ['titre', 'categorie', 'publiee_le', 'created_at'];
    }

    /** Publishing stamps the date once; unpublishing keeps it for re-use. */
    protected function preparer(array $donnees, Request $request): array
    {
        if (($donnees['publiee'] ?? false) && ! $request->filled('publiee_le')) {
            $donnees['publiee_le'] = now();
        }

        return $donnees;
    }

    protected function metaSupplementaire(): array
    {
        return [
            'filtres' => [
                'categorie' => Actualite::distinct()->orderBy('categorie')->pluck('categorie'),
            ],
        ];
    }
}
