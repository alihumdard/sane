<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
| This app serves an API; it has no login page. But Laravel's authentication
| handler redirects unauthenticated non-JSON requests to a route named "login",
| and throws if none exists — turning a plain 401 into a 500 for any request
| that does not set Accept: application/json, such as a browser file download.
|
| Answering here keeps that path honest: the caller gets 401, not a crash.
*/
Route::get('/login', fn () => response()->json([
    'message' => 'Authentification requise.',
], 401))->name('login');
