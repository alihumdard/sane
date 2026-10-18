<?php

namespace App\Services;

use App\Models\EnvoiNotification;
use App\Models\User;
use App\Notifications\NotificationApp;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Sends transactional mail without letting a mail failure fail the action that
 * triggered it. By the time we notify, the registration (or application, or
 * interview) is already committed; surfacing an SMTP outage as a failed request
 * would tell the user their action did not happen when it did, and their retry
 * would then collide with the record they just created.
 *
 * Failures are logged with enough context to resend by hand.
 */
class Notificateur
{
    public function envoyer(Mailable $mail, array $contexte = []): bool
    {
        [$email, $nom] = $this->destinataire($mail);
        $sujet = $this->sujet($mail);

        try {
            Mail::send($mail);

            $this->journaliser($mail, $email, $nom, $sujet, 'envoyee');

            return true;
        } catch (Throwable $e) {
            Log::error('Envoi d\'email échoué', [
                'mail' => $mail::class,
                'erreur' => $e->getMessage(),
                ...$contexte,
            ]);

            $this->journaliser($mail, $email, $nom, $sujet, 'echouee', $e->getMessage());

            return false;
        }
    }

    /**
     * One row per attempt — the admin's send history, and what a manual
     * resend replays. Logging failure must never mask the original mail
     * outcome, so this is itself wrapped rather than left to bubble up.
     */
    private function journaliser(
        Mailable $mail,
        ?string $email,
        ?string $nom,
        ?string $sujet,
        string $statut,
        ?string $erreur = null,
    ): void {
        if (! $email) {
            return;
        }

        try {
            EnvoiNotification::create([
                'destinataire_email' => $email,
                'destinataire_nom' => $nom,
                'sujet' => $sujet ?? $mail::class,
                'mail_classe' => $mail::class,
                // base64-wrapped: PHP's serialized form can contain bytes
                // that aren't valid UTF-8, which a text column would mangle
                // or truncate silently.
                'mail_serialise' => base64_encode(serialize($mail)),
                'statut' => $statut,
                'erreur' => $erreur,
                'envoye_le' => $statut === 'envoyee' ? now() : null,
            ]);
        } catch (Throwable $e) {
            Log::error('Journalisation de l\'envoi échouée', ['erreur' => $e->getMessage()]);
        }
    }

    /** @return array{0: ?string, 1: ?string} [email, nom] */
    private function destinataire(Mailable $mail): array
    {
        try {
            // Mailable::envelope() is the single source of truth for "to" on
            // every Mailable in this app — reading it here avoids each class
            // needing to expose its recipient a second way just for logging.
            $to = $mail->envelope()->to;

            if (empty($to)) {
                return [null, null];
            }

            // Envelope accepts both forms and keeps whichever it was given:
            // `to: [$user]` becomes an Address, `to: [$email]` stays a string.
            // Reading ->address on the latter threw, and every registration
            // confirmation was logged with no recipient at all.
            $premier = $to[0];

            return is_string($premier)
                ? [$premier, null]
                : [$premier->address, $premier->name ?: null];
        } catch (Throwable) {
            return [null, null];
        }
    }

    private function sujet(Mailable $mail): ?string
    {
        try {
            return $mail->envelope()->subject;
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Records an in-app notification for the bell menu. Same resilience as
     * the mail side: a failure here must not fail the action that triggered
     * it, since the underlying record (candidature, entretien...) is already
     * committed by the time this runs.
     */
    public function notifier(User $user, string $titre, string $message, ?string $lien = null, string $type = 'info'): bool
    {
        try {
            $user->notify(new NotificationApp($titre, $message, $lien, $type));

            return true;
        } catch (Throwable $e) {
            Log::error('Notification in-app échouée', [
                'user_id' => $user->id,
                'erreur' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
