<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The organisation's social accounts, beside its phone and address.
 *
 * The footer and the contact page each carried five icons pointing at "#",
 * ten dead links on every page of the site, because nobody had the addresses
 * when the pages were written. Settings rather than source: whoever has them
 * is the organiser, and they should not need a deployment to add them.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('parametre_plateformes', function (Blueprint $table) {
            foreach (['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'] as $reseau) {
                $table->string($reseau)->nullable()->after('site_web');
            }
        });
    }

    public function down(): void
    {
        Schema::table('parametre_plateformes', function (Blueprint $table) {
            $table->dropColumn(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube']);
        });
    }
};
