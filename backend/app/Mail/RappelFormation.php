<?php

namespace App\Mail;

use App\Models\Formation;
use App\Models\Inscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Three-day reminder for one course.
 *
 * Deliberately not an InscriptionMail subclass: those cover the registration
 * as a whole, while this is about a single course — a participant taking three
 * courses on different dates gets three separate reminders, each naming its
 * own date, place and trainer.
 */
class RappelFormation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Inscription $inscription,
        public readonly Formation $formation,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->inscription->email],
            subject: 'Rappel : '.$this->formation->titre.' — '.$this->inscription->reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.rappel-formation',
            with: [
                'inscription' => $this->inscription,
                'formation' => $this->formation,
                'formateur' => $this->formation->formateur,
            ],
        );
    }
}
