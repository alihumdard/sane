<?php

namespace Tests\Feature;

use App\Enums\RoleUtilisateur;
use App\Enums\TypeParticipation;
use App\Mail\VerifierEmail;
use App\Mail\VerifierInscription;
use App\Models\Edition;
use App\Models\Inscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * Les défenses contre le faux trafic, prises une par une.
 *
 * Chacune est faible seule et sérieuse en nombre : le piège arrête les robots
 * bêtes, le délai ceux qui soumettent sans lire, la liste des domaines
 * jetables les adresses d'une heure, le throttle le volume, et la vérification
 * d'email tout ce qui passe entre les mailles.
 */
class AntiAbusTest extends TestCase
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

    private function inscriptionSalon(array $surcharges = []): array
    {
        return [
            'type_participation' => TypeParticipation::Visiteur->value,
            'nom' => 'Aminata Souley',
            'email' => 'aminata@example.com',
            'telephone' => '96 12 34 56',
            'ville' => 'Niamey',
            'consentement' => true,
            ...$surcharges,
        ];
    }

    // ---------------------------------------------------------------- piège

    public function test_le_champ_appat_rempli_ne_cree_rien(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            'site_web' => 'http://spam.example',
        ]))->assertCreated();   // Faux succès : le robot repart satisfait…

        // …mais rien n'a été créé.
        $this->assertDatabaseCount('users', 0);
        Mail::assertNothingSent();
    }

    public function test_le_champ_appat_vaut_aussi_pour_le_salon(): void
    {
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->inscriptionSalon([
            'site_web' => 'http://spam.example',
        ]))->assertCreated();

        $this->assertDatabaseCount('inscriptions', 0);
    }

    public function test_un_formulaire_soumis_trop_vite_est_refuse(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            '_ouvert_le' => Crypt::encryptString((string) time()),
        ]))->assertCreated();

        $this->assertDatabaseCount('users', 0);
    }

    public function test_un_formulaire_rempli_posement_passe(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            '_ouvert_le' => Crypt::encryptString((string) (time() - 30)),
        ]))->assertCreated();

        $this->assertDatabaseCount('users', 1);
        Mail::assertSent(VerifierEmail::class);
    }

    public function test_un_horodatage_fabrique_est_refuse(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            // Un client honnête renvoie le jeton tel que nous le lui avons
            // donné ; celui-ci n'a pas été chiffré par nous.
            '_ouvert_le' => (string) (time() - 30),
        ]))->assertCreated();

        $this->assertDatabaseCount('users', 0);
    }

    public function test_sans_horodatage_linscription_passe(): void
    {
        // Une page ouverte avant le déploiement, ou un appel hors navigateur,
        // ne doit pas être bloquée par un contrôle que rien ne lui a demandé
        // de passer : les autres défenses s'appliquent toujours.
        $this->postJson('/api/auth/inscription', $this->compte())->assertCreated();

        $this->assertDatabaseCount('users', 1);
    }

    public function test_le_jeton_dhorodatage_est_servi_chiffre(): void
    {
        $jeton = $this->getJson('/api/formulaire/jeton')->assertOk()->json('jeton');

        $this->assertNotSame((string) time(), $jeton);
        $this->assertEqualsWithDelta(time(), (int) Crypt::decryptString($jeton), 5);
    }

    // ------------------------------------------------------------- adresses

    public function test_une_adresse_jetable_est_refusee(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            'email' => 'test@yopmail.com',
        ]))->assertStatus(422)->assertJsonValidationErrors('email');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_un_domaine_qui_ne_recoit_pas_de_courrier_est_refuse(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            'email' => 'test@domaine-qui-nexiste-vraiment-pas-123456.invalid',
        ]))->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_ladresse_est_normalisee_en_minuscules(): void
    {
        $this->postJson('/api/auth/inscription', $this->compte([
            'email' => '  Aminata@Example.COM  ',
        ]))->assertCreated();

        $this->assertDatabaseHas('users', ['email' => 'aminata@example.com']);
    }

    public function test_la_casse_ne_permet_pas_de_creer_deux_comptes(): void
    {
        User::factory()->create(['email' => 'aminata@example.com']);

        $this->postJson('/api/auth/inscription', $this->compte([
            'email' => 'AMINATA@EXAMPLE.COM',
        ]))->assertStatus(422)->assertJsonValidationErrors('email');
    }

    // ------------------------------------------------------------- throttle

    public function test_la_limitation_de_debit_arrete_les_envois_en_rafale(): void
    {
        Edition::factory()->active()->create();

        // Trois inscriptions au salon par heure et par IP : la quatrième
        // attend. Chacune avec une adresse différente, pour que ce soit bien
        // le débit qui arrête et non la contrainte d'unicité.
        foreach (range(1, 3) as $i) {
            $this->postJson('/api/inscriptions', $this->inscriptionSalon([
                'email' => "participant{$i}@example.com",
            ]))->assertCreated();
        }

        $this->postJson('/api/inscriptions', $this->inscriptionSalon([
            'email' => 'participant4@example.com',
        ]))->assertStatus(429);
    }

    // ------------------------------------------------------- renvoi discret

    public function test_le_renvoi_ne_dit_pas_si_ladresse_est_connue(): void
    {
        $connue = $this->postJson('/api/auth/renvoyer-verification', [
            'email' => 'inconnu@example.com',
        ])->assertOk()->json('message');

        User::factory()->unverified()->create(['email' => 'connu@example.com']);

        $inconnue = $this->postJson('/api/auth/renvoyer-verification', [
            'email' => 'connu@example.com',
        ])->assertOk()->json('message');

        // Mot pour mot la même réponse : autrement, ce formulaire devient un
        // annuaire des comptes du site.
        $this->assertSame($connue, $inconnue);
    }

    public function test_le_renvoi_plafonne_les_envois_dune_inscription(): void
    {
        Edition::factory()->active()->create();

        $inscription = Inscription::factory()->create([
            'email' => 'aminata@example.com',
            'email_verifie_le' => null,
            'envois_verification' => (int) config('antiabus.verification.envois_max'),
        ]);

        $this->postJson('/api/inscriptions/renvoyer-verification', [
            'email' => 'aminata@example.com',
        ])->assertOk();

        // La réponse est la même, mais rien ne part : sans ce plafond, une
        // adresse ciblée recevrait un email toutes les heures jusqu'au salon.
        Mail::assertNotSent(VerifierInscription::class);
        $this->assertSame(
            (int) config('antiabus.verification.envois_max'),
            $inscription->fresh()->envois_verification,
        );
    }
}
