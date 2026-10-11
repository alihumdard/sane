<?php

namespace App\Mail;

use App\Models\Entretien;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Shared shape for interview mail: addressed to the candidate, subject
 * carrying the reference, and the interview with its slot, offer and company
 * available to the view.
 *
 * Subclasses supply the subject line and the view name.
 */
abstract class EntretienMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Entretien $entretien) {}

    abstract protected function objet(): string;

    abstract protected function vue(): string;

    protected function destinataire(): string
    {
        return $this->entretien->candidature->profil->user->email;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->destinataire()],
            subject: $this->objet().' — '.$this->entretien->reference,
        );
    }

    public function content(): Content
    {
        $candidature = $this->entretien->candidature;

        return new Content(
            markdown: $this->vue(),
            with: [
                'entretien' => $this->entretien,
                'creneau' => $this->entretien->creneau,
                'offre' => $candidature->offre,
                'entreprise' => $candidature->offre->entreprise,
                'candidat' => $candidature->profil->user,
            ],
        );
    }
}
