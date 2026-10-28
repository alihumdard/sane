<?php

namespace Tests\Feature;

use App\Mail\MessageContact;
use App\Models\ParametrePlateforme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * The contact form had no endpoint at all: the page set its own success
 * state and cleared itself, so every message was answered with "Message
 * envoyé" and thrown away.
 */
class ContactTest extends TestCase
{
    use RefreshDatabase;

    private function message(array $surcharges = []): array
    {
        return [
            'nom' => 'Amina Souley',
            'email' => 'amina@example.ne',
            'telephone' => '+227 90 00 00 00',
            'sujet' => 'Demande d\'information',
            'message' => 'Bonjour, je souhaite participer au salon.',
            ...$surcharges,
        ];
    }

    public function test_un_message_de_contact_part_vers_les_organisateurs(): void
    {
        Mail::fake();

        ParametrePlateforme::instance()->update(['email' => 'organisation@sanem.ne']);

        $this->postJson('/api/contact', $this->message())
            ->assertCreated()
            ->assertJsonPath('message', 'Message envoyé. Notre équipe vous répondra dans les plus brefs délais.');

        Mail::assertSent(MessageContact::class, function (MessageContact $mail) {
            return $mail->hasTo('organisation@sanem.ne')
                && $mail->nom === 'Amina Souley'
                // Replying reaches the person who wrote, not the site.
                && $mail->hasReplyTo('amina@example.ne');
        });
    }

    public function test_le_sujet_est_exige(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', $this->message(['sujet' => '']))
            ->assertStatus(422)
            ->assertJsonPath('errors.sujet.0', 'Merci de choisir un sujet.');

        Mail::assertNothingSent();
    }

    public function test_un_message_trop_court_est_refuse(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', $this->message(['message' => 'Bonjour']))
            ->assertStatus(422)
            ->assertJsonPath('errors.message.0', 'Votre message est trop court pour être compris.');
    }

    /** A mail server that is down must not lose the visitor their message. */
    public function test_une_panne_demail_nempeche_pas_la_reponse(): void
    {
        Mail::shouldReceive('send')->andThrow(new \RuntimeException('SMTP injoignable'));

        $this->postJson('/api/contact', $this->message())->assertCreated();
    }
}
