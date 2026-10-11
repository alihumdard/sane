<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\ArticlePresse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PresseAdminController extends ContenuAdminController
{
    protected function modele(): string
    {
        return ArticlePresse::class;
    }

    protected function regles(Request $request, ?Model $existant = null): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'media' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string', 'max:50'],
            'date_publication' => ['required', 'date'],
            'lien' => ['nullable', 'url', 'max:255'],
            'fichier' => ['nullable', 'string', 'max:255'],
            'resume' => ['nullable', 'string', 'max:2000'],
            'publie' => ['boolean'],
        ];
    }

    protected function recherchables(): array
    {
        return ['titre', 'media', 'resume'];
    }

    protected function filtrables(): array
    {
        return ['type', 'media'];
    }

    protected function triables(): array
    {
        return ['titre', 'media', 'date_publication', 'created_at'];
    }
}
