<?php

namespace Database\Seeders;

use App\Models\SessionProgramme;
use Illuminate\Database\Seeder;

/**
 * The first day's schedule, as it was written into the front-end.
 *
 * Carried over so the programme page is not empty the moment it starts
 * reading from the database; the organisers correct the hours and add the
 * other two days from the back-office.
 *
 * Idempotent: run it twice and you still have one of each.
 */
class ProgrammeSeeder extends Seeder
{
    public function run(): void
    {
        $jour = '2026-12-10';

        $sessions = [
            ['08:00', '09:00', 'Accueil & Inscriptions', 'Accueil des participants, remise des badges et documents.', 'Accueil', 'Hall principal', '/sane_deal.webp'],
            ['09:00', '09:30', "Cérémonie d'ouverture", "Allocutions officielles et présentation des objectifs du SANEM.", 'Cérémonie', 'Grande salle', '/sane-company3.webp'],
            ['09:30', '10:30', 'Conférence inaugurale', "« L'emploi des jeunes : enjeux et perspectives pour le Niger »\n\nAvec des experts nationaux et internationaux.", 'Conférence', 'Grande salle', '/sane_deal.webp'],
            ['11:00', '12:30', 'Panels thématiques', "Transformation digitale et nouveaux métiers\n\nEntrepreneuriat des jeunes\n\nCompétences pour l'avenir", 'Panel', 'Salles thématiques', '/sane-cv2.webp'],
            ['12:30', '14:00', 'Pause-déjeuner & réseautage', "Un moment d'échange entre participants, entreprises et institutions.", 'Networking', 'Espace détente', '/sane-company3.webp'],
            ['14:00', '16:00', 'Sessions de formation', 'Ateliers pratiques animés par des experts du secteur.', 'Formation', 'Salles de formation', '/sane_deal.webp'],
            ['16:00', '17:30', 'Sessions de recrutement', 'Rencontrez directement des recruteurs et déposez vos CV.', 'Recrutement', 'Espace recrutement', '/sane-cv2.webp'],
            ['17:30', '18:00', 'Cérémonie de clôture', 'Synthèse de la journée et prochaines étapes.', 'Cérémonie', 'Grande salle', '/sane-company3.webp'],
        ];

        foreach ($sessions as $ordre => [$debut, $fin, $titre, $description, $categorie, $lieu, $image]) {
            SessionProgramme::updateOrCreate(
                ['jour' => $jour, 'heure_debut' => $debut, 'titre' => $titre],
                [
                    'heure_fin' => $fin,
                    'description' => $description,
                    'categorie' => $categorie,
                    'lieu' => $lieu,
                    'image' => $image,
                    'ordre' => $ordre,
                    'publiee' => true,
                ],
            );
        }
    }
}
