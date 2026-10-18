<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('envoi_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('destinataire_email');
            $table->string('destinataire_nom')->nullable();
            $table->string('sujet');
            $table->string('mail_classe');
            // The serialized Mailable, so a resend can replay the exact same
            // message rather than reconstructing it from whatever the
            // underlying model (inscription, candidature...) looks like now.
            $table->longText('mail_serialise');
            $table->enum('statut', ['envoyee', 'echouee'])->default('envoyee');
            $table->text('erreur')->nullable();
            $table->timestamp('envoye_le')->nullable();
            $table->timestamps();

            $table->index('destinataire_email');
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('envoi_notifications');
    }
};
