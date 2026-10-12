<?php

namespace App\Http\Requests;

use App\Enums\TypeDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(TypeDocument::class)],
            'fichier' => ['required', 'file', 'max:'.TypeDocument::TAILLE_MAX_KO],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $type = TypeDocument::tryFrom($this->input('type', ''));
                $fichier = $this->file('fichier');

                if (! $type || ! $fichier || ! $fichier->isValid()) {
                    return;
                }

                // Each slot accepts its own formats, so the rule can only be
                // applied once the type is known.
                $autorisees = explode(',', $type->mimes());
                $extension = strtolower($fichier->getClientOriginalExtension());

                if (! in_array($extension, $autorisees, true)) {
                    $validator->errors()->add(
                        'fichier',
                        sprintf(
                            '« %s » doit être au format %s.',
                            $type->label(),
                            strtoupper(implode(', ', $autorisees))
                        )
                    );
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'fichier.max' => 'Le fichier ne doit pas dépasser 2 Mo.',
            'fichier.required' => 'Aucun fichier n\'a été envoyé.',
        ];
    }
}
