<?php

namespace App\Mail;

use App\Models\Candidature;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * La trace écrite d'une candidature, pour celui qui l'envoie.
 *
 * Il n'y en avait aucune : le recruteur recevait une notification, le
 * candidat rien du tout. Le client l'a constaté en postulant lui-même — il
 * avait déposé son CV, postulé à une offre, et n'avait reçu aucun email.
 *
 * Sa demande est explicite : « Tout le monde doit recevoir un email de
 * confirmation de son inscription », quel que soit le rôle.
 */
class CandidatureRecue extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Candidature $candidature,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->user->email],
            subject: 'Votre candidature a bien été envoyée — '.$this->candidature->reference,
        );
    }

    public function content(): Content
    {
        $site = rtrim(config('app.frontend_url'), '/');

        return new Content(
            markdown: 'emails.candidature-recue',
            with: [
                'user' => $this->user,
                'candidature' => $this->candidature,
                'offre' => $this->candidature->offre,
                'lienSuivi' => "{$site}/dashboard/participant",
            ],
        );
    }
}
