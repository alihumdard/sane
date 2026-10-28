<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\FaqEntree;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class FaqAdminController extends ContenuAdminController
{
    protected function modele(): string
    {
        return FaqEntree::class;
    }

    protected function regles(Request $request, ?Model $existant = null): array
    {
        return [
            'categorie' => ['required', 'string', 'max:50'],
            'question' => ['required', 'string', 'max:500'],
            'reponse' => ['required', 'string', 'max:5000'],
            // Nullable: an empty field arrives as null, and refusing it made
            // the display order a required question on every new record.
            'ordre' => ['nullable', 'integer', 'min:0', 'max:999'],
            'publiee' => ['boolean'],
        ];
    }

    /** A record saved without a position goes to the end of its list. */
    protected function preparer(array $donnees, Request $request): array
    {
        $donnees['ordre'] ??= 0;

        return $donnees;
    }

    protected function recherchables(): array
    {
        return ['question', 'reponse'];
    }

    protected function filtrables(): array
    {
        return ['categorie'];
    }

    protected function triables(): array
    {
        return ['categorie', 'ordre', 'created_at'];
    }

    protected function triParDefaut(): array
    {
        return ['categorie' => 'asc', 'ordre' => 'asc'];
    }

    protected function metaSupplementaire(): array
    {
        return [
            'filtres' => [
                'categorie' => FaqEntree::distinct()->orderBy('categorie')->pluck('categorie'),
            ],
        ];
    }
}
