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
            'ordre' => ['integer', 'min:0', 'max:999'],
            'publiee' => ['boolean'],
        ];
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

    protected function metaSupplementaire(): array
    {
        return [
            'filtres' => [
                'categorie' => FaqEntree::distinct()->orderBy('categorie')->pluck('categorie'),
            ],
        ];
    }
}
