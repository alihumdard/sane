<?php

namespace App\Http\Requests;

use App\Enums\TypeDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * Registration is anonymous — a participant holds only the reference they were
 * given. References are sequential (#INS2026-0001), so the reference alone is
 * guessable and cannot be the sole key to attaching identity papers to someone
 * else's record; the email used at registration is required alongside it.
 */
class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'type' => ['required', Rule::enum(TypeDocument::class)],
            'fichier' => [
                'required',
                'file',
                'max:'.TypeDocument::TAILLE_MAX_KO,
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                // Only reachable once the base rules passed; otherwise the type is
                // unknown and the per-type extension check cannot be expressed.
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $type = TypeDocument::from($this->input('type'));
                $extensions = explode(',', $type->mimes());
                $fichier = $this->file('fichier');

                // Guessed from the file's own bytes, not the client-supplied name,
                // so renaming a .exe to .pdf does not get it past this.
                $extension = strtolower((string) $fichier->guessExtension());

                if (! in_array($extension, $extensions, true)) {
                    $validator->errors()->add(
                        'fichier',
                        sprintf(
                            'Le document « %s » doit être au format %s.',
                            $type->label(),
                            strtoupper(str_replace(',', ', ', $type->mimes()))
                        )
                    );
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => "L'adresse email utilisée lors de l'inscription est requise.",
            'fichier.required' => 'Veuillez sélectionner un fichier.',
            'fichier.max' => 'Le fichier ne doit pas dépasser 2 Mo.',
        ];
    }

    public function attributes(): array
    {
        return [
            'fichier' => 'document',
            'type' => 'type de document',
        ];
    }
}
