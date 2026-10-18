<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MotDePasseOublie extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly string $lienReinitialisation,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->user->email],
            subject: 'Réinitialisation de votre mot de passe SANEM',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.mot-de-passe-oublie',
            with: [
                'user' => $this->user,
                'lien' => $this->lienReinitialisation,
            ],
        );
    }
}
