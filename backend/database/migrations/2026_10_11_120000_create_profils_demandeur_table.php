<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profils_demandeur', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('titre_pro')->nullable();
            $table->text('resume')->nullable();
            $table->string('secteur')->nullable();
            $table->string('ville')->nullable();
            $table->string('type_emploi')->nullable();
            $table->string('disponibilite')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('portfolio')->nullable();
            // Recruiter candidate search only ever returns profiles opted in here.
            $table->boolean('visible')->default(false);
            $table->timestamps();

            $table->index(['secteur', 'ville']);
            $table->index('visible');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profils_demandeur');
    }
};
