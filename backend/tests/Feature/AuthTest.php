<?php

namespace Tests\Feature;

use App\Enums\RoleUtilisateur;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_utilisateur_actif_peut_se_connecter(): void
    {
        User::factory()->administrateur()->create([
            'email' => 'admin@sanem.ne',
            'password' => Hash::make('secret123'),
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@sanem.ne',
            'password' => 'secret123',
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'nom', 'email', 'role']])
            ->assertJsonPath('user.role', RoleUtilisateur::Administrateur->value);
    }

    public function test_un_mauvais_mot_de_passe_est_refuse(): void
    {
        User::factory()->create(['email' => 'test@sanem.ne', 'password' => Hash::make('secret123')]);

        $this->postJson('/api/auth/login', [
            'email' => 'test@sanem.ne',
            'password' => 'mauvais',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_un_compte_desactive_ne_peut_pas_se_connecter(): void
    {
        User::factory()->create([
            'email' => 'inactif@sanem.ne',
            'password' => Hash::make('secret123'),
            'statut' => 'inactif',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'inactif@sanem.ne',
            'password' => 'secret123',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_la_connexion_enregistre_la_derniere_visite(): void
    {
        $user = User::factory()->create([
            'email' => 'test@sanem.ne',
            'password' => Hash::make('secret123'),
        ]);

        $this->assertNull($user->derniere_connexion_le);

        $this->postJson('/api/auth/login', [
            'email' => 'test@sanem.ne',
            'password' => 'secret123',
        ])->assertOk();

        $this->assertNotNull($user->fresh()->derniere_connexion_le);
    }

    public function test_me_renvoie_lutilisateur_courant(): void
    {
        $user = User::factory()->organisateur()->create();

        $this->actingAs($user)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('user.role', RoleUtilisateur::Organisateur->value);
    }

    public function test_me_est_refuse_sans_authentification(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    /**
     * Asserts the token row is gone rather than re-calling /me: within one test
     * process the auth guard caches the resolved user, so a follow-up request
     * would still succeed even though a real second request would not.
     */
    public function test_la_deconnexion_revoque_le_token(): void
    {
        $user = User::factory()->administrateur()->create([
            'email' => 'admin@sanem.ne',
            'password' => Hash::make('secret123'),
        ]);

        $token = $this->postJson('/api/auth/login', [
            'email' => 'admin@sanem.ne',
            'password' => 'secret123',
        ])->json('token');

        $entetes = ['Authorization' => "Bearer $token"];

        $this->getJson('/api/auth/me', $entetes)->assertOk();
        $this->assertSame(1, $user->tokens()->count());

        $this->postJson('/api/auth/logout', [], $entetes)->assertOk();

        $this->assertSame(0, $user->fresh()->tokens()->count());
    }
}
