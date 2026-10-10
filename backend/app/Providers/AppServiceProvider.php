<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Dates written out in emails ("12 mars 2026") follow the app locale.
        Carbon::setLocale(config('app.locale'));
    }
}
