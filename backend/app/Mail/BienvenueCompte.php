<?php

namespace App\Mail;

use App\Enums\RoleUtilisateur;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Ce qui part à la création d'un compte.
 *
 * Rien ne partait : un visiteur créait son compte, se retrouvait connecté, et
 * n'avait aucune trace écrite de son inscription. Le client nous l'a remonté
 * comme un email en retard, alors qu'aucun n'avait jamais été envoyé.
 *
 * Elle dit aussi ce que le compte ne fait pas : créer un compte sur le portail
 * emploi n'inscrit pas au salon. Les deux sont distincts, et la personne qui
 * s'arrête là croit souvent avoir fait les deux.
 */
class BienvenueCompte extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->user->email],
            subject: 'Bienvenue sur la plateforme du SANEM',
        );
    }

    public function content(): Content
    {
        $site = rtrim(config('app.frontend_url'), '/');
        $recruteur = $this->user->role === RoleUtilisateur::Recruteur
            || $this->user->role === RoleUtilisateur::Entreprise;

        return new Content(
            markdown: 'emails.bienvenue-compte',
            with: [
                'user' => $this->user,
                'recruteur' => $recruteur,
                // Chacun vers son espace : le recruteur doit renseigner son
                // entreprise avant de pouvoir publier, le demandeur compléter
                // son profil avant de pouvoir postuler.
                'lienEspace' => $recruteur ? "{$site}/dashboard/recruteur" : "{$site}/dashboard/profil",
                'lienInscription' => "{$site}/inscription",
            ],
        );
    }
}
