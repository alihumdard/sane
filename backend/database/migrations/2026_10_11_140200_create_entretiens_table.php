<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entretiens', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('candidature_id')->constrained('candidatures')->cascadeOnDelete();
            $table->foreignId('creneau_id')->constrained('creneaux_entretien')->cascadeOnDelete();
            $table->string('statut')->default('en_attente');
            $table->string('lien_visio')->nullable();
            $table->text('note')->nullable();
            $table->text('motif_annulation')->nullable();
            $table->timestamp('confirme_le')->nullable();
            $table->timestamp('rappel_envoye_le')->nullable();
            $table->timestamps();

            // One live interview per application; a cancelled one may be replaced.
            $table->index(['candidature_id', 'statut']);
            $table->index(['statut', 'rappel_envoye_le']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entretiens');
    }
};
