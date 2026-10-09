<?php

namespace Tests\Feature\Admin;

use App\Models\CategorieFormation;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\User;
use App\Services\GestionPlaces;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormationAdminTest extends TestCase
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

    private function donneesValides(array $surcharges = []): array
    {
        return [
            'edition_id' => $this->edition->id,
            'titre' => 'Initiation à la cybersécurité',
            'duree' => '2 jours',
            'lieu' => 'Niamey',
            'niveau' => 'Débutant',
            'format' => 'Présentiel',
            'max_inscriptions' => 40,
            'publiee' => true,
            ...$surcharges,
        ];
    }

    // --- Authorization -----------------------------------------------------

    public function test_un_anonyme_ne_peut_pas_creer_de_formation(): void
    {
        $this->postJson('/api/admin/formations', $this->donneesValides())->assertUnauthorized();
    }

    public function test_un_participant_ne_peut_pas_creer_de_formation(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/admin/formations', $this->donneesValides())
            ->assertForbidden();
    }

    // --- Create ------------------------------------------------------------

    public function test_ladmin_peut_creer_une_formation(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/formations', $this->donneesValides())
            ->assertCreated()
            ->assertJsonPath('data.titre', 'Initiation à la cybersécurité')
            ->assertJsonPath('data.places_restantes', 40);

        $this->assertDatabaseHas('formations', ['slug' => 'initiation-a-la-cybersecurite']);
    }

    public function test_le_slug_est_genere_depuis_le_titre(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/formations', $this->donneesValides(['titre' => 'Gestion de Projet Agile']))
            ->assertCreated()
            ->assertJsonPath('data.slug', 'gestion-de-projet-agile');
    }

    public function test_deux_formations_ne_peuvent_partager_un_slug_dans_une_edition(): void
    {
        Formation::factory()->for($this->edition)->create(['slug' => 'atelier-cv']);

        $this->actingAs($this->admin())
            ->postJson('/api/admin/formations', $this->donneesValides(['slug' => 'atelier-cv']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_une_date_de_fin_anterieure_est_refusee(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/formations', $this->donneesValides([
                'date_debut' => '2026-03-16',
                'date_fin' => '2026-03-12',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('date_fin');
    }

    // --- Update ------------------------------------------------------------

    public function test_ladmin_peut_modifier_une_formation(): void
    {
        $formation = Formation::factory()->for($this->edition)->create();

        $this->actingAs($this->admin())
            ->putJson("/api/admin/formations/{$formation->id}", $this->donneesValides([
                'titre' => 'Titre révisé',
                'max_inscriptions' => 60,
            ]))
            ->assertOk()
            ->assertJsonPath('data.titre', 'Titre révisé')
            ->assertJsonPath('data.max_inscriptions', 60);
    }

    public function test_la_capacite_ne_peut_pas_descendre_sous_les_inscrits(): void
    {
        $formation = Formation::factory()->for($this->edition)->avecPlaces(50)->create();
        $inscription = Inscription::factory()->for($this->edition)->create();
        app(GestionPlaces::class)->reserver($inscription, [$formation->id]);

        $this->actingAs($this->admin())
            ->putJson("/api/admin/formations/{$formation->id}", $this->donneesValides([
                'max_inscriptions' => 0,
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('max_inscriptions');

        $this->assertSame(50, $formation->fresh()->max_inscriptions);
    }

    // --- Delete ------------------------------------------------------------

    public function test_une_formation_sans_inscrit_peut_etre_supprimee(): void
    {
        $formation = Formation::factory()->for($this->edition)->create();

        $this->actingAs($this->admin())
            ->deleteJson("/api/admin/formations/{$formation->id}")
            ->assertOk();

        $this->assertDatabaseCount('formations', 0);
    }

    public function test_une_formation_avec_inscrits_ne_peut_pas_etre_supprimee(): void
    {
        $formation = Formation::factory()->for($this->edition)->avecPlaces(50)->create();
        $inscription = Inscription::factory()->for($this->edition)->create();
        app(GestionPlaces::class)->reserver($inscription, [$formation->id]);

        $this->actingAs($this->admin())
            ->deleteJson("/api/admin/formations/{$formation->id}")
            ->assertStatus(422);

        $this->assertDatabaseCount('formations', 1);
    }

    // --- Attendees ---------------------------------------------------------

    public function test_ladmin_peut_lister_les_inscrits_dune_formation(): void
    {
        $formation = Formation::factory()->for($this->edition)->avecPlaces(50)->create();
        $places = app(GestionPlaces::class);

        foreach (['Aminata Souley', 'Ibrahim Moussa'] as $nom) {
            $places->reserver(
                Inscription::factory()->for($this->edition)->create(['nom' => $nom]),
                [$formation->id]
            );
        }

        $this->actingAs($this->admin())
            ->getJson("/api/admin/formations/{$formation->id}/inscrits")
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.places_restantes', 48)
            ->assertJsonPath('data.0.nom', 'Aminata Souley');
    }

    // --- Listing -----------------------------------------------------------

    public function test_la_liste_admin_inclut_les_formations_non_publiees(): void
    {
        Formation::factory()->for($this->edition)->create(['publiee' => true]);
        Formation::factory()->for($this->edition)->create(['publiee' => false]);

        $this->actingAs($this->admin())
            ->getJson('/api/admin/formations')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        // The public endpoint still hides the unpublished one.
        $this->getJson('/api/formations')->assertOk()->assertJsonCount(1, 'data');
    }
}
