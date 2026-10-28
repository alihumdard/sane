<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FormateurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $formateur = $this->route('formateur');

        return [
            'nom' => ['required', 'string', 'max:255'],
            // Nullable, because a speaker is often added from a programme
            // before anyone has their contact details.
            'email' => [
                'nullable', 'email', 'max:255',
                Rule::unique('formateurs', 'email')->ignore($formateur?->id),
            ],
            'telephone' => ['nullable', 'string', 'max:20'],
            'fonction' => ['nullable', 'string', 'max:150'],
            'organisation' => ['nullable', 'string', 'max:200'],
            // The filter on the public Intervenants page works on this. The
            // column and the model accepted it; the form request did not, so
            // every sector an organiser chose was silently thrown away.
            'secteur' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:3000'],
            'photo' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Un intervenant utilise déjà cette adresse email.',
        ];
    }

    public function attributes(): array
    {
        return [
            'nom' => 'nom',
            'fonction' => 'fonction',
        ];
    }
}
