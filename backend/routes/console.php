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
