<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->limit(30)
            ->get();

        return response()->json([
            'data' => $notifications->map(fn (DatabaseNotification $n) => [
                'id' => $n->id,
                'titre' => $n->data['titre'] ?? '',
                'message' => $n->data['message'] ?? '',
                'lien' => $n->data['lien'] ?? null,
                'type' => $n->data['type'] ?? 'info',
                'lue' => $n->read_at !== null,
                'created_at' => $n->created_at,
            ]),
            'non_lues' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    public function marquerLue(Request $request, string $notification): JsonResponse
    {
        $n = $request->user()->notifications()->findOrFail($notification);
        $n->markAsRead();

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    public function marquerToutesLues(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues.']);
    }
}
