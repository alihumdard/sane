<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_id')->constrained('profils_demandeur')->cascadeOnDelete();
            $table->string('poste');
            $table->string('entreprise');
            $table->string('lieu')->nullable();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->boolean('en_poste')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('profil_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
