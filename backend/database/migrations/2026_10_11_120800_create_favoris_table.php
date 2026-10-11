<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favoris', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->foreignId('offre_id')->constrained('offres_emploi')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['profil_id', 'offre_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favoris');
    }
};
