<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations_academiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->string('diplome');
            $table->string('etablissement');
            $table->string('domaine')->nullable();
            $table->unsignedSmallInteger('annee_debut')->nullable();
            $table->unsignedSmallInteger('annee_fin')->nullable();
            $table->boolean('en_cours')->default(false);
            $table->timestamps();

            $table->index('profil_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations_academiques');
    }
};
