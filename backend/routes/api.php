<?php

use App\Http\Controllers\Api\Admin\FormationAdminController;
use App\Http\Controllers\Api\Admin\InscriptionAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\InscriptionController;
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

Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

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

        Route::apiResource('/formations', FormationAdminController::class);
        Route::get('/formations/{formation}/inscrits', [FormationAdminController::class, 'inscrits']);
    });
