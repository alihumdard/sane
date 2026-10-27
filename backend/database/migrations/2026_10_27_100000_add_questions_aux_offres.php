<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Two selection questions an employer may attach to an offer, and the
 * candidate's answers.
 *
 * A CV and a profile say what someone has done; they do not say whether they
 * hold a driving licence, or can start on Monday. Recruiters were asking for
 * those in the job description and reading the answers nowhere.
 *
 * Two rather than an arbitrary list: the client asked for two, and a fixed
 * pair needs no ordering, no deletion and no join table — if a third is ever
 * wanted, that is the moment to reach for one.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offres_emploi', function (Blueprint $table) {
            $table->string('question_1', 500)->nullable()->after('profil_recherche');
            $table->string('question_2', 500)->nullable()->after('question_1');
        });

        Schema::table('candidatures', function (Blueprint $table) {
            // Longer than the questions: an answer may need explaining.
            $table->text('reponse_1')->nullable()->after('lettre_motivation');
            $table->text('reponse_2')->nullable()->after('reponse_1');
        });
    }

    public function down(): void
    {
        Schema::table('offres_emploi', function (Blueprint $table) {
            $table->dropColumn(['question_1', 'question_2']);
        });

        Schema::table('candidatures', function (Blueprint $table) {
            $table->dropColumn(['reponse_1', 'reponse_2']);
        });
    }
};
