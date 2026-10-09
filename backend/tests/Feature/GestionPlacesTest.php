<?php

namespace Tests\Feature;

use App\Exceptions\PlacesEpuiseesException;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\Inscription;
use App\Services\GestionPlaces;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class GestionPlacesTest extends TestCase
{
    use RefreshDatabase;

    private GestionPlaces $places;

    protected function setUp(): void
    {
        parent::setUp();
        $this->places = app(GestionPlaces::class);
    }

    public function test_reserver_incremente_les_places_et_attache_les_formations(): void
    {
        $edition = Edition::factory()->active()->create();
        $a = Formation::factory()->for($edition)->avecPlaces(50)->create();
        $b = Formation::factory()->for($edition)->avecPlaces(30)->create();
        $inscription = Inscription::factory()->for($edition)->create();

        $this->places->reserver($inscription, [$a->id, $b->id]);

        $this->assertSame(1, $a->fresh()->inscriptions_count);
        $this->assertSame(1, $b->fresh()->inscriptions_count);
        $this->assertCount(2, $inscription->formations);
    }

    public function test_reserver_refuse_une_formation_complete(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(10, 10)->create();
        $inscription = Inscription::factory()->for($edition)->create();

        $this->expectException(PlacesEpuiseesException::class);

        $this->places->reserver($inscription, [$formation->id]);
    }

    public function test_reserver_annule_tout_si_une_seule_formation_est_complete(): void
    {
        $edition = Edition::factory()->active()->create();
        $libre = Formation::factory()->for($edition)->avecPlaces(50)->create();
        $complete = Formation::factory()->for($edition)->avecPlaces(10, 10)->create();
        $inscription = Inscription::factory()->for($edition)->create();

        try {
            $this->places->reserver($inscription, [$libre->id, $complete->id]);
        } catch (PlacesEpuiseesException) {
            // expected
        }

        // The whole reservation rolls back — no seat is taken on the free one.
        $this->assertSame(0, $libre->fresh()->inscriptions_count);
        $this->assertCount(0, $inscription->fresh()->formations);
    }

    public function test_la_derniere_place_ne_peut_etre_prise_que_par_une_inscription(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(10, 9)->create();

        $premiere = Inscription::factory()->for($edition)->create();
        $seconde = Inscription::factory()->for($edition)->create();

        $this->places->reserver($premiere, [$formation->id]);

        $this->expectException(PlacesEpuiseesException::class);
        $this->places->reserver($seconde, [$formation->id]);

        $this->assertSame(10, $formation->fresh()->inscriptions_count);
    }

    public function test_liberer_rend_les_places(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(50)->create();
        $inscription = Inscription::factory()->for($edition)->create();

        $this->places->reserver($inscription, [$formation->id]);
        $this->assertSame(1, $formation->fresh()->inscriptions_count);

        $this->places->liberer($inscription);

        $this->assertSame(0, $formation->fresh()->inscriptions_count);
        $this->assertTrue($inscription->fresh()->places_liberees);
    }

    public function test_liberer_deux_fois_ne_decremente_quune_seule_fois(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(50, 5)->create();
        $inscription = Inscription::factory()->for($edition)->create();

        $this->places->reserver($inscription, [$formation->id]);
        $this->assertSame(6, $formation->fresh()->inscriptions_count);

        $this->places->liberer($inscription);
        $this->places->liberer($inscription);

        $this->assertSame(5, $formation->fresh()->inscriptions_count);
    }

    public function test_les_attributs_derives_survivent_a_une_selection_partielle(): void
    {
        $edition = Edition::factory()->active()->create();
        Formation::factory()->for($edition)->avecPlaces(50, 10)->create();

        // A partial select leaves max_inscriptions null; the derived attributes
        // must degrade to zero rather than dividing by it.
        $partielle = Formation::select('id', 'titre')->first();

        $this->assertSame(0, $partielle->taux_remplissage);
        $this->assertSame(0, $partielle->places_restantes);
    }

    public function test_la_contrainte_base_de_donnees_empeche_la_survente(): void
    {
        $edition = Edition::factory()->active()->create();
        $formation = Formation::factory()->for($edition)->avecPlaces(10, 10)->create();

        // Even bypassing the service entirely, the database refuses.
        $this->expectException(\Illuminate\Database\QueryException::class);

        DB::table('formations')
            ->where('id', $formation->id)
            ->update(['inscriptions_count' => 11]);
    }
}
