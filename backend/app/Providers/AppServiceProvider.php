<?php

namespace App\Providers;

use App\Models\Candidature;
use App\Models\OffreEmploi;
use App\Policies\CandidaturePolicy;
use App\Policies\OffrePolicy;
use Carbon\Carbon;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
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

        $this->limiterLesTentatives();
    }

    /**
     * Les limiteurs nommés des formulaires publics.
     *
     * Un `throttle:5,1` ordinaire ne compte que par adresse IP. Deux failles
     * s'ensuivent, et les deux comptent :
     *
     * - **Par le haut** : au Niger, un cybercafé, une université ou un
     *   opérateur mobile font sortir des centaines de personnes par la même
     *   adresse. Une limite stricte par IP les bloque toutes dès que l'une
     *   d'elles s'y reprend à plusieurs fois.
     * - **Par le bas** : qui dispose de plusieurs adresses IP passe à travers
     *   en changeant de source à chaque essai.
     *
     * D'où deux clés par limiteur : l'IP, large, pour le volume ; et la cible
     * visée — l'adresse email — pour l'acharnement. Dépasser l'une des deux
     * suffit à être freiné.
     */
    private function limiterLesTentatives(): void
    {
        RateLimiter::for('connexion', function (Request $request) {
            $email = mb_strtolower((string) $request->input('email'));

            return [
                // Cinq essais par minute sur un même compte, d'où qu'ils
                // viennent : c'est ce qui arrête le bourrage d'identifiants.
                Limit::perMinute(5)->by('connexion:'.$email),
                // Plus large par IP, pour ne pas punir une connexion partagée.
                Limit::perMinute(20)->by('connexion-ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('creation-compte', function (Request $request) {
            return [
                Limit::perHour(5)->by('compte-ip:'.$request->ip()),
                Limit::perHour(2)->by('compte-email:'.mb_strtolower((string) $request->input('email'))),
            ];
        });

        RateLimiter::for('inscription-salon', function (Request $request) {
            return [
                // Une inscription au salon se fait une fois. Trois par heure
                // laisse la place aux reprises après une erreur de saisie,
                // sans ouvrir la porte au remplissage automatique.
                Limit::perHour(3)->by('salon-ip:'.$request->ip()),
                Limit::perHour(2)->by('salon-email:'.mb_strtolower((string) $request->input('email'))),
            ];
        });

        RateLimiter::for('renvoi-email', function (Request $request) {
            return [
                Limit::perHour(3)->by('renvoi-ip:'.$request->ip()),
                // Sans cette seconde clé, le formulaire de renvoi devient un
                // canon à emails pointé sur l'adresse de quelqu'un d'autre.
                Limit::perHour(3)->by('renvoi-email:'.mb_strtolower((string) $request->input('email'))),
            ];
        });
    }
}
