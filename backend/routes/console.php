<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Tâches planifiées
|--------------------------------------------------------------------------
| En production : * * * * * php artisan schedule:run  (cron, chaque minute)
*/

// Hourly, not daily: an interview confirmed late still gets its reminder.
// The command is idempotent, so overlapping runs cannot double-send.
Schedule::command('sanem:rappels-entretiens')
    ->hourly()
    ->withoutOverlapping();

// A course date is a day, not a time, so once each morning is enough.
Schedule::command('sanem:rappels-formations')
    ->dailyAt('08:00')
    ->withoutOverlapping();

/*
 * The nightly copy of what cannot be rebuilt: the database and the files
 * organisers uploaded. At 02:30, when nobody is registering, and never
 * overlapping — a dump that is still running must not be joined by a second.
 */
Schedule::command('sanem:sauvegarder --jours='.config('sauvegarde.jours'))
    ->dailyAt('02:30')
    ->withoutOverlapping()
    ->runInBackground();
