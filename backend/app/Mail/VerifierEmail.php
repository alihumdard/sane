<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

/**
 * La demande de confirmation d'adresse, envoyée à la création d'un compte.
 *
 * Le lien est signé par Laravel : l'identifiant et l'empreinte de l'adresse
 * voyagent en clair, mais une signature calculée avec APP_KEY les accompagne,
 * et le moindre caractère modifié l'invalide. Personne ne peut donc confirmer
 * le compte d'un autre en changeant un chiffre dans l'URL.
 *
 * L'empreinte porte sur l'adresse **du moment où le lien est émis**. Si
 * l'adresse change ensuite, le lien cesse de valoir : c'est ce qui empêche une
 * ancienne demande de confirmer une nouvelle adresse.
 *
 * Le lien pointe vers le site, pas vers l'API. Cliquer un lien de courrier et
 * tomber sur une réponse JSON donne l'impression d'un site cassé ; la page
 * frontend relaie l'appel et affiche un vrai écran.
 */
class VerifierEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->user->email],
            subject: 'Confirmez votre adresse email — SANEM',
        );
    }

    public function content(): Content
    {
        $heures = (int) config('antiabus.verification.heures', 48);

        return new Content(
            markdown: 'emails.verifier-email',
            with: [
                'user' => $this->user,
                'lien' => self::lienPour($this->user, $heures),
                'heures' => $heures,
            ],
        );
    }

    /**
     * Partagé avec le renvoi de confirmation, qui doit produire exactement le
     * même lien — un second chemin de construction finirait par diverger.
     */
    public static function lienPour(User $user, ?int $heures = null): string
    {
        $heures ??= (int) config('antiabus.verification.heures', 48);

        $signee = URL::temporarySignedRoute(
            'verification.verify',
            now()->addHours($heures),
            [
                'id' => $user->getKey(),
                'hash' => sha1($user->getEmailForVerification()),
            ],
        );

        $site = rtrim((string) config('app.frontend_url'), '/');

        /*
         * La page du site reçoit l'identifiant, l'empreinte et la signature,
         * et rejoue l'appel d'API avec. Elle ne reconstruit rien : la
         * signature couvre l'URL d'API telle que Laravel l'a produite, et le
         * moindre paramètre réordonné ou réencodé l'invaliderait.
         *
         * Le détour par le site évite qu'un clic dans un courrier tombe sur
         * une réponse JSON nue.
         */
        $chemin = (string) parse_url($signee, PHP_URL_PATH);
        $requete = (string) parse_url($signee, PHP_URL_QUERY);

        /*
         * Le client du site préfixe lui-même « /api » : on lui passe le chemin
         * sans ce préfixe, chaîne de requête comprise.
         *
         * Str::after et non str_replace : la signature couvre l'URL entière,
         * et toucher à autre chose que le premier segment l'invaliderait. Ceci
         * suppose qu'APP_URL ne se termine pas elle-même par « /api » — elle
         * le faisait en production, le chemin sortait en « /api/api/auth/… »,
         * et le lien menait à une page introuvable.
         */
        $relatif = Str::after($chemin, '/api').'?'.$requete;

        return $site.'/verifier-email?cible='.urlencode($relatif);
    }
}
