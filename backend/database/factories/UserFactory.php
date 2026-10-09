<?php

namespace Database\Factories;

use App\Enums\RoleUtilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/** @extends Factory<\App\Models\User> */
class UserFactory extends Factory
{
    protected static ?string $password = null;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->numerify('## ## ## ##'),
            'role' => RoleUtilisateur::Participant,
            'statut' => 'actif',
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn () => ['email_verified_at' => null]);
    }

    public function role(RoleUtilisateur $role): static
    {
        return $this->state(['role' => $role]);
    }

    public function administrateur(): static
    {
        return $this->role(RoleUtilisateur::Administrateur);
    }

    public function organisateur(): static
    {
        return $this->role(RoleUtilisateur::Organisateur);
    }
}
