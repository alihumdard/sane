<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * One generic shape for every in-app notification: a title, a short message,
 * and an optional link into the dashboard. Separate Notification subclasses
 * per event would each carry the same three fields — this is the single type
 * the bell menu renders, and `type` just labels where it came from.
 */
class NotificationApp extends Notification
{
    use Queueable;

    public function __construct(
        public readonly string $titre,
        public readonly string $message,
        public readonly ?string $lien = null,
        public readonly string $type = 'info',
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'titre' => $this->titre,
            'message' => $this->message,
            'lien' => $this->lien,
            'type' => $this->type,
        ];
    }
}
