<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The sector a speaker belongs to, so the public filters have something to
 * filter on.
 *
 * The speakers page offered sector and domain filters — the contract asks for
 * them — but they only ever worked against a list written into the front-end.
 * Speakers entered from the back-office carried no sector, so they fell out of
 * every filtered view: an organiser added a speaker and could not find them
 * under their own field.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formateurs', function (Blueprint $table) {
            $table->string('secteur', 150)->nullable()->after('organisation');
        });
    }

    public function down(): void
    {
        Schema::table('formateurs', function (Blueprint $table) {
            $table->dropColumn('secteur');
        });
    }
};
