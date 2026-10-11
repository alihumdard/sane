<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offres_emploi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->constrained('entreprises')->cascadeOnDelete();
            $table->string('titre');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('missions')->nullable();
            $table->text('profil_recherche')->nullable();
            $table->string('type_contrat');
            $table->string('secteur');
            $table->string('ville');
            $table->unsignedInteger('salaire_min')->nullable();
            $table->unsignedInteger('salaire_max')->nullable();
            $table->string('experience_requise')->nullable();
            $table->string('niveau_etude')->nullable();
            $table->date('date_limite')->nullable();
            $table->string('statut')->default('brouillon');
            $table->unsignedInteger('vues')->default(0);
            $table->unsignedInteger('candidatures_count')->default(0);
            $table->timestamp('publiee_le')->nullable();
            $table->timestamps();

            // Drives the public search: statut + secteur/ville/contrat filters.
            $table->index(['statut', 'date_limite']);
            $table->index(['secteur', 'ville', 'type_contrat']);
            $table->index('entreprise_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offres_emploi');
    }
};
