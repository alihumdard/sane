<?php

namespace Tests\Feature;

use App\Enums\StatutInscription;
use App\Enums\TypeParticipation;
use App\Mail\VerifierInscription;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class InscriptionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Les tests récupèrent le jeton de confirmation depuis le courrier
        // envoyé : la base n'en garde que l'empreinte.
        Mail::fake();
    }

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
            ->assertJsonPath('verification_requise', true)
            ->assertJsonPath('email', 'aminata@example.com');

        $this->assertDatabaseCount('inscriptions', 1);

        $inscription = Inscription::sole();

        $this->assertNull($inscription->email_verifie_le);
        $this->assertSame([$formation->id], $inscription->formations_demandees);

        // Le point de toute la manœuvre : la place n'est pas encore prise.
        // Une adresse inventée ne retire donc rien à personne.
        $this->assertSame(0, $formation->fresh()->inscriptions_count);
    }

    public function test_la_place_est_reservee_a_la_confirmation(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(50)->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'formations' => [$formation->id],
        ]))->assertCreated();

        $this->postJson('/api/inscriptions/verifier/'.$this->jetonDeLaDerniere())
            ->assertOk()
            ->assertJsonPath('deja_confirme', false)
            ->assertJsonPath('data.formations.0.places_restantes', 49);

        $this->assertSame(1, $formation->fresh()->inscriptions_count);
        $this->assertNotNull(Inscription::sole()->email_verifie_le);
    }

    public function test_rouvrir_le_lien_ne_prend_pas_une_seconde_place(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(50)->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'formations' => [$formation->id],
        ]))->assertCreated();

        $jeton = $this->jetonDeLaDerniere();

        $this->postJson('/api/inscriptions/verifier/'.$jeton)->assertOk();

        // Rejouer le lien répond « déjà confirmée », sans prendre une
        // seconde place.
        $this->postJson('/api/inscriptions/verifier/'.$jeton)
            ->assertOk()
            ->assertJsonPath('deja_confirme', true);

        $this->assertSame(1, $formation->fresh()->inscriptions_count);
    }

    public function test_un_jeton_inconnu_est_refuse(): void
    {
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions/verifier/'.str_repeat('a', 64))
            ->assertNotFound();
    }

    public function test_une_formation_remplie_entre_temps_ne_perd_pas_linscription(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(1)->create();

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'formations' => [$formation->id],
        ]))->assertCreated();

        // Quelqu'un d'autre prend la dernière place pendant que notre
        // inscrit n'a pas encore ouvert son courrier.
        $formation->increment('inscriptions_count');

        $this->postJson('/api/inscriptions/verifier/'.$this->jetonDeLaDerniere())
            ->assertOk()
            // L'inscription au salon tient : seule la formation est manquée.
            ->assertJsonPath('deja_confirme', false)
            ->assertJsonCount(1, 'formations_completes');

        $this->assertNotNull(Inscription::sole()->email_verifie_le);
        $this->assertSame(1, $formation->fresh()->inscriptions_count);
    }

    /**
     * Le jeton en clair ne vit que le temps de l'email : la base n'en garde
     * que l'empreinte. On le récupère donc depuis le courrier envoyé, comme
     * le ferait la personne inscrite.
     */
    private function jetonDeLaDerniere(): string
    {
        $mail = collect(Mail::sent(VerifierInscription::class))->last();

        $this->assertNotNull($mail, "Aucune demande de confirmation n'a été envoyée.");

        return $mail->jetonClair;
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
            ->json('reference');

        $this->getJson('/api/inscriptions/'.urlencode($reference))
            ->assertOk()
            ->assertJsonPath('data.email', 'aminata@example.com');
    }

    public function test_la_reference_ne_contient_aucun_caractere_reserve_aux_urls(): void
    {
        Edition::factory()->active()->create();

        $reference = $this->postJson('/api/inscriptions', $this->donneesValides())
            ->json('reference');

        // A "#" would be read as a fragment and never reach the server, so the
        // reference-keyed routes would 404 for every registration.
        $this->assertSame($reference, rawurlencode($reference));
    }

    /**
     * References are derived from the row's own id, so a batch of registrations
     * gets a distinct one each. Generating from max(id) took no lock and would
     * collide here, failing the unique index with a 500 rather than a 422.
     */
    public function test_des_inscriptions_successives_obtiennent_des_references_distinctes(): void
    {
        Edition::factory()->active()->create();

        // Ce test porte sur l'unicité des références, pas sur la limitation de
        // débit : cinq inscriptions d'affilée depuis la même adresse IP sont
        // précisément ce que le limiteur est là pour arrêter (voir
        // test_la_limitation_de_debit_arrete_les_envois_en_rafale).
        $this->withoutMiddleware(ThrottleRequests::class);

        $references = collect(range(1, 5))->map(
            fn (int $i) => $this->postJson('/api/inscriptions', $this->donneesValides([
                'email' => "participant{$i}@example.com",
            ]))->assertCreated()->json('reference')
        );

        $this->assertCount(5, $references->unique());
    }
}
