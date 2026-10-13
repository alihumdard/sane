<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $edition = $this->route('edition');

        return [
            'annee' => [
                'required', 'integer', 'min:2020', 'max:2100',
                Rule::unique('editions', 'annee')->ignore($edition?->id),
            ],
            'nom' => ['required', 'string', 'max:255'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'active' => ['boolean'],
            'inscriptions_ouvertes' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'annee.unique' => 'Une édition existe déjà pour cette année.',
            'date_fin.after_or_equal' => 'La date de fin doit suivre la date de début.',
        ];
    }

    public function attributes(): array
    {
        return [
            'annee' => 'année',
            'date_debut' => 'date de début',
            'date_fin' => 'date de fin',
        ];
    }
}
