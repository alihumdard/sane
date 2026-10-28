<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * What someone wrote on the contact page, sent to the organisers.
 *
 * The form used to answer "Message envoyé" and keep the message to itself:
 * there was no endpoint behind it at all, and nothing ever arrived.
 */
class MessageContact extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $destinataire,
        public readonly string $nom,
        public readonly string $email,
        public readonly ?string $telephone,
        public readonly string $sujet,
        public readonly string $message,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->destinataire],
            subject: 'Contact — '.$this->sujet,
            // Replying goes to the person who wrote, not to the site's own
            // address; the From stays ours so the mail is not refused.
            replyTo: [new Address($this->email, $this->nom)],
        );
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.message-contact');
    }
}
