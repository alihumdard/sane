<?php

namespace Tests\Feature;

use App\Enums\TypeParticipation;
use App\Mail\InscriptionRecue;
use App\Mail\VerifierInscription;
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

    /**
     * A l'inscription, un seul email part : la demande de confirmation.
     *
     * Le recapitulatif attend le clic. Sinon la personne recoit deux messages
     * contradictoires a une minute d'intervalle, dont l'un lui annonce une
     * inscription qui n'est pas encore acquise.
     */
    public function test_la_demande_de_confirmation_part_a_linscription(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();

        Mail::assertSent(VerifierInscription::class, fn (VerifierInscription $mail) => $mail->hasTo('aminata@example.com'));
        Mail::assertNotSent(InscriptionRecue::class);
    }

    public function test_le_recapitulatif_part_a_la_confirmation(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();
        $this->postJson('/api/inscriptions/verifier/'.$this->jetonEnvoye())->assertOk();

        Mail::assertSent(InscriptionRecue::class, fn (InscriptionRecue $mail) => $mail->hasTo('aminata@example.com'));
    }

    public function test_lemail_porte_la_reference_en_objet(): void
    {
        Mail::fake();
        Edition::factory()->active()->create();

        $reference = $this->postJson('/api/inscriptions', $this->donneesValides())
            ->json('reference');

        $this->postJson('/api/inscriptions/verifier/'.$this->jetonEnvoye())->assertOk();

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

        $this->postJson('/api/inscriptions/verifier/'.$this->jetonEnvoye())->assertOk();

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
        $this->postJson('/api/inscriptions/verifier/'.$this->jetonEnvoye())->assertOk();

        Mail::assertSent(InscriptionRecue::class, function (InscriptionRecue $mail) {
            $rendu = $mail->render();

            return str_contains($rendu, 'Aminata Souley')
                && ! str_contains($rendu, 'Formations retenues');
        });
    }

    /**
     * Le jeton en clair ne vit que le temps de l'email : la base n'en garde
     * que l'empreinte. On le relit donc depuis le courrier, comme le ferait
     * la personne inscrite.
     */
    private function jetonEnvoye(): string
    {
        $mail = collect(Mail::sent(VerifierInscription::class))->last();

        $this->assertNotNull($mail, "Aucune demande de confirmation n'a ete envoyee.");

        return $mail->jetonClair;
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

    /**
     * The send history is the admin's record of who was written to; a row
     * naming nobody is no record at all.
     *
     * Envelope keeps `to:` in whichever form it was given — an Address for
     * `to: [$user]`, a plain string for `to: [$email]` — and every Mailable
     * here passes the string.
     */
    public function test_lenvoi_enregistre_le_destinataire(): void
    {
        Edition::factory()->active()->create();

        $this->postJson('/api/inscriptions', $this->donneesValides())->assertCreated();

        $this->assertDatabaseHas('envoi_notifications', [
            'destinataire_email' => 'aminata@example.com',
            'statut' => 'envoyee',
        ]);
    }
}
