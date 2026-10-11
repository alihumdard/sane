<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creneaux_entretien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->constrained('entreprises')->cascadeOnDelete();
            $table->timestamp('debut');
            $table->timestamp('fin');
            $table->string('mode')->default('presentiel');
            $table->string('lieu')->nullable();
            $table->boolean('reserve')->default(false);
            $table->timestamps();

            $table->index(['entreprise_id', 'debut']);
            $table->index(['reserve', 'debut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creneaux_entretien');
    }
};
