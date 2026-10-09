<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Edition> */
class EditionFactory extends Factory
{
    public function definition(): array
    {
        $annee = fake()->unique()->numberBetween(2020, 2099);

        return [
            'annee' => $annee,
            'nom' => "Salon National de l'Emploi $annee",
            'date_debut' => "$annee-03-12",
            'date_fin' => "$annee-03-16",
            'lieu' => 'Palais des Congrès, Niamey',
            'active' => false,
            'inscriptions_ouvertes' => false,
        ];
    }

    public function active(): static
    {
        return $this->state(['active' => true, 'inscriptions_ouvertes' => true]);
    }
}
