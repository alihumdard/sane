<?php

namespace App\Http\Requests;

use App\Enums\RoleUtilisateur;
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

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
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
