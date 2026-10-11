<?php

namespace Database\Factories;

use App\Enums\TypeDocument;
use App\Models\DocumentInscription;
use App\Models\Inscription;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<DocumentInscription> */
class DocumentInscriptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inscription_id' => Inscription::factory(),
            'type' => TypeDocument::Cv,
            'nom_original' => 'cv.pdf',
            'chemin' => 'documents/inscriptions/1/'.Str::uuid().'.pdf',
            'mime' => 'application/pdf',
            'taille' => 125_000,
        ];
    }
}
