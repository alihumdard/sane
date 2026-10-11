<?php

use App\Http\Controllers\Api\Admin\DocumentAdminController;
use App\Http\Controllers\Api\Admin\FormationAdminController;
use App\Http\Controllers\Api\Admin\InscriptionAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\Api\DocumentCandidatureController;
use App\Http\Controllers\Api\DocumentController;
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
    Route::post('/offres/{offre}/favori', [CandidatureController::class, 'basculerFavori']);
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
