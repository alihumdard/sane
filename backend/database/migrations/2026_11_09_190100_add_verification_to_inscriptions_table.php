<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * La confirmation d'adresse des inscriptions au salon.
 *
 * Une inscription au salon n'a pas de compte derrière elle : ni `users`, ni
 * mot de passe, juste une ligne et une référence. Le contrat MustVerifyEmail
 * ne s'y applique pas, d'où un jeton propre à la ligne.
 *
 * Le jeton est stocké **haché**, jamais en clair. Une fuite de cette table ne
 * doit pas permettre de confirmer l'inscription d'autrui — même raisonnement
 * que pour un mot de passe.
 *
 * `formations_demandees` porte les formations choisies tant qu'elles ne sont
 * pas réservées. C'est la conséquence directe du choix de ne décompter les
 * places qu'à la confirmation : sans cette colonne, le choix serait perdu
 * entre le formulaire et le clic.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            $table->timestamp('email_verifie_le')->nullable()->after('consentement');
            $table->string('jeton_verification', 64)->nullable()->unique()->after('email_verifie_le');
            $table->timestamp('jeton_expire_le')->nullable()->after('jeton_verification');
            $table->jsonb('formations_demandees')->nullable()->after('jeton_expire_le');

            // Traçabilité anti-abus : c'est ce qui permettra de dire, le jour
            // où une vague de faux trafic arrive, d'où elle vient.
            $table->string('ip_creation', 45)->nullable()->after('formations_demandees');
            $table->unsignedTinyInteger('envois_verification')->default(0)->after('ip_creation');

            // Le tableau de bord liste les inscriptions en attente de
            // confirmation ; sans index, ce filtre balaye toute la table.
            $table->index('email_verifie_le');
        });

        /*
         * Les inscriptions déjà en base sont réputées vérifiées, pour la même
         * raison que les comptes : la règle n'existait pas quand elles ont été
         * déposées, et une inscription prise pour non confirmée disparaîtrait
         * à la première purge.
         */
        DB::table('inscriptions')
            ->whereNull('email_verifie_le')
            ->update(['email_verifie_le' => now()]);
    }

    public function down(): void
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            $table->dropIndex(['email_verifie_le']);
            $table->dropColumn([
                'email_verifie_le',
                'jeton_verification',
                'jeton_expire_le',
                'formations_demandees',
                'ip_creation',
                'envois_verification',
            ]);
        });
    }
};
