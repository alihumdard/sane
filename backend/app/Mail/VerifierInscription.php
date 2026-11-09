<?php

namespace App\Mail;

use App\Models\Inscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * La demande de confirmation d'une inscription au salon.
 *
 * Le jeton en clair ne vit que le temps de cet envoi : la base n'en garde que
 * l'empreinte. Il voyage donc jusqu'ici en paramètre, et nulle part ailleurs.
 *
 * Cet email dit ce que l'inscription ne garantit pas encore. Les places de
 * formation ne sont décomptées qu'à la confirmation — c'est ce qui empêche une
 * adresse inventée de retirer sa place à quelqu'un de réel — et la personne
 * doit le savoir avant de refermer sa boîte mail en se croyant inscrite.
 */
class VerifierInscription extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Inscription $inscription,
        public readonly string $jetonClair,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->inscription->email],
            subject: 'Confirmez votre inscription au SANEM',
        );
    }

    public function content(): Content
    {
        $site = rtrim((string) config('app.frontend_url'), '/');
        $heures = (int) config('antiabus.verification.heures', 48);

        return new Content(
            markdown: 'emails.verifier-inscription',
            with: [
                'inscription' => $this->inscription,
                'lien' => "{$site}/verifier-inscription?jeton=".urlencode($this->jetonClair),
                'heures' => $heures,
                'aDesFormations' => filled($this->inscription->formations_demandees),
            ],
        );
    }
}
