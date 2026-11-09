<?php

namespace App\Mail;

use App\Enums\StatutCandidature;
use App\Models\Candidature;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Le candidat apprend par email que sa candidature a bougé.
 *
 * Seule une notification dans la plateforme partait, qu'il fallait aller
 * chercher : un candidat retenu pour un entretien ne l'apprenait qu'en se
 * reconnectant. À trois semaines du salon, cela se compte en entretiens
 * manqués.
 */
class CandidatureStatut extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Candidature $candidature,
        public readonly StatutCandidature $statut,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->user->email],
            subject: 'Votre candidature : '.$this->statut->label().' — '.$this->candidature->reference,
        );
    }

    public function content(): Content
    {
        $site = rtrim(config('app.frontend_url'), '/');

        return new Content(
            markdown: 'emails.candidature-statut',
            with: [
                'user' => $this->user,
                'candidature' => $this->candidature,
                'offre' => $this->candidature->offre,
                'statut' => $this->statut,
                // Un entretien se joue sur un créneau à choisir : on envoie
                // là où ce choix se fait, pas sur la liste.
                'lienSuivi' => $this->statut === StatutCandidature::Entretien
                    ? "{$site}/dashboard/entretiens"
                    : "{$site}/dashboard/participant",
                'message' => $this->messageSelonStatut(),
            ],
        );
    }

    /** Ce que le statut veut dire, en clair, pour celui qui le reçoit. */
    private function messageSelonStatut(): string
    {
        return match ($this->statut) {
            StatutCandidature::EnRevue => "Le recruteur a ouvert votre dossier et l'examine.",
            StatutCandidature::Preselectionnee => 'Vous faites partie des profils retenus pour la suite.',
            StatutCandidature::Entretien => 'Le recruteur souhaite vous rencontrer. Un créneau d\'entretien vous attend dans votre espace.',
            StatutCandidature::Acceptee => 'Votre candidature a été acceptée. Le recruteur vous contactera directement.',
            StatutCandidature::Refusee => "Le recruteur n'a pas retenu votre candidature cette fois-ci. D'autres offres sont publiées régulièrement.",
            StatutCandidature::Envoyee => 'Votre candidature est en attente de traitement.',
        };
    }
}
