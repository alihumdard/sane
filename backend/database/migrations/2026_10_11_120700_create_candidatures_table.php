<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('offre_id')->constrained('offres_emploi')->cascadeOnDelete();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->string('statut')->default('envoyee');
            $table->text('lettre_motivation')->nullable();
            $table->foreignId('cv_document_id')->nullable()
                ->constrained('documents_candidature')->nullOnDelete();
            $table->text('note_recruteur')->nullable();
            $table->timestamp('statut_modifie_le')->nullable();
            $table->timestamps();

            // One application per offer per candidate.
            $table->unique(['offre_id', 'profil_id']);
            $table->index(['profil_id', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
