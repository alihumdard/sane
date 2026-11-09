<?php

namespace App\Http\Requests;

use App\Enums\TypeParticipation;
use App\Models\Edition;
use App\Models\Formation;
use App\Rules\AdresseEmailReelle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreInscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * L'adresse est mise en minuscules avant la contrainte d'unicité.
     *
     * PostgreSQL compare caractère par caractère : sans cela la même personne
     * peut s'inscrire deux fois à la même édition en changeant une majuscule,
     * et occuper deux places.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge(['email' => mb_strtolower(trim($this->email))]);
        }
    }

    public function rules(): array
    {
        $edition = Edition::active();

        return [
            'type_participation' => ['required', Rule::enum(TypeParticipation::class)],

            // Les deux champs du piège à robots : le middleware les a déjà
            // examinés, ils sont déclarés ici pour ne pas être refusés comme
            // paramètres inattendus, et retirés avant l'enregistrement.
            config('antiabus.piege.champ', 'site_web') => ['nullable', 'string', 'max:255'],
            '_ouvert_le' => ['nullable', 'string', 'max:500'],

            // Étape 1
            'nom' => ['required', 'string', 'max:255'],
            'naissance' => ['nullable', 'date', 'before:today'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('inscriptions')->where('edition_id', $edition?->id),
                new AdresseEmailReelle,
            ],
            'telephone' => ['required', 'string', 'max:20'],
            'genre' => ['nullable', 'string', 'max:50'],
            'nationalite' => ['nullable', 'string', 'max:100'],
            'ville' => ['nullable', 'string', 'max:100'],
            'niveau' => ['nullable', 'string', 'max:100'],

            // Étape 2
            'statut_pro' => ['nullable', 'string', 'max:100'],
            'domaine' => ['nullable', 'string', 'max:150'],
            'experience' => ['nullable', 'string', 'max:100'],
            'parcours' => ['nullable', 'string', 'max:2000'],

            // Étape 3
            'interets' => ['nullable', 'array'],
            'interets.*' => ['string', 'max:100'],
            'source' => ['nullable', 'string', 'max:100'],
            'newsletter' => ['boolean'],

            // Étape 4
            'consentement' => ['required', 'accepted'],

            // Formations
            'formations' => ['nullable', 'array', 'max:5'],
            'formations.*' => [
                'integer',
                Rule::exists('formations', 'id')
                    ->where('edition_id', $edition?->id)
                    ->where('publiee', true),
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $type = TypeParticipation::tryFrom($this->input('type_participation', ''));
                $formations = $this->input('formations', []);

                if ($formations && $type && ! $type->peutChoisirFormations()) {
                    $validator->errors()->add(
                        'formations',
                        'Seuls les participants aux formations peuvent sélectionner des formations.'
                    );
                }

                foreach ($formations as $i => $id) {
                    $formation = Formation::find($id);

                    if ($formation && $formation->complete) {
                        $validator->errors()->add(
                            "formations.$i",
                            "La formation « {$formation->titre} » est complète."
                        );
                    }
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            /*
             * Written out because Laravel fills :date with the rule's own
             * parameter and does not translate it: the French line came out
             * as « doit être une date antérieure au today », half in each
             * language, on the public registration form.
             */
            'naissance.before' => "La date de naissance doit être antérieure à aujourd'hui.",
            'email.unique' => 'Une inscription existe déjà avec cette adresse email pour cette édition.',
            'consentement.accepted' => 'Vous devez accepter les conditions pour vous inscrire.',
            'formations.max' => 'Vous ne pouvez pas sélectionner plus de 5 formations.',
        ];
    }
}
