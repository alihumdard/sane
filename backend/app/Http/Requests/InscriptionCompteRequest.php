<?php

namespace App\Http\Requests;

use App\Enums\RoleUtilisateur;
use App\Rules\AdresseEmailReelle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/** Self-service account creation for jobseekers and recruiters. */
class InscriptionCompteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * L'adresse est mise en minuscules avant toute chose.
     *
     * PostgreSQL compare les chaînes caractère par caractère : sans cela,
     * `Ali@x.ne` et `ali@x.ne` passent la contrainte d'unicité et deviennent
     * deux comptes pour une seule personne — qui ne se souviendra pas lequel
     * elle a créé.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge(['email' => mb_strtolower(trim($this->email))]);
        }
    }

    public function rules(): array
    {
        return [
            // Les deux champs du piège à robots : le middleware les a déjà
            // examinés, ils sont déclarés pour ne pas être refusés comme
            // paramètres inattendus.
            config('antiabus.piege.champ', 'site_web') => ['nullable', 'string', 'max:255'],
            '_ouvert_le' => ['nullable', 'string', 'max:500'],

            'nom' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                'unique:users,email',
                // Écarte les adresses jetables et les domaines qui ne reçoivent
                // pas de courrier, avant qu'un email ne parte dans le vide.
                new AdresseEmailReelle,
            ],
            'telephone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            // Only these two may be self-assigned; staff roles are granted in the
            // back-office, never claimed by whoever is filling in the form.
            'role' => ['required', Rule::in(RoleUtilisateur::inscriptionPublique())],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Un compte existe déjà avec cette adresse email.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'role.in' => 'Ce type de compte ne peut pas être créé depuis ce formulaire.',
        ];
    }

    public function attributes(): array
    {
        return [
            'nom' => 'nom',
            'password' => 'mot de passe',
            'role' => 'type de compte',
        ];
    }
}
