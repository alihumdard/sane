<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents_inscription', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscription_id')->constrained('inscriptions')->cascadeOnDelete();
            $table->string('type');                        // piece_identite | cv | lettre_motivation | photo
            $table->string('nom_original');
            $table->string('chemin');
            $table->string('mime');
            $table->unsignedInteger('taille');             // bytes
            $table->timestamps();

            $table->unique(['inscription_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents_inscription');
    }
};
