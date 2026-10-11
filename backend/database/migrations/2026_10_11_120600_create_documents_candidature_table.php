<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // CVs and cover letters attached to a jobseeker profile. Kept apart from
        // documents_inscription: those belong to an event registration and are
        // purged with it, while a CV outlives any single application.
        Schema::create('documents_candidature', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->string('type');
            $table->string('nom_original');
            $table->string('chemin');
            $table->string('mime');
            $table->unsignedInteger('taille');
            $table->boolean('principal')->default(false);
            $table->timestamps();

            $table->index(['profil_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents_candidature');
    }
};
