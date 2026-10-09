<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('edition_id')->constrained('editions')->cascadeOnDelete();
            $table->foreignId('categorie_id')->nullable()->constrained('categories_formation')->nullOnDelete();
            $table->foreignId('formateur_id')->nullable()->constrained('formateurs')->nullOnDelete();

            $table->string('titre');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->text('prerequis')->nullable();

            $table->string('duree');                       // "2 jours"
            $table->string('lieu')->default('Niamey');
            $table->string('niveau');                      // Débutant | Intermédiaire | Avancé
            $table->string('format');                      // Présentiel | En ligne | Hybride
            $table->string('image')->nullable();

            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();

            $table->unsignedInteger('max_inscriptions');
            $table->unsignedInteger('inscriptions_count')->default(0);

            $table->boolean('publiee')->default(false);
            $table->timestamps();

            $table->unique(['edition_id', 'slug']);
            $table->index(['edition_id', 'publiee']);
            $table->index('categorie_id');
        });

        // Seats can never be oversold, enforced by the database itself.
        DB::statement('ALTER TABLE formations ADD CONSTRAINT formations_places_non_depassees CHECK (inscriptions_count <= max_inscriptions)');
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
