<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('telephone')->nullable()->after('email');
            $table->string('role')->default('participant')->after('telephone');
            $table->string('statut')->default('actif')->after('role');
            $table->string('photo')->nullable()->after('statut');
            $table->timestamp('derniere_connexion_le')->nullable()->after('photo');

            $table->index('role');
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['statut']);
            $table->dropColumn(['telephone', 'role', 'statut', 'photo', 'derniere_connexion_le']);
        });
    }
};
