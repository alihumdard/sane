<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The event's schedule, as rows rather than as source.
 *
 * The programme page listed eight sessions written into a TypeScript file:
 * every change of hour, room or speaker was a deployment, and the organisers
 * are the ones who know when the opening ceremony moved. They already edit
 * the news, the FAQ and the partners the same way.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sessions_programme', function (Blueprint $table) {
            $table->id();
            $table->date('jour');
            $table->time('heure_debut');
            $table->time('heure_fin')->nullable();
            $table->string('titre', 200);
            $table->text('description')->nullable();
            // Free text, not an enum: a salon invents a kind of session the
            // week before, and that must not need a migration.
            $table->string('categorie', 50)->nullable();
            $table->string('lieu', 150)->nullable();
            $table->string('intervenants', 300)->nullable();
            $table->string('image')->nullable();
            $table->unsignedSmallInteger('ordre')->default(0);
            $table->boolean('publiee')->default(true);
            $table->timestamps();

            // The public page reads one day at a time, in order.
            $table->index(['publiee', 'jour', 'heure_debut', 'ordre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions_programme');
    }
};
