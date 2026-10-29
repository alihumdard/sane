<?php

namespace App\Http\Requests;

use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class OffreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'max:10000'],
            'missions' => ['nullable', 'string', 'max:10000'],
            'profil_recherche' => ['nullable', 'string', 'max:10000'],

            // Two selection questions, asked of every candidate who applies.
            // Short on purpose: a question that needs a paragraph is a
            // requirement, and belongs in the profile sought.
            'question_1' => ['nullable', 'string', 'max:500'],
            'question_2' => ['nullable', 'string', 'max:500'],
            'type_contrat' => ['required', Rule::enum(TypeContrat::class)],
            'secteur' => ['required', 'string', 'max:150'],
            'ville' => ['required', 'string', 'max:100'],
            'salaire_min' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'salaire_max' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'experience_requise' => ['nullable', 'string', 'max:100'],
            'niveau_etude' => ['nullable', 'string', 'max:100'],
            'date_limite' => ['nullable', 'date', 'after:today'],
            'statut' => ['nullable', Rule::enum(StatutOffre::class)],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $min = $this->input('salaire_min');
                $max = $this->input('salaire_max');

                if ($min !== null && $max !== null && (int) $min > (int) $max) {
                    $validator->errors()->add(
                        'salaire_max',
                        'Le salaire maximum doit être supérieur au salaire minimum.'
                    );
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'date_limite.after' => "La date limite doit être postérieure à aujourd'hui.",
            'date_limite.after' => 'La date limite doit être postérieure à aujourd\'hui.',
            'titre.required' => 'Le titre du poste est requis.',
            'description.required' => 'La description du poste est requise.',
        ];
    }
}
