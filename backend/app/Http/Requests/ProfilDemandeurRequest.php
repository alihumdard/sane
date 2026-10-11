<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfilDemandeurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre_pro' => ['nullable', 'string', 'max:150'],
            'resume' => ['nullable', 'string', 'max:2000'],
            'secteur' => ['nullable', 'string', 'max:150'],
            'ville' => ['nullable', 'string', 'max:100'],
            'type_emploi' => ['nullable', 'string', 'max:100'],
            'disponibilite' => ['nullable', 'string', 'max:100'],
            'linkedin' => ['nullable', 'url', 'max:255'],
            'portfolio' => ['nullable', 'url', 'max:255'],
            'visible' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'linkedin.url' => 'Le lien LinkedIn doit être une adresse web valide.',
            'portfolio.url' => 'Le lien du portfolio doit être une adresse web valide.',
        ];
    }
}
