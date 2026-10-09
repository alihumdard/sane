<?php

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
