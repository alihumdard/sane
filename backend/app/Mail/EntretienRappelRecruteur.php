<?php

namespace App\Mail;

use App\Models\Entretien;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * The recruiter-side twin of EntretienRappel: same interview, addressed to
 * the company instead of the candidate. The contract calls for a reminder to
 * both parties, and until this existed only the candidate ever heard about
 * an interview the day before it happened.
 */
class EntretienRappelRecruteur extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Entretien $entretien) {}

    public function envelope(): Envelope
    {
        $candidature = $this->entretien->candidature;

        return new Envelope(
            to: [$candidature->offre->entreprise->user->email],
            subject: "Rappel d'entretien — ".$this->entretien->reference,
        );
    }

    public function content(): Content
    {
        $candidature = $this->entretien->candidature;

        return new Content(
            markdown: 'emails.entretien-rappel-recruteur',
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
