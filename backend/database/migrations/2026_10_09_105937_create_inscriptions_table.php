<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();          // #INS2026-0001, shown to the participant
            $table->foreignId('edition_id')->constrained('editions')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('type_participation');
            $table->string('statut')->default('en_attente');

            // Étape 1 — informations personnelles
            $table->string('nom');
            $table->date('naissance')->nullable();
            $table->string('email');
            $table->string('telephone');                    // national part only, +227 is implied
            $table->string('genre')->nullable();
            $table->string('nationalite')->nullable();
            $table->string('ville')->nullable();
            $table->string('niveau')->nullable();

            // Étape 2 — profil et parcours
            $table->string('statut_pro')->nullable();       // Étudiant | Salarié | … (distinct from `statut`)
            $table->string('domaine')->nullable();
            $table->string('experience')->nullable();
            $table->text('parcours')->nullable();

            // Étape 3 — centres d'intérêt
            $table->jsonb('interets')->nullable();
            $table->string('source')->nullable();
            $table->boolean('newsletter')->default(false);

            // Étape 4 — confirmation
            $table->boolean('consentement')->default(false);

            // Admin validation
            $table->timestamp('confirmee_le')->nullable();
            $table->foreignId('confirmee_par')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note_admin')->nullable();

            // Seats are released exactly once on cancellation.
            $table->boolean('places_liberees')->default(false);
            $table->timestamp('places_liberees_le')->nullable();

            $table->timestamps();

            // One registration per email per edition; different editions are independent.
            $table->unique(['edition_id', 'email']);
            $table->index(['edition_id', 'statut']);
            $table->index('telephone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
