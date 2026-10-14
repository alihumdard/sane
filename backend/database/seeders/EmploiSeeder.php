<?php

namespace Database\Seeders;

use App\Enums\RoleUtilisateur;
use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use App\Models\Competence;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seeds the job board with the content the frontend previously hardcoded in
 * components/emploi/data.ts, so the public pages render from the database.
 */
class EmploiSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->competences() as $nom) {
            Competence::trouverOuCreer($nom);
        }

        foreach ($this->entreprises() as $donnees) {
            $offres = $donnees['offres'];
            unset($donnees['offres']);

            $user = User::firstOrCreate(
                ['email' => $donnees['email']],
                [
                    'name' => $donnees['nom'],
                    // Same placeholder as the administrator seeded alongside:
                    // one password to remember while testing, and one obvious
                    // thing to change before anyone real signs in.
                    'password' => 'changeme',
                    'role' => RoleUtilisateur::Recruteur,
                    'statut' => 'actif',
                ],
            );

            $entreprise = Entreprise::firstOrCreate(
                ['slug' => Str::slug($donnees['nom'])],
                [
                    'user_id' => $user->id,
                    'nom' => $donnees['nom'],
                    'secteur' => $donnees['secteur'],
                    'ville' => 'Niamey',
                    'description' => $donnees['description'],
                    'verifiee' => true,
                ],
            );

            foreach ($offres as $offre) {
                OffreEmploi::firstOrCreate(
                    ['slug' => Str::slug($offre['titre'].'-'.$entreprise->nom)],
                    [
                        'entreprise_id' => $entreprise->id,
                        'titre' => $offre['titre'],
                        'description' => $offre['description'],
                        'missions' => $offre['missions'],
                        'profil_recherche' => $offre['profil'],
                        'type_contrat' => $offre['contrat'],
                        'secteur' => $offre['secteur'],
                        'ville' => $offre['ville'],
                        'salaire_min' => $offre['salaire_min'],
                        'salaire_max' => $offre['salaire_max'],
                        'experience_requise' => $offre['experience'],
                        'niveau_etude' => $offre['niveau'],
                        'date_limite' => now()->addDays($offre['jours'])->toDateString(),
                        'statut' => StatutOffre::Publiee,
                        'publiee_le' => now()->subDays($offre['publiee_il_y_a']),
                    ],
                );
            }
        }
    }

    private function competences(): array
    {
        return [
            'Gestion de projet', 'Communication', 'Rédaction', 'Suivi & Évaluation',
            'Développement web', 'PHP', 'JavaScript', 'Python', 'SQL',
            'Comptabilité', 'Ressources humaines', 'Logistique',
            'Anglais', 'Français', 'Haoussa', 'Zarma',
            'Microsoft Office', 'Analyse de données', 'Formation', 'Animation',
        ];
    }

    private function entreprises(): array
    {
        return [
            [
                'nom' => 'Enabel Niger',
                'email' => 'recrutement@enabel.example.ne',
                'secteur' => 'Humanitaire & ONG',
                'description' => "Agence belge de développement, active au Niger dans l'éducation, la santé et l'agriculture.",
                'offres' => [
                    [
                        'titre' => 'Chargé de Communication',
                        'description' => 'Vous pilotez la communication institutionnelle du bureau pays et valorisez les résultats des programmes auprès des partenaires et du grand public.',
                        'missions' => 'Élaborer le plan de communication annuel ; produire les contenus web et réseaux sociaux ; organiser les événements ; appuyer les équipes projet dans la capitalisation.',
                        'profil' => "Bac+3 minimum en communication ou journalisme, 3 ans d'expérience, excellente expression écrite en français.",
                        'contrat' => TypeContrat::Cdi->value,
                        'secteur' => 'Communication, Médias & Culture',
                        'ville' => 'Niamey',
                        'salaire_min' => 450000, 'salaire_max' => 650000,
                        'experience' => '3 ans', 'niveau' => 'Bac+3',
                        'jours' => 30, 'publiee_il_y_a' => 2,
                    ],
                ],
            ],
            [
                'nom' => 'GIZ Niger',
                'email' => 'recrutement@giz.example.ne',
                'secteur' => 'Humanitaire & ONG',
                'description' => 'Coopération allemande au développement, présente au Niger depuis plus de quarante ans.',
                'offres' => [
                    [
                        'titre' => 'Développeur Web',
                        'description' => 'Vous développez et maintenez les applications internes du bureau pays et accompagnez les équipes dans la numérisation de leurs outils de suivi.',
                        'missions' => 'Développer des applications web ; maintenir les bases de données ; rédiger la documentation technique ; former les utilisateurs.',
                        'profil' => 'Bac+3 en informatique, maîtrise de PHP et JavaScript, connaissance des bases de données relationnelles.',
                        'contrat' => TypeContrat::Cdd->value,
                        'secteur' => 'Informatique & Numérique',
                        'ville' => 'Niamey',
                        'salaire_min' => 400000, 'salaire_max' => 600000,
                        'experience' => '2 ans', 'niveau' => 'Bac+3',
                        'jours' => 25, 'publiee_il_y_a' => 4,
                    ],
                ],
            ],
            [
                'nom' => 'Banque Mondiale Niger',
                'email' => 'recrutement@bm.example.ne',
                'secteur' => 'Humanitaire & ONG',
                'description' => 'Institution financière internationale appuyant les programmes de développement du Niger.',
                'offres' => [
                    [
                        'titre' => 'Spécialiste Suivi & Évaluation',
                        'description' => 'Vous concevez et pilotez les dispositifs de suivi-évaluation des projets financés au Niger.',
                        'missions' => "Définir les indicateurs ; collecter et analyser les données ; produire les rapports périodiques ; former les partenaires d'exécution.",
                        'profil' => "Bac+5 en statistiques, économie ou domaine connexe, 5 ans d'expérience en suivi-évaluation.",
                        'contrat' => TypeContrat::Cdi->value,
                        'secteur' => 'Humanitaire & ONG',
                        'ville' => 'Niamey',
                        'salaire_min' => 800000, 'salaire_max' => 1200000,
                        'experience' => '5 ans', 'niveau' => 'Bac+5',
                        'jours' => 20, 'publiee_il_y_a' => 6,
                    ],
                ],
            ],
            [
                'nom' => 'PNUD Niger',
                'email' => 'recrutement@pnud.example.ne',
                'secteur' => 'Administration publique',
                'description' => 'Programme des Nations Unies pour le développement, bureau du Niger.',
                'offres' => [
                    [
                        'titre' => 'Assistant Administratif',
                        'description' => "Vous assurez le soutien administratif et logistique quotidien de l'unité programme.",
                        'missions' => 'Gérer les agendas et la correspondance ; organiser les missions ; suivre les commandes ; archiver les dossiers.',
                        'profil' => "Bac+2 en administration ou gestion, 2 ans d'expérience, bonne maîtrise de la suite bureautique.",
                        'contrat' => TypeContrat::Cdd->value,
                        'secteur' => 'Administration publique',
                        'ville' => 'Niamey',
                        'salaire_min' => 300000, 'salaire_max' => 420000,
                        'experience' => '2 ans', 'niveau' => 'Bac+2',
                        'jours' => 15, 'publiee_il_y_a' => 9,
                    ],
                ],
            ],
            [
                'nom' => 'AFD Niger',
                'email' => 'recrutement@afd.example.ne',
                'secteur' => 'Éducation & Formation',
                'description' => "Agence française de développement, financement de projets d'intérêt public au Niger.",
                'offres' => [
                    [
                        'titre' => 'Expert en Formation',
                        'description' => "Vous concevez et animez les parcours de formation professionnelle soutenus par l'agence.",
                        'missions' => 'Analyser les besoins ; concevoir les modules ; animer les sessions ; évaluer les acquis.',
                        'profil' => "Bac+4 en sciences de l'éducation ou équivalent, expérience confirmée en ingénierie de formation.",
                        'contrat' => TypeContrat::Consultant->value,
                        'secteur' => 'Éducation & Formation',
                        'ville' => 'Niamey',
                        'salaire_min' => 600000, 'salaire_max' => 900000,
                        'experience' => '4 ans', 'niveau' => 'Bac+4',
                        'jours' => 40, 'publiee_il_y_a' => 11,
                    ],
                ],
            ],
            [
                'nom' => 'Hôpital Général de Référence',
                'email' => 'recrutement@hgr.example.ne',
                'secteur' => 'Santé & Action sociale',
                'description' => 'Établissement public de santé de référence régionale.',
                'offres' => [
                    [
                        'titre' => 'Infirmier Diplômé d\'État',
                        'description' => 'Vous assurez les soins infirmiers auprès des patients hospitalisés.',
                        'missions' => "Dispenser les soins ; surveiller l'état des patients ; tenir les dossiers de soins ; encadrer les stagiaires.",
                        'profil' => "Diplôme d'État d'infirmier, inscription à l'ordre, disponibilité pour le travail en roulement.",
                        'contrat' => TypeContrat::Cdi->value,
                        'secteur' => 'Santé & Action sociale',
                        'ville' => 'Zinder',
                        'salaire_min' => 250000, 'salaire_max' => 350000,
                        'experience' => '1 an', 'niveau' => 'Bac+3',
                        'jours' => 35, 'publiee_il_y_a' => 1,
                    ],
                ],
            ],
            [
                'nom' => 'Coopérative Agricole du Sahel',
                'email' => 'recrutement@cas.example.ne',
                'secteur' => 'Agriculture & Élevage',
                'description' => 'Coopérative appuyant les producteurs des régions de Maradi et Tahoua.',
                'offres' => [
                    [
                        'titre' => 'Technicien Agricole',
                        'description' => "Vous accompagnez les producteurs dans l'amélioration de leurs pratiques culturales.",
                        'missions' => 'Conseiller les producteurs ; suivre les parcelles de démonstration ; animer les sessions techniques ; collecter les données de campagne.',
                        'profil' => 'Bac+2 en agronomie, maîtrise du haoussa, permis moto apprécié.',
                        'contrat' => TypeContrat::Cdd->value,
                        'secteur' => 'Agriculture & Élevage',
                        'ville' => 'Maradi',
                        'salaire_min' => 200000, 'salaire_max' => 300000,
                        'experience' => '1 an', 'niveau' => 'Bac+2',
                        'jours' => 28, 'publiee_il_y_a' => 3,
                    ],
                ],
            ],
            [
                'nom' => 'Niger Telecom',
                'email' => 'recrutement@nigertelecom.example.ne',
                'secteur' => 'Informatique & Numérique',
                'description' => 'Opérateur national de télécommunications.',
                'offres' => [
                    [
                        'titre' => 'Stage Analyste Données',
                        'description' => "Stage de six mois au sein de la direction des systèmes d'information.",
                        'missions' => 'Préparer les jeux de données ; produire les tableaux de bord ; documenter les traitements.',
                        'profil' => "Étudiant en dernière année (statistiques, informatique), bonne maîtrise de SQL et d'Excel.",
                        'contrat' => TypeContrat::Stage->value,
                        'secteur' => 'Informatique & Numérique',
                        'ville' => 'Niamey',
                        'salaire_min' => 100000, 'salaire_max' => 150000,
                        'experience' => 'Débutant', 'niveau' => 'Bac+4',
                        'jours' => 18, 'publiee_il_y_a' => 5,
                    ],
                ],
            ],
        ];
    }
}
