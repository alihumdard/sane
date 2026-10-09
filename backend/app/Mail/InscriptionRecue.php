<?php

namespace App\Mail;

use App\Models\Inscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InscriptionRecue extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Inscription $inscription) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->inscription->email],
            subject: "Votre inscription au SANEM — {$this->inscription->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.inscription-recue',
            with: [
                'inscription' => $this->inscription,
                'formations' => $this->inscription->formations,
            ],
        );
    }
}
