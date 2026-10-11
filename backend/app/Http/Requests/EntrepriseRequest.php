<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EntrepriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:200'],
            'secteur' => ['nullable', 'string', 'max:150'],
            'taille' => ['nullable', 'string', 'max:50'],
            'site_web' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:3000'],
            'ville' => ['nullable', 'string', 'max:100'],
            'telephone' => ['nullable', 'string', 'max:20'],
            // `verifiee` is deliberately absent: a company cannot vouch for
            // itself, only an organiser can.
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => "Le nom de l'entreprise est requis.",
            'site_web.url' => 'Le site web doit être une adresse valide.',
        ];
    }
}
