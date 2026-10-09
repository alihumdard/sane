<?php

namespace Database\Seeders;

use App\Enums\RoleUtilisateur;
use App\Models\CategorieFormation;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SanemSeeder extends Seeder
{
    public function run(): void
    {
        $edition = Edition::updateOrCreate(
            ['annee' => 2026],
            [
                'nom' => "Salon National de l'Emploi 2026",
                'date_debut' => '2026-03-12',
                'date_fin' => '2026-03-16',
                'lieu' => 'Palais des Congrès, Niamey',
                'active' => true,
                'inscriptions_ouvertes' => true,
            ]
        );

        $categories = collect([
            'Management', 'Digital', 'Entrepreneuriat',
            'Communication', 'Technologie', 'Finance',
            'Informatique', 'Développement personnel',
        ])->mapWithKeys(function (string $nom, int $i) {
            $categorie = CategorieFormation::updateOrCreate(
                ['slug' => Str::slug($nom)],
                ['nom' => $nom, 'ordre' => $i]
            );

            return [$nom => $categorie->id];
        });

        // Mirrors the eight formations currently hardcoded in the frontend.
        $formations = [
            ['Leadership & Management', 'Management', '2 jours', 'Intermédiaire', 'Présentiel', 50],
            ['Transformation Digitale', 'Digital', '3 jours', 'Débutant', 'Hybride', 40],
            ['Entrepreneuriat des Jeunes', 'Entrepreneuriat', '2 jours', 'Débutant', 'Présentiel', 60],
            ['Techniques de Communication', 'Communication', '2 jours', 'Débutant', 'Présentiel', 45],
            ['Compétences en Énergies Renouvelables', 'Technologie', '3 jours', 'Intermédiaire', 'Présentiel', 30],
            ['Compétences Digitales', 'Informatique', '2 jours', 'Débutant', 'En ligne', 80],
            ["Préparation à l'Emploi", 'Développement personnel', '2 jours', 'Débutant', 'Présentiel', 70],
            ['Gestion de Projet', 'Management', '3 jours', 'Intermédiaire', 'Hybride', 35],
        ];

        foreach ($formations as [$titre, $categorie, $duree, $niveau, $format, $places]) {
            Formation::updateOrCreate(
                ['edition_id' => $edition->id, 'slug' => Str::slug($titre)],
                [
                    'categorie_id' => $categories[$categorie],
                    'titre' => $titre,
                    'duree' => $duree,
                    'lieu' => 'Niamey',
                    'niveau' => $niveau,
                    'format' => $format,
                    'max_inscriptions' => $places,
                    'publiee' => true,
                ]
            );
        }

        User::updateOrCreate(
            ['email' => 'admin@sanem.ne'],
            [
                'name' => 'Administrateur SANEM',
                'role' => RoleUtilisateur::Administrateur,
                'statut' => 'actif',
                'password' => Hash::make('changeme'),
                'email_verified_at' => now(),
            ]
        );
    }
}
