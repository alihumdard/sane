<?php

namespace Tests\Feature\Admin;

use App\Enums\RoleUtilisateur;
use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use App\Models\Actualite;
use App\Models\Entreprise;
use App\Models\Formation;
use App\Models\OffreEmploi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackOfficeTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => RoleUtilisateur::Administrateur,
            'statut' => 'actif',
        ]);
    }

    private function entreprise(bool $verifiee = true): Entreprise
    {
        return Entreprise::create([
            'user_id' => User::factory()->create(['role' => RoleUtilisateur::Recruteur, 'statut' => 'actif'])->id,
            'nom' => 'Entreprise '.uniqid(),
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'verifiee' => $verifiee,
        ]);
    }

    private function offre(Entreprise $entreprise, array $surcharges = []): OffreEmploi
    {
        return OffreEmploi::create([
            'entreprise_id' => $entreprise->id,
            'titre' => 'Poste '.uniqid(),
            'description' => 'Description.',
            'type_contrat' => TypeContrat::Cdi->value,
            'secteur' => 'Informatique & Digital',
            'ville' => 'Niamey',
            'statut' => StatutOffre::Publiee->value,
            'publiee_le' => now(),
            ...$surcharges,
        ]);
    }

    /* ─── Accès ─── */

    public function test_le_back_office_est_ferme_aux_non_administrateurs(): void
    {
        $this->getJson('/api/admin/statistiques')->assertUnauthorized();

        $demandeur = User::factory()->create(['role' => RoleUtilisateur::Demandeur, 'statut' => 'actif']);

        $this->actingAs($demandeur)->getJson('/api/admin/statistiques')->assertForbidden();
        $this->actingAs($demandeur)->getJson('/api/admin/utilisateurs')->assertForbidden();
        $this->actingAs($demandeur)->getJson('/api/admin/exports/inscriptions')->assertForbidden();
    }

    /* ─── Utilisateurs ─── */

    public function test_un_administrateur_cree_un_utilisateur_avec_nimporte_quel_role(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/api/admin/utilisateurs', [
                'name' => 'Nouvel Organisateur',
                'email' => 'organisateur@example.com',
                'password' => 'sanem2026',
                'role' => 'organisateur',
            ])
            ->assertCreated()
            ->assertJsonPath('data.role', 'organisateur');
    }

    public function test_un_administrateur_ne_peut_pas_se_retirer_ses_droits(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->putJson('/api/admin/utilisateurs/'.$admin->id, ['role' => 'participant'])
            ->assertStatus(422);

        $this->assertSame(RoleUtilisateur::Administrateur, $admin->refresh()->role);
    }

    public function test_un_administrateur_ne_peut_pas_se_supprimer(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->deleteJson('/api/admin/utilisateurs/'.$admin->id)
            ->assertStatus(422);

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_le_dernier_administrateur_ne_peut_pas_etre_supprime(): void
    {
        $admin = $this->admin();
        $autre = $this->admin();

        // Two admins: deleting one is fine.
        $this->actingAs($admin)->deleteJson('/api/admin/utilisateurs/'.$autre->id)->assertOk();

        // One left: an organiser must not be able to remove them either.
        $organisateur = User::factory()->create(['role' => RoleUtilisateur::Organisateur, 'statut' => 'actif']);

        $this->actingAs($organisateur)
            ->deleteJson('/api/admin/utilisateurs/'.$admin->id)
            ->assertStatus(422);
    }

    public function test_suspendre_un_compte_revoque_ses_jetons(): void
    {
        $cible = User::factory()->create(['role' => RoleUtilisateur::Demandeur, 'statut' => 'actif']);
        $cible->createToken('api');

        $this->assertSame(1, $cible->tokens()->count());

        $this->actingAs($this->admin())
            ->putJson('/api/admin/utilisateurs/'.$cible->id, ['statut' => 'suspendu'])
            ->assertOk();

        // A suspended account must not keep working through an old token.
        $this->assertSame(0, $cible->refresh()->tokens()->count());
    }

    /* ─── Modération emploi ─── */

    public function test_retirer_la_verification_ferme_les_offres_publiees(): void
    {
        $entreprise = $this->entreprise();
        $offre = $this->offre($entreprise);

        $this->getJson('/api/offres')->assertOk()->assertJsonPath('meta.total', 1);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/emploi/entreprises/'.$entreprise->id.'/verification', ['verifiee' => false])
            ->assertOk();

        // The gate must apply continuously, not only at publication time.
        $this->assertSame(StatutOffre::Fermee, $offre->refresh()->statut);
        $this->getJson('/api/offres')->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_le_recruteur_est_prevenu_que_ses_offres_ont_ete_fermees(): void
    {
        // The closure lands on someone who is not in the room: without a word
        // they open their dashboard to postings closed, with nothing saying
        // why or by whom.
        $entreprise = $this->entreprise();
        $this->offre($entreprise);
        $this->offre($entreprise);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/emploi/entreprises/'.$entreprise->id.'/verification', ['verifiee' => false])
            ->assertOk()
            ->assertJsonPath('message', 'Vérification retirée : 2 offres fermées, le recruteur a été prévenu.');

        $notification = $entreprise->user->notifications()->first();

        $this->assertNotNull($notification);
        $this->assertSame('Vos offres ont été fermées', $notification->data['titre']);
        $this->assertStringContainsString('2 offres ont été fermées', $notification->data['message']);
    }

    /**
     * An offer the recruiter closed themselves, because the post was filled,
     * is indistinguishable from one closed by a withdrawal — so neither is
     * reopened, and the message says as much.
     */
    public function test_rendre_la_verification_ne_republie_rien(): void
    {
        $entreprise = $this->entreprise(verifiee: false);
        $offre = $this->offre($entreprise, ['statut' => StatutOffre::Fermee->value]);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/emploi/entreprises/'.$entreprise->id.'/verification', ['verifiee' => true])
            ->assertOk();

        $this->assertSame(StatutOffre::Fermee, $offre->refresh()->statut);
        $this->assertCount(0, $entreprise->user->notifications()->get());
    }

    public function test_un_organisateur_ferme_nimporte_quelle_offre(): void
    {
        $offre = $this->offre($this->entreprise());

        $this->actingAs($this->admin())
            ->putJson('/api/admin/emploi/offres/'.$offre->id.'/statut', ['statut' => 'fermee'])
            ->assertOk();

        $this->assertSame(StatutOffre::Fermee, $offre->refresh()->statut);
    }

    /* ─── Contenus ─── */

    public function test_le_crud_des_actualites_alimente_le_site_public(): void
    {
        $admin = $this->admin();

        $id = $this->actingAs($admin)->postJson('/api/admin/actualites', [
            'titre' => 'Une annonce importante',
            'categorie' => 'communiques',
            'contenu' => 'Le contenu complet.',
            'publiee' => true,
        ])->assertCreated()->json('data.id');

        $this->getJson('/api/actualites')->assertOk()->assertJsonPath('meta.total', 1);

        // Unpublishing must remove it from the public site immediately.
        $this->actingAs($admin)->putJson('/api/admin/actualites/'.$id, [
            'titre' => 'Une annonce importante',
            'categorie' => 'communiques',
            'contenu' => 'Le contenu complet.',
            'publiee' => false,
        ])->assertOk();

        $this->getJson('/api/actualites')->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_une_actualite_non_publiee_nest_pas_accessible_par_son_slug(): void
    {
        Actualite::create([
            'titre' => 'Brouillon confidentiel',
            'categorie' => 'communiques',
            'contenu' => 'Pas encore prêt.',
            'publiee' => false,
        ]);

        $this->getJson('/api/actualites/brouillon-confidentiel')->assertNotFound();
    }

    public function test_les_contenus_exigent_une_authentification(): void
    {
        $this->postJson('/api/admin/actualites', ['titre' => 'X'])->assertUnauthorized();
        $this->postJson('/api/admin/faq', ['question' => 'X'])->assertUnauthorized();
        $this->postJson('/api/admin/partenaires', ['nom' => 'X'])->assertUnauthorized();
        $this->postJson('/api/admin/presse', ['titre' => 'X'])->assertUnauthorized();
    }

    public function test_la_faq_publique_ne_montre_que_les_entrees_publiees(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->postJson('/api/admin/faq', [
            'categorie' => 'generalites',
            'question' => 'Question visible ?',
            'reponse' => 'Oui.',
            'publiee' => true,
        ])->assertCreated();

        $this->actingAs($admin)->postJson('/api/admin/faq', [
            'categorie' => 'generalites',
            'question' => 'Question masquée ?',
            'reponse' => 'Non.',
            'publiee' => false,
        ])->assertCreated();

        $this->getJson('/api/faq')->assertOk()->assertJsonCount(1, 'data');
    }

    /* ─── Statistiques et exports ─── */

    public function test_les_statistiques_agregent_les_modules(): void
    {
        $this->offre($this->entreprise());

        $this->actingAs($this->admin())
            ->getJson('/api/admin/statistiques')
            ->assertOk()
            ->assertJsonStructure([
                'inscriptions' => ['total'],
                'formations' => ['total', 'places_totales'],
                'emploi' => ['offres', 'candidatures', 'entreprises'],
                'utilisateurs' => ['total'],
                'activite',
            ])
            ->assertJsonPath('emploi.offres.total', 1);
    }

    public function test_lexport_renvoie_un_fichier_excel(): void
    {
        $response = $this->actingAs($this->admin())->get('/api/admin/exports/offres');

        $response->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $this->assertStringContainsString('attachment;', $response->headers->get('content-disposition'));
    }

    public function test_lexport_contient_les_en_tetes_et_les_lignes(): void
    {
        $entreprise = $this->entreprise();
        $this->offre($entreprise, ['titre' => 'Poste exporté']);

        $response = $this->actingAs($this->admin())->get('/api/admin/exports/offres');
        $response->assertOk();

        $lignes = $this->lireFeuilleExcel($response->streamedContent());

        $this->assertSame('Titre', $lignes[0][0]);
        $this->assertSame('Entreprise', $lignes[0][1]);
        $this->assertTrue(
            collect($lignes)->contains(fn (array $ligne) => in_array('Poste exporté', $ligne, true)),
        );
    }

    /** Reads an in-memory xlsx response back into rows, for asserting on content. */
    private function lireFeuilleExcel(string $contenu): array
    {
        $chemin = tempnam(sys_get_temp_dir(), 'xlsx');
        file_put_contents($chemin, $contenu);

        try {
            return \PhpOffice\PhpSpreadsheet\IOFactory::load($chemin)
                ->getActiveSheet()
                ->toArray();
        } finally {
            unlink($chemin);
        }
    }

    /* ─── Réconciliation des compteurs ─── */

    public function test_la_commande_corrige_un_compteur_desynchronise(): void
    {
        $formation = Formation::factory()->avecPlaces(20)->create(['inscriptions_count' => 7]);

        $this->artisan('sanem:reconcilier-compteurs')->assertSuccessful();

        // No pivot rows exist, so the counter must come back to zero.
        $this->assertSame(0, $formation->refresh()->inscriptions_count);
    }

    public function test_le_mode_simulation_ne_modifie_rien(): void
    {
        $formation = Formation::factory()->avecPlaces(20)->create(['inscriptions_count' => 7]);

        $this->artisan('sanem:reconcilier-compteurs --dry-run')->assertSuccessful();

        $this->assertSame(7, $formation->refresh()->inscriptions_count);
    }
}
