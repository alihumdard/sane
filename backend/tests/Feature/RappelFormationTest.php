<?php

namespace Tests\Feature;

use App\Enums\StatutInscription;
use App\Mail\RappelFormation;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RappelFormationTest extends TestCase
{
    use RefreshDatabase;

    private Edition $edition;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();

        $this->edition = Edition::factory()->active()->create();
    }

    private function formation(?string $date = null): Formation
    {
        return Formation::factory()
            ->for($this->edition)
            ->avecPlaces(30)
            ->create(['date_debut' => $date ?? now()->addDays(3)->toDateString()]);
    }

    private function inscrit(Formation $formation, StatutInscription $statut = StatutInscription::Confirmee): Inscription
    {
        $inscription = Inscription::factory()
            ->for($this->edition)
            ->create(['statut' => $statut]);

        $inscription->formations()->attach($formation->id);

        return $inscription;
    }

    public function test_un_rappel_part_trois_jours_avant(): void
    {
        $this->inscrit($this->formation());

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertSent(RappelFormation::class, 1);
    }

    public function test_le_rappel_ne_part_quune_fois(): void
    {
        $this->inscrit($this->formation());

        $this->artisan('sanem:rappels-formations')->assertSuccessful();
        Mail::assertSent(RappelFormation::class, 1);

        // Idempotent: a second run the same day must not mail anyone twice.
        $this->artisan('sanem:rappels-formations')->assertSuccessful();
        Mail::assertSent(RappelFormation::class, 1);
    }

    public function test_aucun_rappel_pour_une_inscription_en_attente(): void
    {
        // No seat is held until an organiser validates, so there is nothing
        // to remind the person about.
        $this->inscrit($this->formation(), StatutInscription::EnAttente);

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertNotSent(RappelFormation::class);
    }

    public function test_aucun_rappel_pour_une_inscription_annulee(): void
    {
        $this->inscrit($this->formation(), StatutInscription::Annulee);

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertNotSent(RappelFormation::class);
    }

    public function test_aucun_rappel_pour_une_autre_date(): void
    {
        $this->inscrit($this->formation(now()->addDays(10)->toDateString()));

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertNotSent(RappelFormation::class);
    }

    public function test_une_formation_sans_date_est_ignoree(): void
    {
        $sansDate = Formation::factory()
            ->for($this->edition)
            ->avecPlaces(30)
            ->create(['date_debut' => null]);

        $this->inscrit($sansDate);

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertNotSent(RappelFormation::class);
    }

    public function test_le_delai_est_configurable(): void
    {
        $this->inscrit($this->formation(now()->addDay()->toDateString()));

        $this->artisan('sanem:rappels-formations --jours=1')->assertSuccessful();

        Mail::assertSent(RappelFormation::class, 1);
    }

    public function test_chaque_formation_a_son_propre_rappel(): void
    {
        // A participant taking two courses on the same day is reminded about
        // each one: the stamp lives on the pivot, not the registration.
        $premiere = $this->formation();
        $seconde = $this->formation();

        $inscription = Inscription::factory()
            ->for($this->edition)
            ->create(['statut' => StatutInscription::Confirmee]);

        $inscription->formations()->attach([$premiere->id, $seconde->id]);

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertSent(RappelFormation::class, 2);
    }

    public function test_le_rappel_est_adresse_au_participant(): void
    {
        $formation = $this->formation();
        $inscription = $this->inscrit($formation);

        $this->artisan('sanem:rappels-formations')->assertSuccessful();

        Mail::assertSent(
            RappelFormation::class,
            fn (RappelFormation $mail) => $mail->hasTo($inscription->email)
                && $mail->formation->is($formation)
        );
    }
}
