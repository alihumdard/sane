<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nom');
            $table->string('slug')->unique();
            $table->string('secteur')->nullable();
            $table->string('taille')->nullable();
            $table->string('logo')->nullable();
            $table->string('site_web')->nullable();
            $table->text('description')->nullable();
            $table->string('ville')->nullable();
            $table->string('telephone')->nullable();
            // Set by an organiser; unverified companies may draft but not publish.
            $table->boolean('verifiee')->default(false);
            $table->timestamps();

            $table->index('secteur');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entreprises');
    }
};
