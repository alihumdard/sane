<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * One row per email the app has ever tried to send — the admin's "Historique
 * d'envoi" and the data a manual resend replays. `mail_serialise` holds the
 * PHP-serialized Mailable itself, so a resend reproduces exactly what was
 * sent rather than re-deriving it from the current state of whatever model
 * (inscription, candidature, entretien...) originally triggered it.
 */
class EnvoiNotification extends Model
{
    protected $fillable = [
        'destinataire_email',
        'destinataire_nom',
        'sujet',
        'mail_classe',
        'mail_serialise',
        'statut',
        'erreur',
        'envoye_le',
    ];

    protected function casts(): array
    {
        return [
            'envoye_le' => 'datetime',
        ];
    }
}
