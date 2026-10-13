<?php

namespace Tests\Feature\Admin;

use App\Enums\RoleUtilisateur;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EditionAdminTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => RoleUtilisateur::Administrateur,
            'statut' => 'actif',
        ]);
    }

    private function donnees(array $surcharges = []): array
    {
        return [
            'annee' => 2027,
            'nom' => "Salon National de l'Emploi 2027",
            'date_debut' => '2027-12-09',
            'date_fin' => '2027-12-11',
            'lieu' => 'Niamey',
            ...$surcharges,
        ];
    }

    public function test_les_editions_sont_fermees_aux_non_administrateurs(): void
    {
        $this->getJson('/api/admin/editions')->assertUnauthorized();

        $demandeur = User::factory()->create([
            'role' => RoleUtilisateur::Demandeur,
            'statut' => 'actif',
        ]);

        $this->actingAs($demandeur)->getJson('/api/admin/editions')->assertForbidden();
    }

    public function test_un_administrateur_cree_une_edition(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/editions', $this->donnees())
            ->assertCreated()
            ->assertJsonPath('data.annee', 2027);
    }

    public function test_une_annee_ne_peut_pas_etre_dupliquee(): void
    {
        Edition::factory()->create(['annee' => 2027]);

        $this->actingAs($this->admin())
            ->postJson('/api/admin/editions', $this->donnees())
            ->assertStatus(422)
            ->assertJsonValidationErrors('annee');
    }

    public function test_la_date_de_fin_doit_suivre_le_debut(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/editions', $this->donnees([
                'date_debut' => '2027-12-11',
                'date_fin' => '2027-12-09',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('date_fin');
    }

    public function test_activer_une_edition_desactive_les_autres(): void
    {
        $ancienne = Edition::factory()->create(['annee' => 2026, 'active' => true]);
        $nouvelle = Edition::factory()->create(['annee' => 2027, 'active' => false]);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/editions/'.$nouvelle->id.'/activer')
            ->assertOk();

        // Edition::active() returns one row, so two active editions would make
        // the public registration flow pick an arbitrary event.
        $this->assertTrue($nouvelle->refresh()->active);
        $this->assertFalse($ancienne->refresh()->active);
    }

    public function test_fermer_les_inscriptions_bloque_le_formulaire_public(): void
    {
        $edition = Edition::factory()->create([
            'annee' => 2026,
            'active' => true,
            'inscriptions_ouvertes' => true,
        ]);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/editions/'.$edition->id.'/inscriptions')
            ->assertOk();

        $this->assertFalse($edition->refresh()->inscriptions_ouvertes);

        $this->postJson('/api/inscriptions', [
            'type_participation' => 'visiteur',
            'nom' => 'Test Fermeture',
            'email' => 'ferme@example.com',
            'telephone' => '90000000',
            'consentement' => true,
        ])->assertStatus(422);
    }

    public function test_une_edition_utilisee_ne_peut_pas_etre_supprimee(): void
    {
        $edition = Edition::factory()->create(['annee' => 2026, 'active' => false]);
        Formation::factory()->for($edition)->avecPlaces(20)->create();

        $this->actingAs($this->admin())
            ->deleteJson('/api/admin/editions/'.$edition->id)
            ->assertStatus(409);

        $this->assertDatabaseHas('editions', ['id' => $edition->id]);
    }

    public function test_une_edition_vide_est_supprimable(): void
    {
        $edition = Edition::factory()->create(['annee' => 2028, 'active' => false]);

        $this->actingAs($this->admin())
            ->deleteJson('/api/admin/editions/'.$edition->id)
            ->assertOk();

        $this->assertDatabaseMissing('editions', ['id' => $edition->id]);
    }

    public function test_ledition_active_ne_peut_pas_etre_supprimee(): void
    {
        $edition = Edition::factory()->create(['annee' => 2026, 'active' => true]);

        $this->actingAs($this->admin())
            ->deleteJson('/api/admin/editions/'.$edition->id)
            ->assertStatus(409);
    }

    public function test_les_dates_sont_modifiables(): void
    {
        $edition = Edition::factory()->create([
            'annee' => 2026,
            'date_debut' => '2026-03-12',
            'date_fin' => '2026-03-16',
        ]);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/editions/'.$edition->id, $this->donnees([
                'annee' => 2026,
                'date_debut' => '2026-12-10',
                'date_fin' => '2026-12-12',
            ]))
            ->assertOk()
            ->assertJsonPath('data.date_debut', '2026-12-10');
    }
}
