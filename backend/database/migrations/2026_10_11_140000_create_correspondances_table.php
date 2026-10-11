<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Scores are stored rather than computed per request: the recruiter
        // dashboard sorts and pages over them, which a derived value cannot do
        // without scanning every profile on every page load.
        Schema::create('correspondances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_id')->constrained('offres_emploi')->cascadeOnDelete();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->unsignedSmallInteger('score');
            $table->jsonb('details');
            $table->string('statut')->default('suggere');
            $table->timestamps();

            $table->unique(['offre_id', 'profil_id']);
            $table->index(['offre_id', 'score']);
            $table->index(['profil_id', 'score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('correspondances');
    }
};
