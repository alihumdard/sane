<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\MessageContact;
use App\Models\ParametrePlateforme;
use App\Services\Notificateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The contact form.
 *
 * There was none: the form set its own success state and cleared itself, so
 * every message written on the public page was answered with "Message envoyé"
 * and thrown away. Nobody could tell, because nothing failed.
 */
class ContactController extends Controller
{
    public function store(Request $request, Notificateur $notificateur): JsonResponse
    {
        $valide = $request->validate([
            'nom' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'sujet' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ], [
            'nom.required' => "Merci d'indiquer votre nom.",
            'email.required' => "Merci d'indiquer votre email.",
            'email.email' => 'Cet email ne semble pas valide.',
            'sujet.required' => 'Merci de choisir un sujet.',
            'message.required' => "Merci d'écrire votre message.",
            'message.min' => 'Votre message est trop court pour être compris.',
        ]);

        // Wherever the organisers said to write to, not an address compiled
        // into the code.
        $destinataire = ParametrePlateforme::instance()->email ?: config('mail.from.address');

        /*
         * Through the notifier: a mail server that is down must not answer the
         * visitor with a failure for a message we could still deliver by hand
         * — the attempt is logged either way, with the sender's address.
         */
        $notificateur->envoyer(
            new MessageContact(
                destinataire: $destinataire,
                nom: $valide['nom'],
                email: $valide['email'],
                telephone: $valide['telephone'] ?? null,
                sujet: $valide['sujet'],
                message: $valide['message'],
            ),
            ['formulaire' => 'contact', 'de' => $valide['email']],
        );

        return response()->json([
            'message' => 'Message envoyé. Notre équipe vous répondra dans les plus brefs délais.',
        ], 201);
    }
}
