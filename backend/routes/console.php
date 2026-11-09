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

/*
 * L'ouverture des inscriptions, au matin du jour fixé par le client.
 *
 * 07:00 UTC, soit 08:00 à Niamey. Planifiée plutôt que cochée à la main :
 * la date est à deux jours, et elle ne doit pas dépendre de qui y pense ce
 * matin-là. La commande ne fait qu'ouvrir — relancée ensuite, elle constate
 * et se tait, et elle ne refermera jamais ce que les organisateurs ont
 * ouvert ou fermé depuis le back-office.
 */
Schedule::command('sanem:ouvrir-les-inscriptions')
    ->dailyAt('07:00')
    ->when(fn () => now()->toDateString() >= '2026-11-11');

// A course date is a day, not a time, so once each morning is enough.
Schedule::command('sanem:rappels-formations')
    ->dailyAt('08:00')
    ->withoutOverlapping();

/*
 * Le ménage des demandes d'inscription jamais confirmées.
 *
 * À 03:15, après la sauvegarde de 02:30 : ce qui est purgé a donc toujours
 * une copie de la nuit, au cas où un réglage trop strict emporterait des
 * lignes qu'il ne fallait pas.
 */
Schedule::command('sanem:purger-inscriptions-non-verifiees')
    ->dailyAt('03:15')
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
