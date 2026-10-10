<?php

namespace App\Services;

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
        try {
            Mail::send($mail);

            return true;
        } catch (Throwable $e) {
            Log::error('Envoi d\'email échoué', [
                'mail' => $mail::class,
                'erreur' => $e->getMessage(),
                ...$contexte,
            ]);

            return false;
        }
    }
}
