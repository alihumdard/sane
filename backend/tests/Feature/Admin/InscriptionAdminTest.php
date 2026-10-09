<?php

namespace Tests\Feature\Admin;

use App\Enums\RoleUtilisateur;
use App\Enums\StatutInscription;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\User;
use App\Services\GestionPlaces;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InscriptionAdminTest extends TestCase
{
    use RefreshDatabase;

    private Edition $edition;

    protected function setUp(): void
    {
        parent::setUp();
        $this->edition = Edition::factory()->active()->create();
    }

    private function admin(): User
    {
        return User::factory()->administrateur()->create();
    }

    // --- Authorization -----------------------------------------------------

    public function test_un_anonyme_ne_peut_pas_lister_les_inscriptions(): void
    {
        $this->getJson('/api/admin/inscriptions')->assertUnauthorized();
    }

    public function test_un_participant_ne_peut_pas_lister_les_inscriptions(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson('/api/admin/inscriptions')
            ->assertForbidden();
    }

    public function test_un_recruteur_ne_peut_pas_valider_une_inscription(): void
    {
        $inscription = Inscription::factory()->for($this->edition)->create();

        $this->actingAs(User::factory()->role(RoleUtilisateur::Recruteur)->create())
            ->putJson("/api/admin/inscriptions/{$inscription->id}/statut", [
                'statut' => StatutInscription::Confirmee->value,
            ])
            ->assertForbidden();

        $this->assertSame(StatutInscription::EnAttente, $inscription->fresh()->statut);
    }

    public function test_un_organisateur_peut_lister_les_inscriptions(): void
    {
        Inscription::factory()->for($this->edition)->count(3)->create();

        $this->actingAs(User::factory()->organisateur()->create())
            ->getJson('/api/admin/inscriptions')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    // --- Listing -----------------------------------------------------------

    public function test_la_liste_est_paginee_et_resumee(): void
    {
        Inscription::factory()->for($this->edition)->count(15)->create();
        Inscription::factory()->for($this->edition)->create(['statut' => StatutInscription::Confirmee]);

        $this->actingAs($this->admin())
            ->getJson('/api/admin/inscriptions?per_page=10')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.total', 16)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('resume.total', 16)
            ->assertJsonPath('resume.en_attente', 15)
            ->assertJsonPath('resume.confirmee', 1);
    }

    public function test_la_recherche_porte_sur_le_nom_et_lemail(): void
    {
        Inscription::factory()->for($this->edition)->create(['nom' => 'Aminata Souley']);
        Inscription::factory()->for($this->edition)->create(['nom' => 'Ibrahim Moussa']);

        $this->actingAs($this->admin())
            ->getJson('/api/admin/inscriptions?q=aminata')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nom', 'Aminata Souley');
    }

    public function test_le_filtre_par_statut_fonctionne(): void
    {
        Inscription::factory()->for($this->edition)->count(2)->create();
        Inscription::factory()->for($this->edition)->create(['statut' => StatutInscription::Confirmee]);

        $this->actingAs($this->admin())
            ->getJson('/api/admin/inscriptions?statut=confirmee')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    // --- Validation workflow ----------------------------------------------

    public function test_ladmin_peut_confirmer_une_inscription(): void
    {
        $admin = $this->admin();
        $inscription = Inscription::factory()->for($this->edition)->create();

        $this->actingAs($admin)
            ->putJson("/api/admin/inscriptions/{$inscription->id}/statut", [
                'statut' => StatutInscription::Confirmee->value,
            ])
            ->assertOk()
            ->assertJsonPath('data.statut', StatutInscription::Confirmee->value);

        $inscription->refresh();
        $this->assertSame(StatutInscription::Confirmee, $inscription->statut);
        $this->assertNotNull($inscription->confirmee_le);
        $this->assertSame($admin->id, $inscription->confirmee_par);
    }

    public function test_annuler_libere_les_places(): void
    {
        $formation = Formation::factory()->for($this->edition)->avecPlaces(50)->create();
        $inscription = Inscription::factory()->for($this->edition)->create();
        app(GestionPlaces::class)->reserver($inscription, [$formation->id]);

        $this->assertSame(1, $formation->fresh()->inscriptions_count);

        $this->actingAs($this->admin())
            ->putJson("/api/admin/inscriptions/{$inscription->id}/statut", [
                'statut' => StatutInscription::Annulee->value,
            ])
            ->assertOk();

        $this->assertSame(0, $formation->fresh()->inscriptions_count);
        $this->assertTrue($inscription->fresh()->places_liberees);
    }

    public function test_annuler_deux_fois_est_refuse(): void
    {
        $inscription = Inscription::factory()->for($this->edition)
            ->create(['statut' => StatutInscription::Annulee]);

        $this->actingAs($this->admin())
            ->putJson("/api/admin/inscriptions/{$inscription->id}/statut", [
                'statut' => StatutInscription::Annulee->value,
            ])
            ->assertStatus(422);
    }

    public function test_un_statut_inconnu_est_refuse(): void
    {
        $inscription = Inscription::factory()->for($this->edition)->create();

        $this->actingAs($this->admin())
            ->putJson("/api/admin/inscriptions/{$inscription->id}/statut", ['statut' => 'invalide'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('statut');
    }

    // --- Deletion ----------------------------------------------------------

    public function test_supprimer_libere_les_places(): void
    {
        $formation = Formation::factory()->for($this->edition)->avecPlaces(50)->create();
        $inscription = Inscription::factory()->for($this->edition)->create();
        app(GestionPlaces::class)->reserver($inscription, [$formation->id]);

        $this->actingAs($this->admin())
            ->deleteJson("/api/admin/inscriptions/{$inscription->id}")
            ->assertOk();

        $this->assertSame(0, $formation->fresh()->inscriptions_count);
        $this->assertDatabaseCount('inscriptions', 0);
    }

    public function test_la_suppression_multiple_libere_toutes_les_places(): void
    {
        $formation = Formation::factory()->for($this->edition)->avecPlaces(50)->create();
        $places = app(GestionPlaces::class);

        $ids = collect(range(1, 3))->map(function () use ($formation, $places) {
            $inscription = Inscription::factory()->for($this->edition)->create();
            $places->reserver($inscription, [$formation->id]);

            return $inscription->id;
        });

        $this->assertSame(3, $formation->fresh()->inscriptions_count);

        $this->actingAs($this->admin())
            ->postJson('/api/admin/inscriptions/suppression-multiple', ['ids' => $ids->all()])
            ->assertOk();

        $this->assertSame(0, $formation->fresh()->inscriptions_count);
        $this->assertDatabaseCount('inscriptions', 0);
    }
}
