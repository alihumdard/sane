<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competences', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('competence_profil', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->foreignId('competence_id')->constrained('competences')->cascadeOnDelete();
            $table->string('niveau')->default('intermediaire');
            $table->timestamps();

            $table->unique(['profil_id', 'competence_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competence_profil');
        Schema::dropIfExists('competences');
    }
};
