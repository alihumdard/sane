<?php

namespace Tests\Feature\Admin;

use App\Enums\StatutInscription;
use App\Mail\InscriptionAnnulee;
use App\Mail\InscriptionConfirmee;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\User;
use App\Services\GestionPlaces;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class InscriptionNotificationTest extends TestCase
{
    use RefreshDatabase;

    private Edition $edition;

    protected function setUp(): void
    {
        parent::setUp();
        $this->edition = Edition::factory()->active()->create();
    }

    private function changerStatut(Inscription $inscription, StatutInscription $statut, array $extra = [])
    {
        return $this->actingAs(User::factory()->administrateur()->create())
            ->putJson("/api/admin/inscriptions/{$inscription->id}/statut", [
                'statut' => $statut->value,
                ...$extra,
            ]);
    }

    public function test_confirmer_notifie_le_participant(): void
    {
        Mail::fake();
        $inscription = Inscription::factory()->for($this->edition)
            ->create(['email' => 'aminata@example.com']);

        $this->changerStatut($inscription, StatutInscription::Confirmee)->assertOk();

        Mail::assertSent(
            InscriptionConfirmee::class,
            fn (InscriptionConfirmee $m) => $m->hasTo('aminata@example.com')
        );
        Mail::assertNotSent(InscriptionAnnulee::class);
    }

    public function test_annuler_notifie_le_participant(): void
    {
        Mail::fake();
        $inscription = Inscription::factory()->for($this->edition)
            ->create(['email' => 'aminata@example.com']);

        $this->changerStatut($inscription, StatutInscription::Annulee)->assertOk();

        Mail::assertSent(
            InscriptionAnnulee::class,
            fn (InscriptionAnnulee $m) => $m->hasTo('aminata@example.com')
        );
        Mail::assertNotSent(InscriptionConfirmee::class);
    }

    public function test_le_motif_dannulation_figure_dans_lemail(): void
    {
        Mail::fake();
        $inscription = Inscription::factory()->for($this->edition)->create();

        $this->changerStatut($inscription, StatutInscription::Annulee, [
            'note_admin' => 'Dossier incomplet : pièce d\'identité manquante.',
        ])->assertOk();

        Mail::assertSent(
            InscriptionAnnulee::class,
            fn (InscriptionAnnulee $m) => str_contains($m->render(), 'Dossier incomplet')
        );
    }

    public function test_lemail_de_confirmation_liste_les_formations(): void
    {
        Mail::fake();
        $formation = Formation::factory()->for($this->edition)
            ->avecPlaces(50)
            ->create(['titre' => 'Leadership et Management']);

        $inscription = Inscription::factory()->for($this->edition)->create();
        app(GestionPlaces::class)->reserver($inscription, [$formation->id]);

        $this->changerStatut($inscription, StatutInscription::Confirmee)->assertOk();

        Mail::assertSent(InscriptionConfirmee::class, function (InscriptionConfirmee $m) {
            $rendu = $m->render();

            return str_contains($rendu, 'Leadership et Management')
                && str_contains($rendu, 'Vos formations');
        });
    }

    public function test_lemail_dannulation_se_rend_sans_motif(): void
    {
        Mail::fake();
        $inscription = Inscription::factory()->for($this->edition)->create(['nom' => 'Aminata Souley']);

        $this->changerStatut($inscription, StatutInscription::Annulee)->assertOk();

        Mail::assertSent(
            InscriptionAnnulee::class,
            fn (InscriptionAnnulee $m) => str_contains($m->render(), 'Aminata Souley')
        );
    }

    public function test_un_statut_refuse_nenvoie_aucun_email(): void
    {
        Mail::fake();
        $inscription = Inscription::factory()->for($this->edition)
            ->create(['statut' => StatutInscription::Confirmee]);

        // Already confirmed — the endpoint rejects the no-op.
        $this->changerStatut($inscription, StatutInscription::Confirmee)->assertStatus(422);

        Mail::assertNothingSent();
    }

    /**
     * The status change is committed before the mail is attempted, so an outage
     * must leave the registration validated and merely say the mail failed.
     */
    public function test_une_panne_demail_nempeche_pas_la_validation(): void
    {
        $inscription = Inscription::factory()->for($this->edition)->create();

        Mail::shouldReceive('send')->once()->andThrow(new \RuntimeException('SMTP indisponible'));

        $this->changerStatut($inscription, StatutInscription::Confirmee)
            ->assertOk()
            ->assertJsonPath('data.statut', StatutInscription::Confirmee->value);

        $this->assertSame(StatutInscription::Confirmee, $inscription->fresh()->statut);
    }
}
