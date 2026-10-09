<?php

namespace Tests\Feature;

use App\Enums\StatutInscription;
use App\Enums\TypeParticipation;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InscriptionApiTest extends TestCase
{
    use RefreshDatabase;

    private function donneesValides(array $surcharges = []): array
    {
        return [
            'type_participation' => TypeParticipation::ParticipantFormation->value,
            'nom' => 'Aminata Souley',
            'naissance' => '1998-04-12',
            'email' => 'aminata@example.com',
            'telephone' => '96 12 34 56',
            'genre' => 'Femme',
            'nationalite' => 'Niger',
            'ville' => 'Niamey',
            'niveau' => 'Licence',
            'statut_pro' => "Demandeur d'emploi",
            'domaine' => 'Informatique et numérique',
            'experience' => 'Moins de 2 ans',
            'interets' => ['Formations'],
            'source' => 'Réseaux sociaux',
            'newsletter' => true,
            'consentement' => true,
            ...$surcharges,
        ];
    }

    public function test_une_inscription_valide_est_enregistree(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(50)->create();

        $response = $this->postJson('/api/inscriptions', $this->donneesValides([
            'formations' => [$formation->id],
        ]));

        $response->assertCreated()
            ->assertJsonPath('data.nom', 'Aminata Souley')
            ->assertJsonPath('data.statut', StatutInscription::EnAttente->value)
            ->assertJsonPath('data.formations.0.places_restantes', 49);

        $this->assertDatabaseCount('inscriptions', 1);
        $this->assertSame(1, $formation->fresh()->inscriptions_count);
    }

    public function test_une_inscription_sans_formation_est_acceptee(): void
    {
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'type_participation' => TypeParticipation::Visiteur->value,
        ]))->assertCreated();
    }

    public function test_le_meme_email_ne_peut_sinscrire_deux_fois_par_edition(): void
    {
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();

        $this->postJson('/api/inscriptions', $this->donneesValides())
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_le_meme_email_peut_sinscrire_a_une_autre_edition(): void
    {
        $ancienne = Edition::factory()->create(['annee' => 2025]);
        Inscription::factory()->for($ancienne)->create(['email' => 'aminata@example.com']);

        Edition::factory()->active()->create(['annee' => 2026]);

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();
    }

    public function test_le_consentement_est_obligatoire(): void
    {
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides(['consentement' => false]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('consentement');
    }

    public function test_une_formation_complete_est_refusee(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(10, 10)->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'formations' => [$formation->id],
        ]))->assertStatus(422)->assertJsonValidationErrors('formations.0');

        $this->assertDatabaseCount('inscriptions', 0);
    }

    public function test_un_visiteur_ne_peut_pas_choisir_de_formations(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'type_participation' => TypeParticipation::Visiteur->value,
            'formations' => [$formation->id],
        ]))->assertStatus(422)->assertJsonValidationErrors('formations');
    }

    public function test_une_formation_dune_autre_edition_est_refusee(): void
    {
        Edition::factory()->active()->create(['annee' => 2026]);
        $autre = Edition::factory()->create(['annee' => 2025]);
        $formation = Formation::factory()->for($autre)->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'formations' => [$formation->id],
        ]))->assertStatus(422)->assertJsonValidationErrors('formations.0');
    }

    public function test_aucune_inscription_si_les_inscriptions_sont_fermees(): void
    {
        Edition::factory()->create(['active' => true, 'inscriptions_ouvertes' => false]);

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertStatus(422);
    }

    public function test_la_reference_est_retournee_et_consultable(): void
    {
        Edition::factory()->active()->create();

        $reference = $this->postJson('/api/inscriptions', $this->donneesValides())
            ->assertCreated()
            ->json('data.reference');

        $this->getJson("/api/inscriptions/".urlencode($reference))
            ->assertOk()
            ->assertJsonPath('data.email', 'aminata@example.com');
    }
}
