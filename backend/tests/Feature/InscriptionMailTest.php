<?php

namespace Tests\Feature;

use App\Enums\TypeParticipation;
use App\Mail\InscriptionRecue;
use App\Models\Edition;
use App\Models\Formation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class InscriptionMailTest extends TestCase
{
    use RefreshDatabase;

    private function donneesValides(array $surcharges = []): array
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

    public function test_un_email_est_envoye_a_linscrit(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();

        Mail::assertSent(InscriptionRecue::class, fn (InscriptionRecue $mail) => $mail->hasTo('aminata@example.com'));
    }

    public function test_lemail_porte_la_reference_en_objet(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $reference = $this->postJson('/api/inscriptions', $this->donneesValides())
            ->json('data.reference');

        Mail::assertSent(
            InscriptionRecue::class,
            fn (InscriptionRecue $mail) => str_contains($mail->envelope()->subject, $reference)
        );
    }

    public function test_lemail_liste_les_formations_choisies(): void
    {
        Mail::fake();
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->create(['titre' => 'Leadership & Management']);

        $this->postJson('/api/inscriptions', $this->donneesValides([
            'type_participation' => TypeParticipation::ParticipantFormation->value,
            'formations' => [$formation->id],
        ]))->assertCreated();

        Mail::assertSent(InscriptionRecue::class, function (InscriptionRecue $mail) {
            $rendu = $mail->render();

            return str_contains($rendu, 'Leadership &amp; Management')
                && str_contains($rendu, 'Formations retenues');
        });
    }

    public function test_lemail_se_rend_sans_erreur_sans_formation(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();

        Mail::assertSent(InscriptionRecue::class, function (InscriptionRecue $mail) {
            $rendu = $mail->render();

            return str_contains($rendu, 'Aminata Souley')
                && ! str_contains($rendu, 'Formations retenues');
        });
    }

    public function test_aucun_email_si_linscription_est_refusee(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides(['consentement' => false]))
            ->assertStatus(422);

        Mail::assertNothingSent();
    }

    /**
     * The registration is committed before the mail is attempted, so a mail
     * outage must not roll it back or surface as a failed request.
     */
    public function test_une_panne_demail_ne_fait_pas_echouer_linscription(): void
    {
        Edition::factory()->active()->create();

        Mail::shouldReceive('send')->once()->andThrow(new \RuntimeException('SMTP indisponible'));

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();

        $this->assertDatabaseHas('inscriptions', ['email' => 'aminata@example.com']);
    }
}
