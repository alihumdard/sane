<?php

namespace App\Mail;

use App\Models\Inscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Shared shape for every mail addressed to a participant about their
 * registration: addressed to the registration's email, subject carrying the
 * reference, and the registration plus its courses available to the view.
 *
 * Subclasses supply the subject line and the view name.
 */
abstract class InscriptionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Inscription $inscription) {}

    abstract protected function objet(): string;

    abstract protected function vue(): string;

    /** Extra view data a subclass needs beyond the registration itself. */
    protected function donnees(): array
    {
        return [];
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->inscription->email],
            subject: $this->objet().' — '.$this->inscription->reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: $this->vue(),
            with: [
                'inscription' => $this->inscription,
                'formations' => $this->inscription->formations,
                ...$this->donnees(),
            ],
        );
    }
}
