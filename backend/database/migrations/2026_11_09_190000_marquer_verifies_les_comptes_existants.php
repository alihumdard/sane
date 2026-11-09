<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Les comptes antérieurs à la vérification obligatoire sont réputés vérifiés.
 *
 * Au moment d'écrire ceci, 47 des 50 comptes n'ont jamais eu d'adresse
 * confirmée — non par négligence, mais parce que rien ne la demandait : la
 * colonne existait, le contrôle n'existait pas. Parmi eux un recruteur réel,
 * qui a déposé le profil de son entreprise le jour même, et 45 autres inscrits
 * depuis la mi-octobre.
 *
 * Brancher le verrou sans cette migration les mettrait tous dehors du jour au
 * lendemain, à deux jours de l'ouverture des inscriptions, pour une règle qui
 * n'existait pas quand ils se sont inscrits. Le verrou ne vaut donc que pour
 * les comptes créés après.
 *
 * Pas de down() qui annule : remettre ces colonnes à null remettrait
 * cinquante personnes dehors, ce qu'aucun retour en arrière ne devrait faire.
 * Le rollback de cette migration est volontairement sans effet.
 */
return new class extends Migration
{
    public function up(): void
    {
        $touches = DB::table('users')
            ->whereNull('email_verified_at')
            ->update(['email_verified_at' => now()]);

        if ($touches > 0) {
            logger()->info('Comptes marqués vérifiés d\'office', ['total' => $touches]);
        }
    }

    public function down(): void
    {
        // Volontairement vide — voir l'en-tête.
    }
};
