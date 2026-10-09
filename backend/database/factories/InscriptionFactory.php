<?php

namespace Database\Factories;

use App\Enums\StatutInscription;
use App\Enums\TypeParticipation;
use App\Models\Edition;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Inscription> */
class InscriptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'reference' => '#INS'.fake()->unique()->numberBetween(100000, 999999),
            'edition_id' => Edition::factory(),
            'type_participation' => TypeParticipation::ParticipantFormation,
            'statut' => StatutInscription::EnAttente,
            'nom' => fake()->name(),
            'naissance' => fake()->date(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->numerify('## ## ## ##'),
            'genre' => fake()->randomElement(['Homme', 'Femme']),
            'nationalite' => 'Niger',
            'ville' => 'Niamey',
            'niveau' => 'Licence',
            'consentement' => true,
        ];
    }
}
