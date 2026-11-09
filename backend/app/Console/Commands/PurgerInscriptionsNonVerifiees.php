<?php

namespace App\Console\Commands;

use App\Enums\StatutInscription;
use App\Models\Inscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Supprime les demandes d'inscription que personne n'a jamais confirmées.
 *
 * Sans ce ménage, deux choses se dégradent :
 *
 * - **Les chiffres.** Le tableau de bord, la page d'accueil et les rapports
 *   comptent les inscriptions. Une table pleine de demandes fantômes annonce
 *   au client un salon plus couru qu'il ne l'est, et il n'a aucun moyen de
 *   s'en apercevoir.
 * - **Les places occupées par personne.** La contrainte unique(edition, email)
 *   réserve une adresse à sa première demande. Une adresse utilisée pour un
 *   faux envoi empêcherait son propriétaire réel de s'inscrire — le
 *   détournement le plus simple à monter contre ce formulaire.
 *
 * Ne touche jamais une demande confirmée, ni une demande qu'un administrateur
 * a validée à la main : seules disparaissent les lignes restées sans réponse
 * au-delà du délai.
 */
class PurgerInscriptionsNonVerifiees extends Command
{
    protected $signature = 'sanem:purger-inscriptions-non-verifiees
                            {--jours= : Ancienneté minimale (défaut : config antiabus)}
                            {--a-blanc : Compte sans supprimer}';

    protected $description = 'Supprime les inscriptions jamais confirmées par email';

    public function handle(): int
    {
        $jours = (int) ($this->option('jours') ?: config('antiabus.verification.purge_jours', 7));
        $limite = now()->subDays($jours);

        $requete = Inscription::nonVerifiees()
            ->where('statut', StatutInscription::EnAttente)
            // Une validation manuelle vaut confirmation : l'organisateur a vu
            // la personne, l'email n'a plus rien à prouver.
            ->whereNull('confirmee_le')
            ->where('created_at', '<', $limite);

        $total = (clone $requete)->count();

        if ($total === 0) {
            $this->info('Aucune inscription à purger.');

            return self::SUCCESS;
        }

        if ($this->option('a-blanc')) {
            $this->warn("{$total} inscription(s) seraient supprimées (antérieures au {$limite->toDateString()}).");

            return self::SUCCESS;
        }

        /*
         * Les places ne sont pas rendues : elles n'ont jamais été prises.
         * C'est tout l'intérêt de ne réserver qu'à la confirmation — une
         * demande fantôme n'a rien retiré à personne, il n'y a rien à
         * restituer.
         */
        $supprimees = $requete->delete();

        $this->info("{$supprimees} inscription(s) non confirmée(s) supprimée(s).");

        Log::info('Purge des inscriptions non vérifiées', [
            'supprimees' => $supprimees,
            'anterieures_au' => $limite->toDateTimeString(),
        ]);

        return self::SUCCESS;
    }
}
