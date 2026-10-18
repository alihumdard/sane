<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Single-row table: the platform has exactly one set of organisation
     * settings, so there is no list to CRUD — just one record the admin
     * reads and updates.
     */
    public function up(): void
    {
        Schema::create('parametre_plateformes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email');
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->string('site_web')->nullable();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parametre_plateformes');
    }
};
