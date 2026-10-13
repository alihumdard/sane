<?php

namespace Database\Factories;

use App\Models\CategorieFormation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<CategorieFormation> */
class CategorieFormationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => Str::ucfirst(fake()->unique()->word()),
            'ordre' => 0,
        ];
    }

    /**
     * Derived after the attributes are resolved, so that a test overriding
     * `nom` still gets a matching slug rather than one built from the
     * discarded random word.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (CategorieFormation $categorie) {
            $categorie->slug ??= Str::slug($categorie->nom);
        });
    }
}
