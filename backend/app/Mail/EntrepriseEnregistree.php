<?php

namespace App\Mail;

use App\Models\Entreprise;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * L'accusé de réception du profil d'entreprise.
 *
 * Le recruteur remplissait son profil et se retrouvait en attente sans rien
 * d'écrit : ni confirmation que le dossier était bien parti, ni mention de
 * la vérification à venir. L'email de validation existe depuis peu, mais il
 * arrive parfois des jours plus tard — entre les deux, le silence.
 */
class EntrepriseEnregistree extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Entreprise $entreprise,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->user->email],
            subject: 'Profil entreprise enregistré — en attente de vérification',
        );
    }

    public function content(): Content
    {
        $site = rtrim(config('app.frontend_url'), '/');

        return new Content(
            markdown: 'emails.entreprise-enregistree',
            with: [
                'user' => $this->user,
                'entreprise' => $this->entreprise,
                'lienEspace' => "{$site}/dashboard/recruteur",
            ],
        );
    }
}
