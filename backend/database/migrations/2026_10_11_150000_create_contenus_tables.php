<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Editorial content the public site currently hardcodes in data.ts files.
     * Moving it into the database is what lets organisers edit the site
     * without a deploy, which is the point of the Phase 8 content section.
     */
    public function up(): void
    {
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('slug')->unique();
            $table->string('categorie');
            $table->text('extrait')->nullable();
            $table->longText('contenu');
            $table->string('image')->nullable();
            $table->string('auteur')->nullable();
            $table->boolean('publiee')->default(false);
            $table->timestamp('publiee_le')->nullable();
            $table->unsignedInteger('vues')->default(0);
            $table->timestamps();

            $table->index(['publiee', 'publiee_le']);
            $table->index('categorie');
        });

        Schema::create('faq_entrees', function (Blueprint $table) {
            $table->id();
            $table->string('categorie');
            $table->string('question');
            $table->text('reponse');
            $table->unsignedSmallInteger('ordre')->default(0);
            $table->boolean('publiee')->default(true);
            $table->timestamps();

            $table->index(['categorie', 'ordre']);
        });

        Schema::create('partenaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('slug')->unique();
            $table->string('type')->default('partenaire');
            $table->string('logo')->nullable();
            $table->string('site_web')->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('ordre')->default(0);
            $table->boolean('publie')->default(true);
            $table->timestamps();

            $table->index(['type', 'ordre']);
        });

        Schema::create('articles_presse', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('media');
            $table->string('type')->default('article');
            $table->date('date_publication');
            $table->string('lien')->nullable();
            $table->string('fichier')->nullable();
            $table->text('resume')->nullable();
            $table->boolean('publie')->default(true);
            $table->timestamps();

            $table->index(['publie', 'date_publication']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles_presse');
        Schema::dropIfExists('partenaires');
        Schema::dropIfExists('faq_entrees');
        Schema::dropIfExists('actualites');
    }
};
