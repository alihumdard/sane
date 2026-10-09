<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class FormationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $formation = $this->route('formation');

        return [
            'edition_id' => ['required', 'exists:editions,id'],
            'categorie_id' => ['nullable', 'exists:categories_formation,id'],
            'formateur_id' => ['nullable', 'exists:formateurs,id'],

            'titre' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255',
                Rule::unique('formations')
                    ->where('edition_id', $this->input('edition_id'))
                    ->ignore($formation?->id),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'prerequis' => ['nullable', 'string', 'max:2000'],

            'duree' => ['required', 'string', 'max:100'],
            'lieu' => ['required', 'string', 'max:255'],
            'niveau' => ['required', 'string', 'max:100'],
            'format' => ['required', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:255'],

            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date', 'after_or_equal:date_debut'],

            'max_inscriptions' => ['required', 'integer', 'min:1', 'max:10000'],
            'publiee' => ['boolean'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $formation = $this->route('formation');
                $max = $this->integer('max_inscriptions');

                // Lowering capacity below what is already booked would break the
                // CHECK constraint, so reject it with a message instead.
                if ($formation && $max < $formation->inscriptions_count) {
                    $validator->errors()->add(
                        'max_inscriptions',
                        "Déjà {$formation->inscriptions_count} inscrits : la capacité ne peut pas être inférieure."
                    );
                }
            },
        ];
    }
}
