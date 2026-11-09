<?php

namespace Tests\Feature;

use App\Enums\RoleUtilisateur;
use App\Mail\BienvenueCompte;
use App\Mail\VerifierEmail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * Le verrou de confirmation d'adresse, du compte créé au compte utilisable.
 */
class VerificationEmailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();
    }

    private function compte(array $surcharges = []): array
    {
        return [
            'nom' => 'Aminata Souley',
            'email' => 'aminata@example.com',
            'password' => 'motdepasse1',
            'password_confirmation' => 'motdepasse1',
            'role' => RoleUtilisateur::Demandeur->value,
            ...$surcharges,
        ];
    }

    /**
     * Le lien signé voyage dans l'email ; on le relit comme le ferait la
     * personne, puis on en extrait l'URL d'API que la page du site rejouera.
     */
    private function lienApi(): string
    {
        $mail = collect(Mail::sent(VerifierEmail::class))->last();

        $this->assertNotNull($mail, "Aucune demande de confirmation n'a été envoyée.");

        $contenu = $mail->content();
        parse_str((string) parse_url($contenu->with['lien'], PHP_URL_QUERY), $params);

        // Le lien porte le chemin d'API sans son préfixe, que le client du
        // site rajoute : le test fait le même geste.
        return '/api'.$params['cible'];
    }

    public function test_la_creation_de_compte_ne_connecte_pas(): void
    {
        $reponse = $this->postJson('/api/auth/inscription', $this->compte())
            ->assertCreated()
            ->assertJsonPath('verification_requise', true);

        // Aucun jeton : le compte ne sert à rien tant que l'adresse n'est pas
        // confirmée, et connecter la personne lui ferait découvrir le verrou à
        // sa prochaine visite, une fois le message de bienvenue oublié.
        $this->assertArrayNotHasKey('token', $reponse->json());

        $this->assertNull(User::sole()->email_verified_at);

        Mail::assertSent(VerifierEmail::class);
        Mail::assertSent(BienvenueCompte::class);
    }

    public function test_la_connexion_est_refusee_avant_confirmation(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte())->assertCreated();

        $this->postJson('/api/auth/login', [
            'email' => 'aminata@example.com',
            'password' => 'motdepasse1',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_le_lien_confirme_et_debloque_la_connexion(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte())->assertCreated();

        $this->getJson($this->lienApi())
            ->assertOk()
            ->assertJsonPath('deja_confirme', false);

        $this->assertNotNull(User::sole()->email_verified_at);

        $this->postJson('/api/auth/login', [
            'email' => 'aminata@example.com',
            'password' => 'motdepasse1',
        ])->assertOk()->assertJsonPath('user.email_verifie', true);
    }

    public function test_le_meme_lien_clique_deux_fois_ne_fache_personne(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte())->assertCreated();

        $lien = $this->lienApi();

        $this->getJson($lien)->assertOk()->assertJsonPath('deja_confirme', false);
        $this->getJson($lien)->assertOk()->assertJsonPath('deja_confirme', true);
    }

    public function test_une_signature_falsifiee_est_refusee(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte())->assertCreated();

        $lien = $this->lienApi();

        // Un caractère de la signature suffit à invalider l'ensemble.
        $falsifie = substr($lien, 0, -1).(str_ends_with($lien, 'a') ? 'b' : 'a');

        $this->getJson($falsifie)->assertForbidden();

        $this->assertNull(User::sole()->email_verified_at);
    }

    public function test_un_lien_emis_pour_une_autre_adresse_ne_vaut_plus(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte())->assertCreated();

        $lien = $this->lienApi();

        // L'empreinte du lien porte sur l'adresse du moment où il a été émis.
        User::sole()->update(['email' => 'autre@example.com']);

        $this->getJson($lien)->assertForbidden();
    }

    public function test_les_comptes_anterieurs_se_connectent_toujours(): void
    {
        // Ce que garantit la migration de grâce : 50 personnes inscrites avant
        // l'existence de la règle ne se retrouvent pas dehors du jour au
        // lendemain.
        $ancien = User::factory()->create([
            'email' => 'omar@example.com',
            'password' => 'motdepasse1',
            'statut' => 'actif',
        ]);

        $this->assertNotNull($ancien->email_verified_at);

        $this->postJson('/api/auth/login', [
            'email' => 'omar@example.com',
            'password' => 'motdepasse1',
        ])->assertOk();
    }

    // ------------------------------------------------------- côté back-office

    public function test_un_administrateur_peut_confirmer_a_la_main(): void
    {
        $admin = User::factory()->create(['role' => RoleUtilisateur::Administrateur]);
        $cible = User::factory()->unverified()->create();

        $this->actingAs($admin)
            ->putJson("/api/admin/utilisateurs/{$cible->id}/verifier-email")
            ->assertOk()
            ->assertJsonPath('data.email_verifie', true);

        $this->assertNotNull($cible->fresh()->email_verified_at);
    }

    public function test_changer_ladresse_annule_la_confirmation(): void
    {
        $admin = User::factory()->create(['role' => RoleUtilisateur::Administrateur]);
        $cible = User::factory()->create(['email' => 'ancienne@example.com']);

        $this->assertNotNull($cible->email_verified_at);

        $this->actingAs($admin)
            ->putJson("/api/admin/utilisateurs/{$cible->id}", ['email' => 'nouvelle@example.com'])
            ->assertOk()
            ->assertJsonPath('data.email_verifie', false);

        // Sans cela le verrou serait décoratif : il suffirait de confirmer sa
        // propre adresse puis de la remplacer par n'importe quelle autre.
        $this->assertNull($cible->fresh()->email_verified_at);

        Mail::assertSent(
            VerifierEmail::class,
            fn (VerifierEmail $mail) => $mail->hasTo('nouvelle@example.com'),
        );
    }

    public function test_changer_la_casse_de_ladresse_ne_relance_rien(): void
    {
        $admin = User::factory()->create(['role' => RoleUtilisateur::Administrateur]);
        $cible = User::factory()->create(['email' => 'aminata@example.com']);

        $this->actingAs($admin)
            ->putJson("/api/admin/utilisateurs/{$cible->id}", ['email' => 'Aminata@Example.com'])
            ->assertOk();

        $this->assertNotNull($cible->fresh()->email_verified_at);
        Mail::assertNotSent(VerifierEmail::class);
    }

    public function test_un_compte_ouvert_par_un_administrateur_doit_etre_confirme(): void
    {
        $admin = User::factory()->create(['role' => RoleUtilisateur::Administrateur]);

        $this->actingAs($admin)->postJson('/api/admin/utilisateurs', [
            'name' => 'Organisateur',
            'email' => 'organisateur@example.com',
            'password' => 'motdepasse1',
            'role' => RoleUtilisateur::Organisateur->value,
        ])->assertCreated();

        // Demande du client : le back-office est soumis au même verrou.
        $cree = User::where('email', 'organisateur@example.com')->sole();

        $this->assertNull($cree->email_verified_at);
        Mail::assertSent(VerifierEmail::class, fn (VerifierEmail $m) => $m->hasTo('organisateur@example.com'));

        $this->postJson('/api/auth/login', [
            'email' => 'organisateur@example.com',
            'password' => 'motdepasse1',
        ])->assertStatus(422);
    }
}
