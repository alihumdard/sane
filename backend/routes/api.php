<?php

use App\Http\Controllers\Api\Admin\ActualiteAdminController;
use App\Http\Controllers\Api\Admin\DocumentAdminController;
use App\Http\Controllers\Api\Admin\EditionAdminController;
use App\Http\Controllers\Api\Admin\EmploiAdminController;
use App\Http\Controllers\Api\Admin\EnvoiNotificationAdminController;
use App\Http\Controllers\Api\Admin\ParametreAdminController;
use App\Http\Controllers\Api\Admin\FaqAdminController;
use App\Http\Controllers\Api\Admin\FormateurAdminController;
use App\Http\Controllers\Api\Admin\FormationAdminController;
use App\Http\Controllers\Api\Admin\ImageAdminController;
use App\Http\Controllers\Api\Admin\InscriptionAdminController;
use App\Http\Controllers\Api\Admin\PartenaireAdminController;
use App\Http\Controllers\Api\Admin\PresseAdminController;
use App\Http\Controllers\Api\Admin\SessionProgrammeAdminController;
use App\Http\Controllers\Api\Admin\RapportAdminController;
use App\Http\Controllers\Api\Admin\UtilisateurAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ParametrePublicController;
use App\Http\Controllers\Api\StatistiquePubliqueController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\Api\ContenuPublicController;
use App\Http\Controllers\Api\DocumentCandidatureController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\Entreprise\CandidatureEntrepriseController;
use App\Http\Controllers\Api\Entreprise\EntrepriseController;
use App\Http\Controllers\Api\Entreprise\EntretienEntrepriseController;
use App\Http\Controllers\Api\Entreprise\MatchingController;
use App\Http\Controllers\Api\Entreprise\OffreEntrepriseController;
use App\Http\Controllers\Api\Entreprise\TableauBordController;
use App\Http\Controllers\Api\EntretienController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\InscriptionController;
use App\Http\Controllers\Api\IntervenantController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\ReferentielController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes publiques
|--------------------------------------------------------------------------
*/

Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{formation}', [FormationController::class, 'show']);

Route::post('/inscriptions', [InscriptionController::class, 'store'])
    ->middleware('throttle:10,1');
Route::get('/inscriptions/{reference}', [InscriptionController::class, 'show']);

// Pièces justificatives : la référence seule est devinable, donc l'email
// d'inscription est exigé en plus comme preuve d'identité.
Route::get('/inscriptions/{reference}/documents', [DocumentController::class, 'index']);
Route::post('/inscriptions/{reference}/documents', [DocumentController::class, 'store'])
    ->middleware('throttle:20,1');
Route::delete('/inscriptions/{reference}/documents/{document}', [DocumentController::class, 'destroy']);

// Contenus éditoriaux — alimentent le site public depuis la base.
// The organisation's own details — phone, address, social accounts — read by
// the footer, the contact page and the legal pages.
Route::get('/parametres', [ParametrePublicController::class, 'show']);

// The figures the public pages print under their headings. Every one of them
// used to be written into the front-end.
Route::get('/statistiques', [StatistiquePubliqueController::class, 'index']);

// The contact form. Throttled like the other public writes: it sends mail.
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1');

Route::get('/actualites', [ContenuPublicController::class, 'actualites']);
Route::get('/actualites/{slug}', [ContenuPublicController::class, 'actualite']);
Route::get('/faq', [ContenuPublicController::class, 'faq']);
Route::get('/partenaires', [ContenuPublicController::class, 'partenaires']);
Route::get('/presse', [ContenuPublicController::class, 'presse']);

// The event's schedule, grouped by day — the shape the programme page shows.
Route::get('/programme', [ContenuPublicController::class, 'programme']);

Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');
Route::post('/auth/inscription', [AuthController::class, 'inscription'])
    ->middleware('throttle:5,1');
Route::post('/auth/mot-de-passe/oublie', [AuthController::class, 'motDePasseOublie'])
    ->middleware('throttle:5,1');
Route::post('/auth/mot-de-passe/reinitialiser', [AuthController::class, 'motDePasseReinitialiser'])
    ->middleware('throttle:5,1');

