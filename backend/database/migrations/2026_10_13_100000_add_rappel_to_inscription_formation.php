<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Stamped when the J-3 reminder for this course goes out.
     *
     * It lives on the pivot rather than on the registration because a
     * participant may take several courses on different dates: each one is
     * reminded separately, and a single flag could only ever record the first.
     */
    public function up(): void
    {
        Schema::table('inscription_formation', function (Blueprint $table) {
            $table->timestamp('rappel_envoye_le')->nullable()->after('formation_id');

            $table->index('rappel_envoye_le');
        });
    }

    public function down(): void
    {
        Schema::table('inscription_formation', function (Blueprint $table) {
            $table->dropIndex(['rappel_envoye_le']);
            $table->dropColumn('rappel_envoye_le');
        });
    }
};
