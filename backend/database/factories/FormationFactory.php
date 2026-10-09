<?php

namespace Database\Factories;

use App\Models\Edition;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<\App\Models\Formation> */
class FormationFactory extends Factory
{
    public function definition(): array
    {
        $titre = fake()->unique()->sentence(3);

        return [
            'edition_id' => Edition::factory(),
            'titre' => $titre,
            'slug' => Str::slug($titre),
            'duree' => fake()->randomElement(['2 jours', '3 jours']),
            'lieu' => 'Niamey',
            'niveau' => fake()->randomElement(['Débutant', 'Intermédiaire', 'Avancé']),
            'format' => fake()->randomElement(['Présentiel', 'En ligne', 'Hybride']),
            'max_inscriptions' => 50,
            'inscriptions_count' => 0,
            'publiee' => true,
        ];
    }

    public function complete(): static
    {
        return $this->state(fn (array $attrs) => [
            'inscriptions_count' => $attrs['max_inscriptions'],
        ]);
    }

    public function avecPlaces(int $max, int $prises = 0): static
    {
        return $this->state(['max_inscriptions' => $max, 'inscriptions_count' => $prises]);
    }
}