// Portail emploi — consultable sans compte. `auth.facultatif` n'exige pas de
// jeton, mais le lit s'il est présent : l'offre peut alors indiquer au
// demandeur qu'il a déjà postulé ou mis l'offre en favori.
Route::middleware('auth.facultatif')->group(function () {
    Route::get('/offres', [OffreController::class, 'index']);
    Route::get('/offres/{slug}', [OffreController::class, 'show']);
});

Route::get('/secteurs', [OffreController::class, 'secteurs']);

// Les listes proposées par les formulaires. Publiques : l'inscription se
// remplit sans compte.
Route::get('/referentiels', [ReferentielController::class, 'index']);

// Les intervenants affiches sur le site public.
Route::get('/intervenants', [IntervenantController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Routes authentifiées
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/lue', [NotificationController::class, 'marquerLue']);
    Route::post('/notifications/tout-lu', [NotificationController::class, 'marquerToutesLues']);
});

/*
|--------------------------------------------------------------------------
| Espace demandeur d'emploi — Phase 5
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:demandeur,participant'])->group(function () {
    Route::get('/profil', [ProfilController::class, 'show']);
    Route::put('/profil', [ProfilController::class, 'update']);

    Route::post('/profil/competences', [ProfilController::class, 'ajouterCompetence']);
    Route::delete('/profil/competences/{competence}', [ProfilController::class, 'retirerCompetence']);

    Route::post('/profil/formations', [ProfilController::class, 'ajouterFormation']);
    Route::put('/profil/formations/{formation}', [ProfilController::class, 'modifierFormation']);
    Route::delete('/profil/formations/{formation}', [ProfilController::class, 'supprimerFormation']);

    Route::post('/profil/experiences', [ProfilController::class, 'ajouterExperience']);
    Route::put('/profil/experiences/{experience}', [ProfilController::class, 'modifierExperience']);
    Route::delete('/profil/experiences/{experience}', [ProfilController::class, 'supprimerExperience']);

    Route::get('/profil/documents', [DocumentCandidatureController::class, 'index']);
    Route::post('/profil/documents', [DocumentCandidatureController::class, 'store'])
        ->middleware('throttle:20,1');
    Route::delete('/profil/documents/{document}', [DocumentCandidatureController::class, 'destroy']);

    Route::post('/offres/{slug}/postuler', [CandidatureController::class, 'postuler'])
        ->middleware('throttle:20,1');
    Route::get('/mes-candidatures', [CandidatureController::class, 'index']);
    Route::get('/mes-candidatures/{candidature}', [CandidatureController::class, 'show']);
    Route::delete('/mes-candidatures/{candidature}', [CandidatureController::class, 'retirer']);

    Route::get('/mes-favoris', [CandidatureController::class, 'favoris']);

    // Entretiens et correspondances — Phase 7
    Route::get('/mes-entretiens', [EntretienController::class, 'index']);
    Route::post('/entretiens/{entretien}/confirmer', [EntretienController::class, 'confirmer']);
    Route::post('/entretiens/{entretien}/annuler', [EntretienController::class, 'annuler']);
    Route::get('/mes-correspondances', [EntretienController::class, 'correspondances']);
    Route::post('/offres/{offre}/favori', [CandidatureController::class, 'basculerFavori']);
});

/*
|--------------------------------------------------------------------------
| Espace recruteur — Phase 6
|--------------------------------------------------------------------------
| Chaque route est cloisonnée par entreprise : les policies OffrePolicy et
| CandidaturePolicy refusent tout accès aux données d'une autre entreprise.
*/

