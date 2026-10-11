<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Postgres-specific search support for the public job board.
     *
     * The UI searches offers by free text, which means `ilike '%mot%'`. A btree
     * index cannot serve a leading wildcard, so without this every search is a
     * sequential scan over the whole table. pg_trgm indexes trigrams instead and
     * keeps those queries fast as the offer count grows.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX offres_titre_trgm ON offres_emploi USING gin (titre gin_trgm_ops)');
        DB::statement('CREATE INDEX offres_description_trgm ON offres_emploi USING gin (description gin_trgm_ops)');
        DB::statement('CREATE INDEX entreprises_nom_trgm ON entreprises USING gin (nom gin_trgm_ops)');

        // The board lists published, unexpired offers newest first; a partial
        // index keeps drafts and closed offers out of the index entirely.
        DB::statement("CREATE INDEX offres_publiees ON offres_emploi (publiee_le DESC) WHERE statut = 'publiee'");
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP INDEX IF EXISTS offres_titre_trgm');
        DB::statement('DROP INDEX IF EXISTS offres_description_trgm');
        DB::statement('DROP INDEX IF EXISTS entreprises_nom_trgm');
        DB::statement('DROP INDEX IF EXISTS offres_publiees');
    }
};
