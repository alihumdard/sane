<?php

namespace Tests\Feature;

use App\Support\Referentiels;
use Tests\TestCase;

class ReferentielApiTest extends TestCase
{
    public function test_les_listes_sont_publiques(): void
    {
        // The registration form is filled in before anyone has an account, so
        // the lists it needs cannot sit behind a token.
        $this->getJson('/api/referentiels')
            ->assertOk()
            ->assertJsonStructure(['secteurs', 'nationalites', 'villes']);
    }

    public function test_les_nationalites_sont_groupees(): void
    {
        $reponse = $this->getJson('/api/referentiels')->assertOk();

        $groupes = $reponse->json('nationalites');

        // Grouped, not flat: nearly eighty nationalities in one list is
        // something to scroll rather than something to choose from.
        $this->assertArrayHasKey("Afrique de l'Ouest", $groupes);
        $this->assertContains('Nigérienne', $groupes["Afrique de l'Ouest"]);
        $this->assertArrayHasKey('Europe', $groupes);
        $this->assertArrayHasKey('Asie et Moyen-Orient', $groupes);
    }

    public function test_aucune_nationalite_nest_proposee_deux_fois(): void
    {
        $toutes = Referentiels::nationalites();

        $this->assertSame(
            count($toutes),
            count(array_unique($toutes)),
            'Une nationalité apparaît dans deux groupes.'
        );
    }

    public function test_autre_ferme_chaque_liste(): void
    {
        // Whatever the list covers, someone will fall outside it, and a
        // required field with no way out blocks the registration entirely.
        $secteurs = Referentiels::SECTEURS;
        $villes = Referentiels::VILLES;

        $this->assertSame('Autre', end($secteurs));
        $this->assertSame('Autre', end($villes));
        $this->assertContains('Autre', Referentiels::nationalites());
    }

    public function test_les_secteurs_servis_sont_ceux_de_la_reference(): void
    {
        // One list for both forms: a sector picked on a registration has to be
        // spelled exactly like the one picked on a job posting, because
        // MoteurMatching compares them as text for its largest single weight.
        $this->getJson('/api/referentiels')
            ->assertOk()
            ->assertExactJson([
                'secteurs' => Referentiels::SECTEURS,
                'nationalites' => Referentiels::NATIONALITES,
                'villes' => Referentiels::VILLES,
            ]);
    }
}