Route::middleware(['auth:sanctum', 'role:recruteur,entreprise'])
    ->prefix('entreprise')
    ->group(function () {
        Route::get('/tableau-de-bord', TableauBordController::class);

        Route::get('/', [EntrepriseController::class, 'show']);
        Route::post('/', [EntrepriseController::class, 'store']);

        Route::get('/offres', [OffreEntrepriseController::class, 'index']);
        Route::post('/offres', [OffreEntrepriseController::class, 'store']);
        Route::get('/offres/{offre}', [OffreEntrepriseController::class, 'show']);
        Route::put('/offres/{offre}', [OffreEntrepriseController::class, 'update']);
        Route::delete('/offres/{offre}', [OffreEntrepriseController::class, 'destroy']);
        Route::put('/offres/{offre}/statut', [OffreEntrepriseController::class, 'changerStatut']);
        Route::get('/offres/{offre}/candidatures', [CandidatureEntrepriseController::class, 'parOffre']);

        Route::get('/candidatures', [CandidatureEntrepriseController::class, 'index']);
        Route::get('/candidatures/{candidature}', [CandidatureEntrepriseController::class, 'show']);
        Route::put('/candidatures/{candidature}/statut', [CandidatureEntrepriseController::class, 'changerStatut']);
        Route::get('/candidatures/{candidature}/cv', [CandidatureEntrepriseController::class, 'telechargerCv']);

        // Matching & entretiens — Phase 7
        Route::get('/offres/{offre}/matching', [MatchingController::class, 'index']);
        Route::post('/offres/{offre}/matching/recalculer', [MatchingController::class, 'recalculer']);
        Route::put('/matching/{correspondance}/statut', [MatchingController::class, 'changerStatut']);

        Route::get('/creneaux', [EntretienEntrepriseController::class, 'creneaux']);
        Route::post('/creneaux', [EntretienEntrepriseController::class, 'creerCreneau']);
        Route::delete('/creneaux/{creneau}', [EntretienEntrepriseController::class, 'supprimerCreneau']);

        Route::get('/entretiens', [EntretienEntrepriseController::class, 'index']);
        Route::post('/candidatures/{candidature}/entretien', [EntretienEntrepriseController::class, 'proposer']);
        Route::post('/entretiens/{entretien}/annuler', [EntretienEntrepriseController::class, 'annuler']);
        Route::post('/entretiens/{entretien}/terminer', [EntretienEntrepriseController::class, 'terminer']);

        Route::get('/candidats', [CandidatureEntrepriseController::class, 'candidats']);
        Route::get('/candidats/{profil}', [CandidatureEntrepriseController::class, 'candidat']);
    });

// Lecture d'un CV : le contrôleur décide qui y a droit (candidat, recruteur
// destinataire d'une candidature, ou organisateur).
Route::middleware('auth:sanctum')
    ->get('/documents-candidature/{document}/telecharger', [DocumentCandidatureController::class, 'download']);

