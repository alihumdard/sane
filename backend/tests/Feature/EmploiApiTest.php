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

class EmploiApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A jobseeker whose profile carries what an application requires.
     *
     * Pass `complet: false` for someone who has only just signed up — they
     * cannot apply, which is the point of the check.
     */
    private function demandeur(string $email = 'demandeur@example.com', bool $complet = true): User
    {
        $user = User::factory()->create([
            'email' => $email,
            'role' => RoleUtilisateur::Demandeur,
            'statut' => 'actif',
        ]);

        $profil = $user->profilDemandeur()->create();

        if ($complet) {
            $profil->update([
                'titre_pro' => 'Développeuse web',
                'secteur' => 'Informatique & Numérique',
                'ville' => 'Niamey',
            ]);

            $profil->formations()->create([
                'diplome' => 'Licence en informatique',
                'etablissement' => 'Université Abdou Moumouni',
                'annee_debut' => 2018,
                'annee_fin' => 2021,
            ]);

            $profil->documents()->create([
                'type' => 'cv',
                'nom_original' => 'cv.pdf',
                'chemin' => 'documents/candidatures/'.$profil->id.'/cv.pdf',
                'mime' => 'application/pdf',
                'taille' => 1024,
                'principal' => true,
            ]);
        }

        return $user;
    }

    /** The recruiter who owns a company, for the employer-side endpoints. */
    private function recruteur(Entreprise $entreprise): User
    {
        return User::findOrFail($entreprise->user_id);
    }

    private function offre(array $surcharges = []): OffreEmploi
    {
        $recruteur = User::factory()->create(['role' => RoleUtilisateur::Recruteur, 'statut' => 'actif']);

        $entreprise = Entreprise::create([
            'user_id' => $recruteur->id,
            'nom' => 'Entreprise Test '.uniqid(),
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'verifiee' => true,
        ]);

        return OffreEmploi::create([
            'entreprise_id' => $entreprise->id,
            'titre' => 'Développeur Web '.uniqid(),
            'description' => 'Une description de poste.',
            'type_contrat' => TypeContrat::Cdi->value,
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'statut' => StatutOffre::Publiee->value,
            'publiee_le' => now(),
            ...$surcharges,
        ]);
    }

    /* ─── Création de compte ─── */

    public function test_un_demandeur_peut_creer_un_compte(): void
    {
        $this->postJson('/api/auth/inscription', [
            'nom' => 'Ibrahim Moussa',
            'email' => 'ibrahim@example.com',
            'password' => 'sanem2026',
            'password_confirmation' => 'sanem2026',
            'role' => 'demandeur',
        ])->assertCreated()->assertJsonPath('user.role', 'demandeur');

        $user = User::where('email', 'ibrahim@example.com')->sole();

        // The profile must exist straight away: the rest of the space hangs off it.
        $this->assertNotNull($user->profilDemandeur);
    }

    public function test_un_role_privilegie_ne_peut_pas_etre_choisi(): void
    {
        $this->postJson('/api/auth/inscription', [
            'nom' => 'Intrus',
            'email' => 'intrus@example.com',
            'password' => 'sanem2026',
            'password_confirmation' => 'sanem2026',
            'role' => 'administrateur',
        ])->assertStatus(422)->assertJsonValidationErrors('role');

        $this->assertDatabaseMissing('users', ['email' => 'intrus@example.com']);
    }

    public function test_un_mot_de_passe_faible_est_refuse(): void
    {
        $this->postJson('/api/auth/inscription', [
            'nom' => 'Test',
            'email' => 'faible@example.com',
            'password' => 'abc',
            'password_confirmation' => 'abc',
            'role' => 'demandeur',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    /* ─── Recherche publique ─── */

    public function test_seules_les_offres_publiees_sont_visibles(): void
    {
        $this->offre(['titre' => 'Poste publie']);
        $this->offre(['titre' => 'Poste brouillon', 'statut' => StatutOffre::Brouillon->value]);

        $response = $this->getJson('/api/offres')->assertOk();

        $this->assertSame(1, $response->json('meta.total'));
        $this->assertSame('Poste publie', $response->json('data.0.titre'));
    }

    public function test_une_offre_expiree_est_exclue(): void
    {
        $this->offre(['titre' => 'Poste expire', 'date_limite' => now()->subDay()->toDateString()]);

        $this->getJson('/api/offres')->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_la_recherche_filtre_par_ville_et_contrat(): void
    {
        $this->offre(['ville' => 'Zinder']);
        $this->offre(['ville' => 'Niamey', 'type_contrat' => TypeContrat::Stage->value]);

        $this->getJson('/api/offres?ville=Zinder')->assertOk()->assertJsonPath('meta.total', 1);
        $this->getJson('/api/offres?type_contrat=stage')->assertOk()->assertJsonPath('meta.total', 1);
    }

    public function test_les_filtres_renvoient_des_compteurs(): void
    {
        $this->offre(['ville' => 'Niamey']);
        $this->offre(['ville' => 'Niamey']);

        $filtres = $this->getJson('/api/offres')->assertOk()->json('filtres.ville');

        $this->assertSame(['valeur' => 'Niamey', 'libelle' => 'Niamey', 'total' => 2], $filtres[0]);
    }

    public function test_la_consultation_incremente_les_vues(): void
    {
        $offre = $this->offre();

        $this->getJson('/api/offres/'.$offre->slug)->assertOk();

        $this->assertSame(1, $offre->refresh()->vues);
    }

    /* ─── Profil ─── */

    public function test_le_profil_exige_une_authentification(): void
    {
        $this->getJson('/api/profil')->assertUnauthorized();
    }

    public function test_un_demandeur_met_a_jour_son_profil(): void
    {
        $this->actingAs($this->demandeur())
            ->putJson('/api/profil', [
                'titre_pro' => 'Développeur Web',
                'ville' => 'Niamey',
                'visible' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.titre_pro', 'Développeur Web');
    }

    public function test_une_competence_reajoutee_met_a_jour_son_niveau(): void
    {
        $user = $this->demandeur();

        $this->actingAs($user)->postJson('/api/profil/competences', [
            'nom' => 'PHP', 'niveau' => 'debutant',
        ])->assertCreated();

        $this->actingAs($user)->postJson('/api/profil/competences', [
            'nom' => 'PHP', 'niveau' => 'expert',
        ])->assertCreated();

        $competences = $user->profilDemandeur->competences()->get();

        $this->assertCount(1, $competences);
        $this->assertSame('expert', $competences->first()->pivot->niveau);
    }

    public function test_une_experience_dun_autre_profil_est_inaccessible(): void
    {
        $proprietaire = $this->demandeur('proprietaire@example.com');
        $intrus = $this->demandeur('intrus@example.com');

        $experience = $proprietaire->profilDemandeur->experiences()->create([
            'poste' => 'Développeur',
            'entreprise' => 'ACME',
            'date_debut' => '2023-01-01',
        ]);

        $this->actingAs($intrus)
            ->deleteJson('/api/profil/experiences/'.$experience->id)
            ->assertForbidden();

        $this->assertDatabaseHas('experiences', ['id' => $experience->id]);
    }

    /* ─── Candidatures ─── */

    public function test_un_demandeur_postule_a_une_offre(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre();

        $this->actingAs($user)
            ->postJson('/api/offres/'.$offre->slug.'/postuler', [
                'lettre_motivation' => 'Je suis motivé.',
            ])
            ->assertCreated()
            ->assertJsonPath('data.statut', StatutCandidature::Envoyee->value);

        $this->assertSame(1, $offre->refresh()->candidatures_count);
    }

    /**
     * Someone who signed up a minute ago has nothing for a recruiter to read:
     * the candidature holds a name and nothing else — no CV, no schooling,
     * nothing to decide on.
     */
    public function test_un_profil_vide_ne_peut_pas_postuler(): void
    {
        $user = $this->demandeur(complet: false);
        $offre = $this->offre();

        $this->actingAs($user)
            ->postJson('/api/offres/'.$offre->slug.'/postuler')
            ->assertStatus(409)
            ->assertJsonFragment([
                'message' => 'Complétez votre profil avant de postuler : il vous manque un CV, au moins une formation et vos informations professionnelles (titre, secteur, ville).',
            ]);

        $this->assertSame(0, $offre->refresh()->candidatures_count);
        $this->assertDatabaseCount('candidatures', 0);
    }

    public function test_un_profil_sans_cv_ne_peut_pas_postuler(): void
    {
        $user = $this->demandeur(complet: false);
        $user->profilDemandeur->update([
            'titre_pro' => 'Développeuse web',
            'secteur' => 'Informatique & Numérique',
            'ville' => 'Niamey',
        ]);
        $user->profilDemandeur->formations()->create([
            'diplome' => 'Licence',
            'etablissement' => 'Université Abdou Moumouni',
            'annee_debut' => 2018,
            'annee_fin' => 2021,
        ]);

        $this->actingAs($user)
            ->postJson('/api/offres/'.$this->offre()->slug.'/postuler')
            ->assertStatus(409)
            ->assertJsonFragment([
                'message' => 'Complétez votre profil avant de postuler : il vous manque un CV.',
            ]);
    }

    /**
     * An offer may ask up to two selection questions; a candidate applying to
     * it has to answer them.
     *
     * A CV says what someone has done, not whether they hold a licence or can
     * start on Monday — recruiters were asking in the description and reading
     * the answers nowhere.
     */
    public function test_les_reponses_sont_exigees_quand_loffre_pose_des_questions(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre([
            'question_1' => 'Avez-vous un permis de conduire ?',
            'question_2' => 'Êtes-vous disponible immédiatement ?',
        ]);

        $this->actingAs($user)
            ->postJson('/api/offres/'.$offre->slug.'/postuler')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reponse_1', 'reponse_2']);

        $this->actingAs($user)
            ->postJson('/api/offres/'.$offre->slug.'/postuler', [
                'reponse_1' => 'Oui, permis B depuis 2015.',
                'reponse_2' => 'Oui, dès la semaine prochaine.',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('candidatures', [
            'reponse_1' => 'Oui, permis B depuis 2015.',
            'reponse_2' => 'Oui, dès la semaine prochaine.',
        ]);
    }

    public function test_une_offre_sans_question_nexige_aucune_reponse(): void
    {
        $this->actingAs($this->demandeur())
            ->postJson('/api/offres/'.$this->offre()->slug.'/postuler')
            ->assertCreated();
    }

    public function test_seule_la_question_posee_est_exigee(): void
    {
        // An employer may ask one and leave the other blank.
        $offre = $this->offre(['question_1' => 'Avez-vous un permis ?']);

        $this->actingAs($this->demandeur())
            ->postJson('/api/offres/'.$offre->slug.'/postuler', ['reponse_1' => 'Oui.'])
            ->assertCreated();
    }

    /**
     * The list selected a column list for the offer, and the two question
     * columns were not on it — so the card had answers with nothing above
     * them and hid the pair.
     */
    public function test_le_recruteur_voit_les_questions_avec_les_reponses(): void
    {
        $offre = $this->offre();
        $offre->update(['question_1' => 'Permis de conduire ?', 'question_2' => 'Disponible ?']);

        $this->actingAs($this->demandeur())
            ->postJson('/api/offres/'.$offre->slug.'/postuler', [
                'reponse_1' => 'Oui, permis B.',
                'reponse_2' => 'Sous une semaine.',
            ])
            ->assertCreated();

        $recruteur = $this->recruteur($offre->entreprise);

        $this->actingAs($recruteur)
            ->getJson('/api/entreprise/candidatures')
            ->assertOk()
            ->assertJsonPath('data.0.offre.question_1', 'Permis de conduire ?')
            ->assertJsonPath('data.0.reponse_1', 'Oui, permis B.');

        $this->actingAs($recruteur)
            ->getJson('/api/entreprise/offres/'.$offre->id.'/candidatures')
            ->assertOk()
            ->assertJsonPath('data.0.offre.question_2', 'Disponible ?')
            ->assertJsonPath('data.0.reponse_2', 'Sous une semaine.');
    }

    public function test_le_recruteur_voit_le_profil_du_candidat(): void
    {
        // The list used to load the name and the CV and nothing else, so the
        // recruiter had no skills, schooling or past posts to judge on.
        $user = $this->demandeur();
        $offre = $this->offre();

        $this->actingAs($user)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertCreated();

        $this->actingAs($this->recruteur($offre->entreprise))
            ->getJson('/api/entreprise/candidatures')
            ->assertOk()
            ->assertJsonPath('data.0.profil.formations.0.diplome', 'Licence en informatique');
    }

    public function test_un_profil_sans_informations_ne_peut_pas_postuler(): void
    {
        // A CV alone leaves the candidate out of every search: the engine
        // matches on sector and city, and the listing shows the title.
        $user = $this->demandeur(complet: false);
        $user->profilDemandeur->formations()->create([
            'diplome' => 'Licence',
            'etablissement' => 'Université Abdou Moumouni',
            'annee_debut' => 2018,
            'annee_fin' => 2021,
        ]);
        $user->profilDemandeur->documents()->create([
            'type' => 'cv',
            'nom_original' => 'cv.pdf',
            'chemin' => 'documents/candidatures/1/cv.pdf',
            'mime' => 'application/pdf',
            'taille' => 1024,
            'principal' => true,
        ]);

        $this->actingAs($user)
            ->postJson('/api/offres/'.$this->offre()->slug.'/postuler')
            ->assertStatus(409)
            ->assertJsonFragment([
                'message' => 'Complétez votre profil avant de postuler : il vous manque vos informations professionnelles (titre, secteur, ville).',
            ]);
    }

    /** The client named CV and FORMATION as the two required fields. */
    public function test_un_profil_sans_formation_ne_peut_pas_postuler(): void
    {
        $user = $this->demandeur(complet: false);
        $user->profilDemandeur->update([
            'titre_pro' => 'Menuisier',
            'secteur' => 'Artisanat & Métiers manuels',
            'ville' => 'Niamey',
        ]);
        $user->profilDemandeur->documents()->create([
            'type' => 'cv',
            'nom_original' => 'cv.pdf',
            'chemin' => 'documents/candidatures/1/cv.pdf',
            'mime' => 'application/pdf',
            'taille' => 1024,
            'principal' => true,
        ]);

        $this->actingAs($user)
            ->postJson('/api/offres/'.$this->offre()->slug.'/postuler')
            ->assertStatus(409)
            ->assertJsonFragment([
                'message' => 'Complétez votre profil avant de postuler : il vous manque au moins une formation.',
            ]);
    }

    public function test_loffre_signale_au_demandeur_quil_a_deja_postule(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre();

        // The offer stays public, so the route carries no `auth:sanctum`. It
        // must still read the token when one is sent, or the page offers to
        // apply a second time to someone who already has.
        $this->actingAs($user)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertCreated();

        $this->actingAs($user)
            ->getJson('/api/offres/'.$offre->slug)
            ->assertOk()
            ->assertJsonPath('data.deja_postule', true);
    }

    public function test_un_visiteur_ne_recoit_pas_les_indicateurs_personnels(): void
    {
        $offre = $this->offre();

        $this->getJson('/api/offres/'.$offre->slug)
            ->assertOk()
            ->assertJsonMissingPath('data.deja_postule')
            ->assertJsonMissingPath('data.en_favori');
    }

    public function test_on_ne_peut_pas_postuler_deux_fois(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre();

        $this->actingAs($user)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertCreated();
        $this->actingAs($user)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertStatus(409);

        // The duplicate must not have inflated the counter.
        $this->assertSame(1, $offre->refresh()->candidatures_count);
    }

    public function test_on_ne_peut_pas_postuler_a_une_offre_fermee(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre(['statut' => StatutOffre::Fermee->value]);

        $this->actingAs($user)
            ->postJson('/api/offres/'.$offre->slug.'/postuler')
            ->assertNotFound();
    }

    public function test_une_candidature_dun_autre_demandeur_est_inaccessible(): void
    {
        $proprietaire = $this->demandeur('proprietaire@example.com');
        $intrus = $this->demandeur('intrus@example.com');
        $offre = $this->offre();

        $this->actingAs($proprietaire)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertCreated();

        $candidature = Candidature::sole();

        $this->actingAs($intrus)->getJson('/api/mes-candidatures/'.$candidature->id)->assertForbidden();
        $this->actingAs($intrus)->deleteJson('/api/mes-candidatures/'.$candidature->id)->assertForbidden();

        $this->assertDatabaseHas('candidatures', ['id' => $candidature->id]);
    }

    public function test_la_liste_ne_montre_que_ses_propres_candidatures(): void
    {
        $premier = $this->demandeur('premier@example.com');
        $second = $this->demandeur('second@example.com');

        $this->actingAs($premier)->postJson('/api/offres/'.$this->offre()->slug.'/postuler')->assertCreated();

        $this->actingAs($second)->getJson('/api/mes-candidatures')
            ->assertOk()
            ->assertJsonPath('meta.total', 0);
    }

    public function test_une_candidature_traitee_ne_peut_plus_etre_retiree(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre();

        $this->actingAs($user)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertCreated();

        $candidature = Candidature::sole();
        $candidature->update(['statut' => StatutCandidature::Acceptee]);

        $this->actingAs($user)
            ->deleteJson('/api/mes-candidatures/'.$candidature->id)
            ->assertStatus(409);
    }

    public function test_retirer_une_candidature_decremente_le_compteur(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre();

        $this->actingAs($user)->postJson('/api/offres/'.$offre->slug.'/postuler')->assertCreated();
        $this->assertSame(1, $offre->refresh()->candidatures_count);

        $this->actingAs($user)->deleteJson('/api/mes-candidatures/'.Candidature::sole()->id)->assertOk();

        $this->assertSame(0, $offre->refresh()->candidatures_count);
    }

    /* ─── Favoris ─── */

    public function test_un_favori_se_pose_et_se_retire(): void
    {
        $user = $this->demandeur();
        $offre = $this->offre();

        $this->actingAs($user)->postJson('/api/offres/'.$offre->id.'/favori')
            ->assertOk()->assertJsonPath('en_favori', true);

        $this->actingAs($user)->getJson('/api/mes-favoris')->assertOk()->assertJsonCount(1, 'data');

        $this->actingAs($user)->postJson('/api/offres/'.$offre->id.'/favori')
            ->assertOk()->assertJsonPath('en_favori', false);
    }
}
