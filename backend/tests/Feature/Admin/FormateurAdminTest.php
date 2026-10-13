<?php

namespace Tests\Feature\Admin;

use App\Enums\RoleUtilisateur;
use App\Models\Edition;
use App\Models\Formateur;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormateurAdminTest extends TestCase
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
            'nom' => 'Dr Aminata Diallo',
            'email' => 'a.diallo@example.ne',
            'telephone' => '90112233',
            'fonction' => 'Consultante RH',
            'organisation' => 'Cabinet Talents Niger',
            ...$surcharges,
        ];
    }

    public function test_les_intervenants_sont_fermes_aux_non_administrateurs(): void
    {
        $this->getJson('/api/admin/formateurs')->assertUnauthorized();

        $demandeur = User::factory()->create([
            'role' => RoleUtilisateur::Demandeur,
            'statut' => 'actif',
        ]);

        $this->actingAs($demandeur)->getJson('/api/admin/formateurs')->assertForbidden();
        $this->actingAs($demandeur)->postJson('/api/admin/formateurs', $this->donnees())->assertForbidden();
    }

    public function test_un_administrateur_ajoute_un_intervenant(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/formateurs', $this->donnees())
            ->assertCreated()
            ->assertJsonPath('data.nom', 'Dr Aminata Diallo')
            ->assertJsonPath('data.formations_count', 0);
    }

    public function test_le_nom_est_obligatoire(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/formateurs', ['fonction' => 'Formateur'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('nom');
    }

    public function test_un_intervenant_sans_email_est_accepte(): void
    {
        // A speaker is often added from a programme before anyone has their
        // contact details.
        $this->actingAs($this->admin())
            ->postJson('/api/admin/formateurs', ['nom' => 'Moussa Ibrahim'])
            ->assertCreated();
    }

    public function test_un_email_ne_peut_pas_etre_reutilise(): void
    {
        Formateur::create($this->donnees());

        $this->actingAs($this->admin())
            ->postJson('/api/admin/formateurs', $this->donnees(['nom' => 'Autre Personne']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_un_intervenant_est_modifiable(): void
    {
        $formateur = Formateur::create($this->donnees());

        $this->actingAs($this->admin())
            ->putJson('/api/admin/formateurs/'.$formateur->id, $this->donnees([
                'fonction' => 'Directrice des ressources humaines',
            ]))
            ->assertOk()
            ->assertJsonPath('data.fonction', 'Directrice des ressources humaines');
    }

    public function test_un_intervenant_affecte_ne_peut_pas_etre_supprime(): void
    {
        $formateur = Formateur::create($this->donnees());

        Formation::factory()
            ->for(Edition::factory()->active()->create())
            ->avecPlaces(20)
            ->create(['formateur_id' => $formateur->id]);

        // formations.formateur_id is nullOnDelete, so deleting would silently
        // leave the course with nobody assigned.
        $this->actingAs($this->admin())
            ->deleteJson('/api/admin/formateurs/'.$formateur->id)
            ->assertStatus(409);

        $this->assertDatabaseHas('formateurs', ['id' => $formateur->id]);
    }

    public function test_un_intervenant_libre_est_supprimable(): void
    {
        $formateur = Formateur::create($this->donnees());

        $this->actingAs($this->admin())
            ->deleteJson('/api/admin/formateurs/'.$formateur->id)
            ->assertOk();

        $this->assertDatabaseMissing('formateurs', ['id' => $formateur->id]);
    }

    public function test_la_recherche_filtre_les_intervenants(): void
    {
        Formateur::create($this->donnees());
        Formateur::create(['nom' => 'Moussa Ibrahim', 'organisation' => 'Université de Niamey']);

        $this->actingAs($this->admin())
            ->getJson('/api/admin/formateurs?q=Diallo')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_le_formulaire_des_formations_recoit_les_intervenants(): void
    {
        Formateur::create($this->donnees());

        // The formations form posts formateur_id, so it needs the ids.
        $this->actingAs($this->admin())
            ->getJson('/api/admin/formations')
            ->assertOk()
            ->assertJsonCount(1, 'formateurs')
            ->assertJsonPath('formateurs.0.nom', 'Dr Aminata Diallo');
    }

    public function test_une_formation_peut_recevoir_un_intervenant(): void
    {
        $formateur = Formateur::create($this->donnees());
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(30)->create();

        $this->actingAs($this->admin())
            ->putJson('/api/admin/formations/'.$formation->id, [
                'edition_id' => $edition->id,
                'formateur_id' => $formateur->id,
                'titre' => $formation->titre,
                'duree' => '3 jours',
                'lieu' => 'Niamey',
                'niveau' => 'Intermédiaire',
                'format' => 'Présentiel',
                'max_inscriptions' => 30,
            ])
            ->assertOk()
            ->assertJsonPath('data.formateur.nom', 'Dr Aminata Diallo');
    }
}
