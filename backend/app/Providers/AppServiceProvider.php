<?php

namespace App\Providers;

use App\Models\Candidature;
use App\Models\OffreEmploi;
use App\Policies\CandidaturePolicy;
use App\Policies\OffrePolicy;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
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

        // Registered by hand: auto-discovery maps OffreEmploi to
        // OffreEmploiPolicy, which is not what these are called.
        Gate::policy(OffreEmploi::class, OffrePolicy::class);
        Gate::policy(Candidature::class, CandidaturePolicy::class);
    }
}
