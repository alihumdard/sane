<?php

namespace Tests\Feature;

use App\Enums\RoleUtilisateur;
use App\Enums\StatutCandidature;
use App\Enums\StatutEntretien;
use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use App\Mail\EntretienPropose;
use App\Mail\EntretienRappel;
use App\Models\Candidature;
use App\Models\Competence;
use App\Models\CreneauEntretien;
use App\Models\Entreprise;
use App\Models\Entretien;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use App\Models\User;
use App\Services\MoteurMatching;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MatchingEntretienTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();
    }

    /** @return array{0: User, 1: Entreprise} */
    private function recruteur(string $nom = 'Entreprise A'): array
    {
        $user = User::factory()->create(['role' => RoleUtilisateur::Recruteur, 'statut' => 'actif']);

        $entreprise = Entreprise::create([
            'user_id' => $user->id,
            'nom' => $nom,
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'verifiee' => true,
        ]);

        return [$user, $entreprise];
    }

    private function offre(Entreprise $entreprise, array $surcharges = []): OffreEmploi
    {
        return OffreEmploi::create([
            'entreprise_id' => $entreprise->id,
            'titre' => 'Développeur Web PHP',
            'description' => 'Développement applicatif.',
            'profil_recherche' => 'Maîtrise de PHP et JavaScript.',
            'type_contrat' => TypeContrat::Cdi->value,
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'experience_requise' => '2 ans',
            'statut' => StatutOffre::Publiee->value,
            'publiee_le' => now(),
            ...$surcharges,
        ]);
    }

    /** @param array<string> $competences */
    private function candidat(array $attributs = [], array $competences = []): User
    {
        $user = User::factory()->create(['role' => RoleUtilisateur::Demandeur, 'statut' => 'actif']);

        $profil = $user->profilDemandeur()->create([
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'type_emploi' => 'CDI',
            'visible' => true,
            ...$attributs,
        ]);

        foreach ($competences as $nom) {
            $profil->competences()->attach(
                Competence::trouverOuCreer($nom)->id,
                ['niveau' => 'avance'],
            );
        }

        return $user;
    }

    private function creneau(Entreprise $entreprise, array $surcharges = []): CreneauEntretien
    {
        return CreneauEntretien::create([
            'entreprise_id' => $entreprise->id,
            'debut' => now()->addDays(3),
            'fin' => now()->addDays(3)->addHour(),
            'mode' => 'visio',
            ...$surcharges,
        ]);
    }

    private function candidature(OffreEmploi $offre, ProfilDemandeur $profil): Candidature
    {
        return Candidature::create([
            'reference' => Candidature::genererReference(),
            'offre_id' => $offre->id,
            'profil_id' => $profil->id,
            'statut' => StatutCandidature::Envoyee,
        ]);
    }

    /* ─── Moteur de matching ─── */

    public function test_un_profil_parfaitement_aligne_obtient_un_score_eleve(): void
    {
        [, $entreprise] = $this->recruteur();
        $offre = $this->offre($entreprise);

        $candidat = $this->candidat([], ['PHP', 'JavaScript', 'SQL']);
        $candidat->profilDemandeur->experiences()->create([
            'poste' => 'Développeur',
            'entreprise' => 'ACME',
            'date_debut' => now()->subYears(3),
            'en_poste' => true,
        ]);

        $resultat = app(MoteurMatching::class)->score($offre, $candidat->profilDemandeur->refresh());

        $this->assertGreaterThanOrEqual(80, $resultat['score']);
        // The breakdown is the point: a score must be explainable.
        $this->assertArrayHasKey('secteur', $resultat['details']);
        $this->assertSame(30, $resultat['details']['secteur']['obtenu']);
    }

    public function test_un_profil_sans_rapport_est_ecarte(): void
    {
        [, $entreprise] = $this->recruteur();
        $offre = $this->offre($entreprise);

        $this->candidat(['secteur' => 'Santé', 'ville' => 'Zinder', 'type_emploi' => null]);

        $total = app(MoteurMatching::class)->calculerPourOffre($offre);

        $this->assertSame(0, $total);
    }

    public function test_les_profils_non_visibles_ne_sont_jamais_proposes(): void
    {
        [, $entreprise] = $this->recruteur();
        $offre = $this->offre($entreprise);

        $this->candidat(['visible' => false], ['PHP', 'JavaScript', 'SQL']);

        $this->assertSame(0, app(MoteurMatching::class)->calculerPourOffre($offre));
    }

    public function test_le_recalcul_remplace_les_correspondances_obsoletes(): void
    {
        [, $entreprise] = $this->recruteur();
        $offre = $this->offre($entreprise);

        $candidat = $this->candidat([], ['PHP', 'JavaScript', 'SQL']);
        $moteur = app(MoteurMatching::class);

        $this->assertSame(1, $moteur->calculerPourOffre($offre));

        // The candidate hides their profile: the suggestion must disappear.
        $candidat->profilDemandeur->update(['visible' => false]);

        $this->assertSame(0, $moteur->calculerPourOffre($offre));
        $this->assertDatabaseCount('correspondances', 0);
    }

    public function test_le_matching_est_cloisonne_par_entreprise(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $offreB = $this->offre($entrepriseB);

        $this->actingAs($userA)
            ->getJson('/api/entreprise/offres/'.$offreB->id.'/matching')
            ->assertForbidden();

        $this->actingAs($userA)
            ->postJson('/api/entreprise/offres/'.$offreB->id.'/matching/recalculer')
            ->assertForbidden();
    }

    /* ─── Créneaux ─── */

    public function test_un_creneau_dans_le_passe_est_refuse(): void
    {
        [$user] = $this->recruteur();

        $this->actingAs($user)->postJson('/api/entreprise/creneaux', [
            'debut' => now()->subDay()->toDateTimeString(),
            'fin' => now()->subDay()->addHour()->toDateTimeString(),
            'mode' => 'visio',
        ])->assertStatus(422)->assertJsonValidationErrors('debut');
    }

    public function test_un_creneau_presentiel_exige_un_lieu(): void
    {
        [$user] = $this->recruteur();

        $this->actingAs($user)->postJson('/api/entreprise/creneaux', [
            'debut' => now()->addDays(2)->toDateTimeString(),
            'fin' => now()->addDays(2)->addHour()->toDateTimeString(),
            'mode' => 'presentiel',
        ])->assertStatus(422)->assertJsonValidationErrors('lieu');
    }

    public function test_deux_creneaux_ne_peuvent_pas_se_chevaucher(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $this->creneau($entreprise);

        $this->actingAs($user)->postJson('/api/entreprise/creneaux', [
            'debut' => now()->addDays(3)->addMinutes(30)->toDateTimeString(),
            'fin' => now()->addDays(3)->addMinutes(90)->toDateTimeString(),
            'mode' => 'visio',
        ])->assertStatus(422)->assertJsonValidationErrors('debut');
    }

    public function test_un_creneau_reserve_ne_peut_pas_etre_supprime(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $creneau = $this->creneau($entreprise, ['reserve' => true]);

        $this->actingAs($user)
            ->deleteJson('/api/entreprise/creneaux/'.$creneau->id)
            ->assertStatus(409);

        $this->assertDatabaseHas('creneaux_entretien', ['id' => $creneau->id]);
    }

    /* ─── Entretiens ─── */

    public function test_proposer_un_entretien_reserve_le_creneau_et_notifie(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $offre = $this->offre($entreprise);
        $candidat = $this->candidat();
        $candidature = $this->candidature($offre, $candidat->profilDemandeur);
        $creneau = $this->creneau($entreprise);

        $this->actingAs($user)
            ->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
                'creneau_id' => $creneau->id,
            ])
            ->assertCreated()
            ->assertJsonPath('data.statut', StatutEntretien::EnAttente->value);

        $this->assertTrue($creneau->refresh()->reserve);
        // Scheduling an interview is itself a stage of the application.
        $this->assertSame(StatutCandidature::Entretien, $candidature->refresh()->statut);

        Mail::assertSent(EntretienPropose::class);
    }

    public function test_un_creneau_deja_pris_ne_peut_pas_etre_repropose(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $offre = $this->offre($entreprise);
        $creneau = $this->creneau($entreprise);

        $premier = $this->candidature($offre, $this->candidat()->profilDemandeur);
        $second = $this->candidature($offre, $this->candidat()->profilDemandeur);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$premier->id.'/entretien', [
            'creneau_id' => $creneau->id,
        ])->assertCreated();

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$second->id.'/entretien', [
            'creneau_id' => $creneau->id,
        ])->assertStatus(409);

        $this->assertSame(1, Entretien::count());
    }

    public function test_un_creneau_dune_autre_entreprise_est_refuse(): void
    {
        [$userA, $entrepriseA] = $this->recruteur('Entreprise A');
        [, $entrepriseB] = $this->recruteur('Entreprise B');

        $candidature = $this->candidature(
            $this->offre($entrepriseA),
            $this->candidat()->profilDemandeur,
        );

        $this->actingAs($userA)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $this->creneau($entrepriseB)->id,
        ])->assertStatus(409);
    }

    public function test_le_candidat_confirme_son_entretien(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidat = $this->candidat();
        $candidature = $this->candidature($this->offre($entreprise), $candidat->profilDemandeur);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $this->creneau($entreprise)->id,
        ])->assertCreated();

        $entretien = Entretien::sole();

        $this->actingAs($candidat)
            ->postJson('/api/entretiens/'.$entretien->id.'/confirmer')
            ->assertOk()
            ->assertJsonPath('data.statut', StatutEntretien::Confirme->value);
    }

    public function test_un_autre_candidat_ne_peut_pas_confirmer(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidature = $this->candidature($this->offre($entreprise), $this->candidat()->profilDemandeur);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $this->creneau($entreprise)->id,
        ])->assertCreated();

        $this->actingAs($this->candidat())
            ->postJson('/api/entretiens/'.Entretien::sole()->id.'/confirmer')
            ->assertForbidden();
    }

    public function test_annuler_libere_le_creneau(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidature = $this->candidature($this->offre($entreprise), $this->candidat()->profilDemandeur);
        $creneau = $this->creneau($entreprise);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $creneau->id,
        ])->assertCreated();

        $this->actingAs($user)
            ->postJson('/api/entreprise/entretiens/'.Entretien::sole()->id.'/annuler', [
                'motif' => 'Poste pourvu.',
            ])
            ->assertOk();

        // The slot must go back into the pool, not stay dead.
        $this->assertFalse($creneau->refresh()->reserve);
    }

    public function test_un_entretien_annule_ne_peut_plus_etre_confirme(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidat = $this->candidat();
        $candidature = $this->candidature($this->offre($entreprise), $candidat->profilDemandeur);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $this->creneau($entreprise)->id,
        ])->assertCreated();

        $entretien = Entretien::sole();

        $this->actingAs($user)
            ->postJson('/api/entreprise/entretiens/'.$entretien->id.'/annuler')
            ->assertOk();

        $this->actingAs($candidat)
            ->postJson('/api/entretiens/'.$entretien->id.'/confirmer')
            ->assertStatus(409);
    }

    public function test_une_entreprise_ne_voit_pas_les_entretiens_dune_autre(): void
    {
        [$userA] = $this->recruteur('Entreprise A');
        [$userB, $entrepriseB] = $this->recruteur('Entreprise B');

        $candidature = $this->candidature($this->offre($entrepriseB), $this->candidat()->profilDemandeur);

        $this->actingAs($userB)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $this->creneau($entrepriseB)->id,
        ])->assertCreated();

        $this->actingAs($userA)->getJson('/api/entreprise/entretiens')
            ->assertOk()
            ->assertJsonPath('meta.total', 0);

        $this->actingAs($userA)
            ->postJson('/api/entreprise/entretiens/'.Entretien::sole()->id.'/annuler')
            ->assertForbidden();
    }

    /* ─── Rappels ─── */

    public function test_le_rappel_part_une_seule_fois(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidat = $this->candidat();
        $candidature = $this->candidature($this->offre($entreprise), $candidat->profilDemandeur);

        // Within the 24h reminder window.
        $creneau = $this->creneau($entreprise, [
            'debut' => now()->addHours(20),
            'fin' => now()->addHours(21),
        ]);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $creneau->id,
        ])->assertCreated();

        $this->actingAs($candidat)->postJson('/api/entretiens/'.Entretien::sole()->id.'/confirmer')->assertOk();

        $this->artisan('sanem:rappels-entretiens')->assertSuccessful();
        Mail::assertSent(EntretienRappel::class, 1);

        // Idempotent: a second run must not mail the candidate again.
        $this->artisan('sanem:rappels-entretiens')->assertSuccessful();
        Mail::assertSent(EntretienRappel::class, 1);
    }

    public function test_aucun_rappel_pour_un_entretien_non_confirme(): void
    {
        [$user, $entreprise] = $this->recruteur();
        $candidature = $this->candidature($this->offre($entreprise), $this->candidat()->profilDemandeur);

        $this->actingAs($user)->postJson('/api/entreprise/candidatures/'.$candidature->id.'/entretien', [
            'creneau_id' => $this->creneau($entreprise, [
                'debut' => now()->addHours(20),
                'fin' => now()->addHours(21),
            ])->id,
        ])->assertCreated();

        $this->artisan('sanem:rappels-entretiens')->assertSuccessful();

        Mail::assertNotSent(EntretienRappel::class);
    }
}
