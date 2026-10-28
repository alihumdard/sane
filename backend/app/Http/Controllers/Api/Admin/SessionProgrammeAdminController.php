<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\SessionProgramme;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class SessionProgrammeAdminController extends ContenuAdminController
{
    protected function modele(): string
    {
        return SessionProgramme::class;
    }

    protected function regles(Request $request, ?Model $existant = null): array
    {
        return [
            'jour' => ['required', 'date'],
            'heure_debut' => ['required', 'date_format:H:i'],
            // Same day only: a session that runs past midnight is two entries.
            'heure_fin' => ['nullable', 'date_format:H:i', 'after:heure_debut'],
            'titre' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:2000'],
            'categorie' => ['nullable', 'string', 'max:50'],
            'lieu' => ['nullable', 'string', 'max:150'],
            'intervenants' => ['nullable', 'string', 'max:300'],
            'image' => ['nullable', 'string', 'max:255'],
            // Nullable: an empty field arrives as null, and refusing it made
            // the display order a required question on every new record.
            'ordre' => ['nullable', 'integer', 'min:0', 'max:999'],
            'publiee' => ['boolean'],
        ];
    }

    protected function messages(): array
    {
        return [
            'heure_fin.after' => "L'heure de fin doit être postérieure à l'heure de début.",
            'heure_debut.date_format' => "L'heure de début doit être au format HH:MM.",
            'heure_fin.date_format' => "L'heure de fin doit être au format HH:MM.",
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
        return ['titre', 'description', 'lieu', 'intervenants'];
    }

    protected function filtrables(): array
    {
        return ['categorie'];
    }

    protected function triables(): array
    {
        return ['jour', 'heure_debut', 'ordre', 'created_at'];
    }

    protected function triParDefaut(): array
    {
        return ['jour' => 'asc', 'heure_debut' => 'asc', 'ordre' => 'asc'];
    }

    protected function metaSupplementaire(): array
    {
        return [
            'filtres' => [
                'categorie' => SessionProgramme::whereNotNull('categorie')
                    ->distinct()->orderBy('categorie')->pluck('categorie'),
            ],
        ];
    }
}