/*
|--------------------------------------------------------------------------
| Back-office — administrateurs et organisateurs
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:administrateur,organisateur'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/inscriptions', [InscriptionAdminController::class, 'index']);
        Route::get('/inscriptions/{inscription}', [InscriptionAdminController::class, 'show']);
        Route::put('/inscriptions/{inscription}/statut', [InscriptionAdminController::class, 'changerStatut']);
        Route::delete('/inscriptions/{inscription}', [InscriptionAdminController::class, 'destroy']);
        Route::post('/inscriptions/suppression-multiple', [InscriptionAdminController::class, 'destroyPlusieurs']);

        Route::get('/inscriptions/{inscription}/documents', [DocumentAdminController::class, 'index']);
        Route::get('/documents/{document}/telecharger', [DocumentAdminController::class, 'download']);
        Route::delete('/documents/{document}', [DocumentAdminController::class, 'destroy']);

        // Back-office — Phase 8
        Route::get('/statistiques', [RapportAdminController::class, 'statistiques']);
        Route::get('/exports/inscriptions', [RapportAdminController::class, 'exporterInscriptions']);
        Route::get('/exports/candidatures', [RapportAdminController::class, 'exporterCandidatures']);
        Route::get('/exports/offres', [RapportAdminController::class, 'exporterOffres']);
        Route::get('/exports/formations/{formation}/inscrits', [RapportAdminController::class, 'exporterInscritsFormation']);

        // Éditions : l'événement lui-même — dates, lieu, ouverture des inscriptions.
        Route::get('/editions', [EditionAdminController::class, 'index']);
        Route::post('/editions', [EditionAdminController::class, 'store']);
        Route::get('/editions/{edition}', [EditionAdminController::class, 'show']);
        Route::put('/editions/{edition}', [EditionAdminController::class, 'update']);
        Route::delete('/editions/{edition}', [EditionAdminController::class, 'destroy']);
        Route::put('/editions/{edition}/inscriptions', [EditionAdminController::class, 'basculerInscriptions']);
        Route::put('/editions/{edition}/activer', [EditionAdminController::class, 'activer']);

        // Intervenants : les personnes qui animent les formations.
        Route::get('/formateurs', [FormateurAdminController::class, 'index']);
        Route::post('/formateurs', [FormateurAdminController::class, 'store']);
        Route::get('/formateurs/{formateur}', [FormateurAdminController::class, 'show']);
        Route::put('/formateurs/{formateur}', [FormateurAdminController::class, 'update']);
        Route::delete('/formateurs/{formateur}', [FormateurAdminController::class, 'destroy']);

        // L'image d'un contenu éditorial — portrait d'intervenant, logo de
        // partenaire, visuel d'actualité ou de formation. `{type}` est
        // restreint à cette liste côté contrôleur.
        Route::post('/images/{type}/{id}', [ImageAdminController::class, 'store']);
        Route::delete('/images/{type}/{id}', [ImageAdminController::class, 'destroy']);

        Route::get('/utilisateurs', [UtilisateurAdminController::class, 'index']);
        Route::post('/utilisateurs', [UtilisateurAdminController::class, 'store']);
        Route::get('/utilisateurs/{utilisateur}', [UtilisateurAdminController::class, 'show']);
        Route::put('/utilisateurs/{utilisateur}', [UtilisateurAdminController::class, 'update']);
        Route::delete('/utilisateurs/{utilisateur}', [UtilisateurAdminController::class, 'destroy']);

        Route::get('/emploi/offres', [EmploiAdminController::class, 'offres']);
        Route::put('/emploi/offres/{offre}/statut', [EmploiAdminController::class, 'changerStatutOffre']);
        Route::delete('/emploi/offres/{offre}', [EmploiAdminController::class, 'supprimerOffre']);
        Route::get('/emploi/entreprises', [EmploiAdminController::class, 'entreprises']);
        Route::put('/emploi/entreprises/{entreprise}/verification', [EmploiAdminController::class, 'verifierEntreprise']);
        Route::get('/emploi/candidatures', [EmploiAdminController::class, 'candidatures']);
        Route::get('/emploi/entretiens', [EmploiAdminController::class, 'entretiens']);

        Route::get('/notifications', [EnvoiNotificationAdminController::class, 'index']);
        Route::post('/notifications/{envoi}/renvoyer', [EnvoiNotificationAdminController::class, 'renvoyer']);

        Route::get('/parametres', [ParametreAdminController::class, 'show']);
        Route::post('/parametres', [ParametreAdminController::class, 'update']);

        // Contenus : même CRUD, quatre ressources.
        foreach ([
            'actualites' => ActualiteAdminController::class,
            'faq' => FaqAdminController::class,
            'partenaires' => PartenaireAdminController::class,
            'presse' => PresseAdminController::class,
            'programme' => SessionProgrammeAdminController::class,
        ] as $chemin => $controleur) {
            Route::get("/{$chemin}", [$controleur, 'index']);
            Route::post("/{$chemin}", [$controleur, 'store']);
            Route::get("/{$chemin}/{id}", [$controleur, 'show']);
            Route::put("/{$chemin}/{id}", [$controleur, 'update']);
            Route::delete("/{$chemin}/{id}", [$controleur, 'destroy']);
        }

        // Declared before the resource: apiResource would otherwise match
        // "categories" as a {formation} and try to look it up by id.
        Route::get('/formations/categories', [FormationAdminController::class, 'categories']);

        Route::apiResource('/formations', FormationAdminController::class);
        Route::get('/formations/{formation}/inscrits', [FormationAdminController::class, 'inscrits']);
    });

// Identity papers and CVs — staff only, and streamed rather than linked.
Route::middleware(['auth:sanctum', 'role:administrateur,organisateur'])
    ->get('/admin/inscriptions/{inscription}/documents/{document}', [DocumentController::class, 'telecharger'])
    ->name('documents.telecharger');
