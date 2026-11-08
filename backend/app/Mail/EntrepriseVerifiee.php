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
 * Ce qui part quand un administrateur valide une entreprise.
 *
 * Le retrait de la vérification prévenait déjà le recruteur ; la validation,
 * elle, ne disait rien. Le recruteur attendait sans savoir quoi, et c'est le
 * client qui a posé la question. La mauvaise nouvelle arrivait, la bonne non.
 *
 * Envoyée à chaque recruteur de l'entreprise, et non au seul propriétaire :
 * une entreprise peut en compter plusieurs, et ils attendent tous le même feu
 * vert pour publier.
 */
class EntrepriseVerifiee extends Mailable
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
            subject: 'Votre entreprise est validée — vous pouvez publier vos offres',
        );
    }

    public function content(): Content
    {
        $site = rtrim(config('app.frontend_url'), '/');

        return new Content(
            markdown: 'emails.entreprise-verifiee',
            with: [
                'user' => $this->user,
                'entreprise' => $this->entreprise,
                'lienOffres' => "{$site}/dashboard/recruteur/offres",
            ],
        );
    }
}
