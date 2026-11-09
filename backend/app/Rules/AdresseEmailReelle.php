<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Refuse les adresses qui ne mèneront nulle part.
 *
 * Deux contrôles, dans cet ordre de coût croissant :
 *
 * 1. le domaine est-il un service d'adresses jetables ? — comparaison avec une
 *    liste embarquée, immédiate ;
 * 2. le domaine accepte-t-il du courrier ? — une résolution DNS, qui écarte
 *    les fautes de frappe et les domaines inventés avant qu'un email ne parte.
 *
 * Le second contrôle fait un appel réseau. S'il échoue — DNS injoignable,
 * délai dépassé — l'adresse est **acceptée**. Une panne de résolution de notre
 * côté ne doit pas fermer les inscriptions : refuser un visiteur réel pour une
 * cause qui ne le concerne pas coûte plus cher que laisser passer une adresse
 * douteuse, que la vérification par email arrêtera de toute façon.
 */
class AdresseEmailReelle implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! str_contains($value, '@')) {
            return; // La règle `email` s'en charge, inutile de doubler le message.
        }

        $domaine = Str::lower(Str::afterLast($value, '@'));

        if (in_array($domaine, config('antiabus.domaines_jetables', []), true)) {
            Log::info('Adresse jetable refusée', ['domaine' => $domaine]);

            $fail('Les adresses email temporaires ne sont pas acceptées. Utilisez votre adresse habituelle.');

            return;
        }

        if (! $this->domaineAccepteDuCourrier($domaine)) {
            $fail("Le domaine « {$domaine} » ne reçoit pas d'email. Vérifiez l'orthographe de votre adresse.");
        }
    }

    /**
     * Un enregistrement MX, ou à défaut un A : certains petits domaines n'ont
     * pas de MX et reçoivent leur courrier sur l'hôte lui-même, ce que la RFC
     * 5321 autorise. Ne regarder que les MX les écarterait à tort.
     */
    private function domaineAccepteDuCourrier(string $domaine): bool
    {
        try {
            return checkdnsrr($domaine, 'MX') || checkdnsrr($domaine, 'A');
        } catch (\Throwable $e) {
            Log::warning('Résolution DNS impossible, adresse acceptée par défaut', [
                'domaine' => $domaine,
                'erreur' => $e->getMessage(),
            ]);

            return true;
        }
    }
}
