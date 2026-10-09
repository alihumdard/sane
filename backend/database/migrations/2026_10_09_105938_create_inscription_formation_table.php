<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscription_formation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscription_id')->constrained('inscriptions')->cascadeOnDelete();
            $table->foreignId('formation_id')->constrained('formations')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['inscription_id', 'formation_id']);
            $table->index('formation_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscription_formation');
    }
};
