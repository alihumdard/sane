<?php

use App\Http\Controllers\Api\Admin\DocumentAdminController;
use App\Http\Controllers\Api\Admin\FormationAdminController;
use App\Http\Controllers\Api\Admin\InscriptionAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidatureController;
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
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ProfilController;
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

// Pièces justificatives — l'email d'inscription fait office de preuve d'identité.
Route::get('/inscriptions/{reference}/documents', [DocumentController::class, 'index']);
Route::post('/inscriptions/{reference}/documents', [DocumentController::class, 'store'])
    ->middleware('throttle:20,1');

Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');
Route::post('/auth/inscription', [AuthController::class, 'inscription'])
    ->middleware('throttle:5,1');

// Portail emploi — consultable sans compte.
Route::get('/offres', [OffreController::class, 'index']);
Route::get('/secteurs', [OffreController::class, 'secteurs']);
Route::get('/offres/{slug}', [OffreController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Routes authentifiées
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
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

        Route::apiResource('/formations', FormationAdminController::class);
        Route::get('/formations/{formation}/inscrits', [FormationAdminController::class, 'inscrits']);
    });
