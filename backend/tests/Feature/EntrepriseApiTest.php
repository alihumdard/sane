<?php

namespace Tests\Feature;

use App\Enums\RoleUtilisateur;
use App\Enums\StatutCandidature;
use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use App\Models\Candidature;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EntrepriseApiTest extends TestCase
{
    use RefreshDatabase;

    /** @return array{0: User, 1: Entreprise} */
    private function recruteur(string $nom = 'Entreprise A', bool $verifiee = true): array
    {
        $user = User::factory()->create([
            'role' => RoleUtilisateur::Recruteur,
            'statut' => 'actif',
        ]);

        $entreprise = Entreprise::create([
            'user_id' => $user->id,
            'nom' => $nom,
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'verifiee' => $verifiee,
        ]);

        return [$user, $entreprise];
    }

    private function offre(Entreprise $entreprise, array $surcharges = []): OffreEmploi
    {
        return OffreEmploi::create([
            'entreprise_id' => $entreprise->id,
            'titre' => 'Poste '.uniqid(),
            'description' => 'Description du poste.',
            'type_contrat' => TypeContrat::Cdi->value,
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'statut' => StatutOffre::Publiee->value,
            'publiee_le' => now(),
            ...$surcharges,
        ]);
    }

    private function candidat(): User
    {
        $user = User::factory()->create([
            'role' => RoleUtilisateur::Demandeur,
            'statut' => 'actif',
        ]);

        $user->profilDemandeur()->create(['visible' => true]);

        return $user;
    }

    private function candidature(Entreprise $entreprise, User $candidat, ?OffreEmploi $offre = null): Candidature
    {
        $offre ??= $this->offre($entreprise);

        return Candidature::create([
            'reference' => Candidature::genererReference(),
            'offre_id' => $offre->id,
            'profil_id' => $candidat->profilDemandeur->id,
            'statut' => StatutCandidature::Envoyee,
        ]);
    }

    /* ─── Profil entreprise ─── */

    public function test_un_recruteur_cree_son_profil_entreprise(): void
    {
        $user = User::factory()->create(['role' => RoleUtilisateur::Recruteur, 'statut' => 'actif']);

        $this->actingAs($user)
            ->postJson('/api/entreprise', ['nom' => 'Startup Niamey', 'ville' => 'Niamey'])
            ->assertCreated()
            // Verification belongs to the organisers, never the applicant.
            ->assertJsonPath('data.verifiee', false);
    }

    public function test_une_entreprise_ne_peut_pas_se_declarer_verifiee(): void
    {
        $user = User::factory()->create(['role' => RoleUtilisateur::Recruteur, 'statut' => 'actif']);

        $this->actingAs($user)
            ->postJson('/api/entreprise', ['nom' => 'Fausse', 'verifiee' => true])
            ->assertCreated()
            ->assertJsonPath('data.verifiee', false);
    }

    public function test_un_demandeur_na_pas_acces_a_lespace_recruteur(): void
    {
        $this->actingAs($this->candidat())
            ->getJson('/api/entreprise/offres')
            ->assertForbidden();
    }

    /* ─── Offres ─── */

    public function test_une_entreprise_non_verifiee_ne_peut_pas_publier(): void
    {
        [$user] = $this->recruteur('Non verifiee', verifiee: false);

        $this->actingAs($user)->postJson('/api/entreprise/offres', [
            'titre' => 'Développeur',
            'description' => 'Description.',
            'type_contrat' => 'cdi',
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'statut' => 'publiee',
        ])->assertForbidden();

        $this->assertSame(0, OffreEmploi::count());
    }

    public function test_une_entreprise_non_verifiee_peut_enregistrer_un_brouillon(): void
    {
        [$user] = $this->recruteur('Non verifiee', verifiee: false);

        $this->actingAs($user)->postJson('/api/entreprise/offres', [
            'titre' => 'Développeur',
            'description' => 'Description.',
            'type_contrat' => 'cdi',
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
        ])->assertCreated()->assertJsonPath('data.statut', 'brouillon');

        // A draft must never reach the public board.
        $this->getJson('/api/offres')->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_la_liste_ne_contient_que_ses_propres_offres(): void
    {
        [$userA, $entrepriseA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $this->offre($entrepriseA, ['titre' => 'Poste A']);
        $this->offre($entrepriseB, ['titre' => 'Poste B']);

        $response = $this->actingAs($userA)->getJson('/api/entreprise/offres')->assertOk();

        $this->assertSame(1, $response->json('meta.total'));
        $this->assertSame('Poste A', $response->json('data.0.titre'));
    }

    public function test_une_entreprise_ne_peut_pas_lire_loffre_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $offre = $this->offre($entrepriseB);

        $this->actingAs($userA)->getJson('/api/entreprise/offres/'.$offre->id)->assertForbidden();
    }

    public function test_une_entreprise_ne_peut_pas_modifier_loffre_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $offre = $this->offre($entrepriseB, ['titre' => 'Intact']);

        $this->actingAs($userA)->putJson('/api/entreprise/offres/'.$offre->id, [
            'titre' => 'Pirate',
            'description' => 'x',
            'type_contrat' => 'cdi',
            'secteur' => 'X',
            'ville' => 'Niamey',
        ])->assertForbidden();

        $this->assertSame('Intact', $offre->refresh()->titre);
    }

    public function test_une_entreprise_ne_peut_pas_supprimer_loffre_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $offre = $this->offre($entrepriseB);

        $this->actingAs($userA)->deleteJson('/api/entreprise/offres/'.$offre->id)->assertForbidden();

        $this->assertDatabaseHas('offres_emploi', ['id' => $offre->id]);
    }

    public function test_le_salaire_maximum_doit_depasser_le_minimum(): void
    {
        [$user] = $this->recruteur();

        $this->actingAs($user)->postJson('/api/entreprise/offres', [
            'titre' => 'Développeur',
            'description' => 'Description.',
            'type_contrat' => 'cdi',
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'salaire_min' => 900000,
            'salaire_max' => 300000,
        ])->assertStatus(422)->assertJsonValidationErrors('salaire_max');
    }

    /* ─── Candidatures reçues ─── */

    public function test_le_recruteur_voit_les_candidatures_de_ses_offres(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $this->candidature($entreprise, $this->candidat());

        $this->actingAs($user)->getJson('/api/entreprise/candidatures')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_une_entreprise_ne_voit_pas_les_candidatures_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $this->candidature($entrepriseB, $this->candidat());

        $this->actingAs($userA)->getJson('/api/entreprise/candidatures')
            ->assertOk()
            ->assertJsonPath('meta.total', 0);
    }

    public function test_une_entreprise_ne_peut_pas_ouvrir_la_candidature_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $candidature = $this->candidature($entrepriseB, $this->candidat());

        $this->actingAs($userA)->getJson('/api/entreprise/candidatures/'.$candidature->id)
            ->assertForbidden();
    }

    public function test_une_entreprise_ne_peut_pas_changer_le_statut_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $candidature = $this->candidature($entrepriseB, $this->candidat());

        $this->actingAs($userA)
            ->putJson('/api/entreprise/candidatures/'.$candidature->id.'/statut', ['statut' => 'refusee'])
            ->assertForbidden();

        $this->assertSame(StatutCandidature::Envoyee, $candidature->refresh()->statut);
    }

    public function test_le_recruteur_fait_avancer_une_candidature(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidature = $this->candidature($entreprise, $this->candidat());

        $this->actingAs($user)
            ->putJson('/api/entreprise/candidatures/'.$candidature->id.'/statut', [
                'statut' => 'preselectionnee',
                'note_recruteur' => 'Bon profil.',
            ])
            ->assertOk()
            ->assertJsonPath('data.statut', 'preselectionnee');

        $this->assertSame('Bon profil.', $candidature->refresh()->note_recruteur);
    }

    public function test_la_note_du_recruteur_reste_invisible_au_candidat(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidat = $this->candidat();
        $candidature = $this->candidature($entreprise, $candidat);

        $this->actingAs($user)->putJson('/api/entreprise/candidatures/'.$candidature->id.'/statut', [
            'statut' => 'en_revue',
            'note_recruteur' => 'Note confidentielle.',
        ])->assertOk();

        $this->actingAs($candidat)
            ->getJson('/api/mes-candidatures/'.$candidature->id)
            ->assertOk()
            ->assertJsonMissingPath('data.note_recruteur');
    }

    /* ─── Recherche de candidats ─── */

    public function test_la_recherche_ignore_les_profils_non_visibles(): void
    {
        [$user] = $this->recruteur();

        $this->candidat();                                   // visible
        $cache = $this->candidat();
        $cache->profilDemandeur->update(['visible' => false]);

        $this->actingAs($user)->getJson('/api/entreprise/candidats')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_la_recherche_nexpose_pas_les_coordonnees(): void
    {
        [$user] = $this->recruteur();
        $this->candidat();

        $this->actingAs($user)->getJson('/api/entreprise/candidats')
            ->assertOk()
            ->assertJsonMissingPath('data.0.email')
            ->assertJsonMissingPath('data.0.telephone');
    }

    public function test_les_coordonnees_souvrent_apres_une_candidature(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidat = $this->candidat();
        $profil = $candidat->profilDemandeur;

        // Before applying: withheld.
        $this->actingAs($user)->getJson('/api/entreprise/candidats/'.$profil->id)
            ->assertOk()
            ->assertJsonMissingPath('data.email');

        $this->candidature($entreprise, $candidat);

        // After applying to this company: disclosed.
        $this->actingAs($user)->getJson('/api/entreprise/candidats/'.$profil->id)
            ->assertOk()
            ->assertJsonPath('data.email', $candidat->email);
    }

    public function test_un_profil_cache_nest_pas_consultable_directement(): void
    {
        [$user] = $this->recruteur();

        $profil = $this->candidat()->profilDemandeur;
        $profil->update(['visible' => false]);

        $this->actingAs($user)->getJson('/api/entreprise/candidats/'.$profil->id)->assertNotFound();
    }

    /* ─── Tableau de bord ─── */

    public function test_le_tableau_de_bord_ne_compte_que_ses_donnees(): void
    {
        [$userA, $entrepriseA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $this->offre($entrepriseA);
        $this->offre($entrepriseB);
        $this->offre($entrepriseB);
        $this->candidature($entrepriseB, $this->candidat());

        $this->actingAs($userA)->getJson('/api/entreprise/tableau-de-bord')
            ->assertOk()
            ->assertJsonPath('offres.total', 1)
            ->assertJsonPath('candidatures.total', 0);
    }
}
