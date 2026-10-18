<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Models\EnvoiNotification;
use App\Services\Notificateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;

/** Send history for every transactional email, and a manual resend. */
class EnvoiNotificationAdminController extends Controller
{
    use FiltreLesListes;

    public function index(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            EnvoiNotification::query()->latest('created_at'),
            $request,
            recherchables: ['destinataire_email', 'destinataire_nom', 'sujet'],
            filtrables: ['statut'],
            triables: ['created_at', 'statut'],
        );

        return response()->json([
            // mail_serialise is replay data for `renvoyer`, not something the
            // admin table needs to render or transmit on every page load.
            'data' => collect($page->items())->map->makeHidden('mail_serialise'),
            'meta' => $this->meta($page),
            'resume' => [
                'total' => EnvoiNotification::count(),
                'envoyees' => EnvoiNotification::where('statut', 'envoyee')->count(),
                'echouees' => EnvoiNotification::where('statut', 'echouee')->count(),
            ],
        ]);
    }

    /** Replays the exact Mailable that was sent the first time. */
    public function renvoyer(EnvoiNotification $envoi, Notificateur $notificateur): JsonResponse
    {
        try {
            $mail = unserialize(base64_decode($envoi->mail_serialise));
        } catch (\Throwable $e) {
            Log::error('Désérialisation du mail échouée', ['envoi_id' => $envoi->id, 'erreur' => $e->getMessage()]);

            return response()->json(['message' => "Ce message n'a pas pu être reconstruit pour un renvoi."], 422);
        }

        if (! $mail instanceof Mailable) {
            return response()->json(['message' => "Ce message n'a pas pu être reconstruit pour un renvoi."], 422);
        }

        $ok = $notificateur->envoyer($mail, ['renvoi_de' => $envoi->id]);

        if (! $ok) {
            return response()->json(['message' => "L'envoi a échoué. Réessayez plus tard."], 502);
        }

        return response()->json(['message' => 'Message renvoyé avec succès.']);
    }
}
