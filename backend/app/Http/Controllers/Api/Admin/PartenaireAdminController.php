<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Partenaire;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PartenaireAdminController extends ContenuAdminController
{
    protected function modele(): string
    {
        return Partenaire::class;
    }

    protected function regles(Request $request, ?Model $existant = null): array
    {
        return [
            'nom' => ['required', 'string', 'max:200'],
            'type' => ['required', 'string', 'max:50'],
            'logo' => ['nullable', 'string', 'max:255'],
            'site_web' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            // Nullable: an empty field arrives as null, and refusing it made
            // the display order a required question on every new record.
            'ordre' => ['nullable', 'integer', 'min:0', 'max:999'],
            'publie' => ['boolean'],
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
        return ['nom', 'description'];
    }

    protected function filtrables(): array
    {
        return ['type'];
    }

    protected function triParDefaut(): array
    {
        return ['ordre' => 'asc', 'nom' => 'asc'];
    }

    protected function triables(): array
    {
        return ['nom', 'type', 'ordre', 'created_at'];
    }
}
