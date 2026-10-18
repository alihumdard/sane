<?php

namespace Database\Seeders;

use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OffresClientSeeder extends Seeder
{
    public function run(): void
    {
        $offres = [
            [
                'entreprise' => [
                    'nom' => 'ONG BEFEN',
                    'secteur' => 'ONG / Santé',
                    'taille' => '50-200',
                    'ville' => 'Guidan Roumdji',
                    'description' => "L'ONG médicale BEFEN (Bien Être de la Femme et de l'Enfant au Niger) a été créée en 2002 pour promouvoir le bien être de la femme et de l'enfant au Niger dans les domaines de la santé et de l'éducation.",
                    'verifiee' => true,
                ],
                'offre' => [
                    'titre' => 'Chauffeur',
                    'description' => "L'ONG BEFEN (Bien Être de la Femme et de l'Enfant) au Niger recherche 4 chauffeurs pour assurer la conduite et la sécurité des passagers et des biens, ainsi que l'entretien des véhicules.",
                    'missions' => "- Veiller à ce que seuls les chauffeurs BEFEN conduisent les véhicules BEFEN\n- Assurer le transport sécurisé du personnel et des personnes autorisées\n- Entretenir le véhicule et tenir à jour le Logbook\n- Veiller au respect du code de la route et des règles de sécurité\n- Assurer l'administration et la communication liées aux déplacements",
                    'profil_recherche' => "- Niveau élémentaire minimum\n- Savoir lire, écrire et parler couramment le français\n- Permis de conduire catégorie B, C ou D\n- Expérience d'au moins un an de conduite avec une ONG (atout)\n- Bonne moralité, autonomie, flexibilité",
                    'type_contrat' => TypeContrat::Cdd,
                    'secteur' => 'ONG / Santé',
                    'ville' => 'Guidan Roumdji',
                    'salaire_min' => null,
                    'salaire_max' => null,
                    'experience_requise' => 1,
                    'niveau_etude' => 'Élémentaire',
                    'date_limite' => '2026-10-23',
                ],
            ],
            [
                'entreprise' => [
                    'nom' => 'Banque Atlantique',
                    'secteur' => 'Banque / Finance',
                    'taille' => '200+',
                    'ville' => 'Niamey',
                    'description' => "Une banque de la place, filiale du Groupe Banque Atlantique, présente à Niamey.",
                    'verifiee' => true,
                ],
                'offre' => [
                    'titre' => 'Chargé Reporting Comptable',
                    'description' => "Le/la Chargé(e) Reporting Comptable a pour mission de contribuer à la production des états financiers du Holding. Il fait le reporting aux entités concernées (Holding, autorités de tutelle et de contrôle) selon le cadre établi.",
                    'missions' => "- Effectuer les reporting comptables et réglementaires (situations périodiques, FODEP et ratios prudentiels)\n- Préparer les justificatifs et la documentation pour les autorités de tutelle\n- Produire les statistiques et tableaux de bord (réserves obligatoires, emplois et ressources APB, ratio de solvabilité)\n- Assurer le suivi et l'analyse des comptes généraux\n- Assurer le contrôle interne de 1er niveau de ses activités",
                    'profil_recherche' => "- BAC+4/5 en Comptabilité, Finance\n- Bonnes connaissances des normes comptables et de la réglementation prudentielle\n- TB maîtrise des outils informatiques et bureautiques\n- Expérience professionnelle de 3 ans minimum dans une institution financière\n- Rigueur, organisation, réactivité, intégrité et confidentialité",
                    'type_contrat' => TypeContrat::Cdi,
                    'secteur' => 'Banque / Finance',
                    'ville' => 'Niamey',
                    'salaire_min' => null,
                    'salaire_max' => null,
                    'experience_requise' => 3,
                    'niveau_etude' => 'Bac+4/5',
                    'date_limite' => '2026-10-23',
                ],
            ],
            [
                'entreprise' => [
                    'nom' => 'Complexe Scolaire Peralta',
                    'secteur' => 'Éducation',
                    'taille' => '50-200',
                    'ville' => 'Niamey',
                    'description' => "Le Complexe Scolaire Peralta est un établissement bioclimatique et inclusif, conçu pour offrir un cadre d'apprentissage équitable propice à l'épanouissement intellectuel et social des élèves.",
                    'verifiee' => true,
                ],
                'offre' => [
                    'titre' => 'Bibliothécaire et Animateur du Centre des Ressources Documentaires, Culturelles et Numériques',
                    'description' => "Sous la supervision de la Direction, le/la bibliothécaire et animateur/trice assure la gestion de la bibliothèque et des ressources documentaires de l'établissement ainsi que de son espace numérique, en étroite coordination avec le/la chargé(e) TIC.",
                    'missions' => "- Gestion de la bibliothèque et de l'espace informatique\n- Promotion de la lecture (programme \"Un livre par mois\", heures de lecture, défis lecture)\n- Éducation à la recherche documentaire et à l'esprit critique\n- Développement des compétences numériques des élèves\n- Animation culturelle (Club Lecture, Journal Scolaire, expositions thématiques)\n- Appui aux enseignants et partenariats",
                    'profil_recherche' => "- Diplôme en bibliothéconomie, sciences de l'information documentaire ou domaine équivalent\n- Au moins 2 années d'expérience en bibliothèque, centre de documentation ou structure culturelle\n- Maîtrise des outils bureautiques (Word, Excel, PowerPoint, Outlook)\n- Bonne connaissance de la littérature jeunesse\n- Excellentes capacités relationnelles et sens de l'accueil\n- Les candidatures féminines sont fortement encouragées",
                    'type_contrat' => TypeContrat::Cdd,
                    'secteur' => 'Éducation',
                    'ville' => 'Niamey',
                    'salaire_min' => null,
                    'salaire_max' => null,
                    'experience_requise' => 2,
                    'niveau_etude' => 'Licence',
                    'date_limite' => '2026-10-15',
                ],
            ],
            [
                'entreprise' => [
                    'nom' => 'Pathfinder International',
                    'secteur' => 'ONG / Santé',
                    'taille' => '200+',
                    'ville' => 'Niamey',
                    'description' => "Pathfinder International est une organisation leader sur le plan mondial en matière de santé. Pathfinder envisage un monde qui valorise et investit dans le leadership, la santé et la résilience des femmes et des filles.",
                    'verifiee' => true,
                ],
                'offre' => [
                    'titre' => 'Chauffeur',
                    'description' => "Pathfinder International recrute 4 chauffeurs (1 Niamey, 1 Maradi, 1 Tahoua, 1 Zinder) chargés d'assurer le transport du personnel dans le cadre des missions, dans les meilleures conditions de sécurité, de confort et de ponctualité.",
                    'missions' => "- Assurer le transport du personnel et des visiteurs\n- Effectuer les courses administratives et déplacements logistiques\n- Tenir à jour les carnets de bord des véhicules\n- Contrôler régulièrement l'état général du véhicule\n- Respecter en tout temps les règles de sécurité routière et les procédures internes",
                    'profil_recherche' => "- Permis de conduire valide depuis au moins 5 ans\n- Niveau minimum classe de 3e\n- Au moins 5 années d'expérience professionnelle en tant que chauffeur\n- Expérience au sein d'une ONG internationale (atout)\n- Connaissances de base en entretien et réparations mineures de véhicules\n- Compétences de base en informatique\n- Les candidatures féminines sont fortement encouragées",
                    'type_contrat' => TypeContrat::Cdd,
                    'secteur' => 'ONG / Santé',
                    'ville' => 'Niamey',
                    'salaire_min' => null,
                    'salaire_max' => null,
                    'experience_requise' => 5,
                    'niveau_etude' => 'Classe de 3e',
                    'date_limite' => '2026-10-16',
                ],
            ],
            [
                'entreprise' => [
                    'nom' => 'Cabinet COSEF',
                    'secteur' => 'Conseil / RH',
                    'taille' => '10-50',
                    'ville' => 'Niamey',
                    'description' => "Cabinet de Conseil, d'Etudes et de Formation en Gestion des Ressources Humaines et en Management, basé à Niamey Plateau.",
                    'verifiee' => true,
                ],
                'offre' => [
                    'titre' => 'Comptable',
                    'description' => "Le cabinet COSEF recherche pour le compte d'une importante société commerciale de la place, un(e) Comptable pour servir au niveau de son siège à Niamey.",
                    'missions' => "- Assurer la gestion comptable de l'établissement (achats, ventes, banques, caisse)\n- Comptabiliser les frais annexes liés au transport de marchandises (transit, douane, transport, assurances)\n- Assurer le suivi des comptes tiers et relancer les impayés\n- Effectuer les rapprochements bancaires (comptes devises, crédits documentaires)\n- Élaborer les rapports périodiques internes et vers l'administration fiscale (DGI)\n- Assurer l'établissement de la liasse fiscale annuelle et des états financiers",
                    'profil_recherche' => "- DTS ou Licence (BAC+3) en comptabilité, finance, gestion ou formation équivalente\n- Au moins 3 ans d'expérience à un poste similaire en société commerciale, transit ou import-export\n- Bonne connaissance fiscale et douanière de l'import-export (Incoterms, TVA internationale)\n- Bonne maîtrise du logiciel de comptabilité et gestion SAGE SARI\n- Sens de responsabilité, rigueur, discrétion et bonne moralité",
                    'type_contrat' => TypeContrat::Cdi,
                    'secteur' => 'Commerce / Import-Export',
                    'ville' => 'Niamey',
                    'salaire_min' => null,
                    'salaire_max' => null,
                    'experience_requise' => 3,
                    'niveau_etude' => 'Bac+3',
                    'date_limite' => '2026-10-20',
                ],
            ],
            [
                'entreprise' => [
                    'nom' => 'Group SOGES International',
                    'secteur' => 'Sécurité / Gardiennage',
                    'taille' => '200+',
                    'ville' => 'Niamey',
                    'description' => "Société de Gardiennage et de Sécurité, Group SOGES International opère à Niamey, quartier Terminus.",
                    'verifiee' => true,
                ],
                'offre' => [
                    'titre' => 'Agent de Sécurité (Vigile)',
                    'description' => "Group SOGES International lance un avis de recrutement de vingt (20) agents de sécurité (Vigile).",
                    'missions' => "- Assurer la surveillance et la sécurité des sites assignés\n- Être disponible de jour comme de nuit\n- Appliquer les procédures de sécurité de l'entreprise",
                    'profil_recherche' => "- Être de nationalité nigérienne\n- Être âgé de 30 à 45 ans au plus\n- Avoir une expérience professionnelle en tant qu'agent de sécurité\n- Être disponible de jour comme de nuit\n- Fournir: acte de naissance légalisé, certificat de nationalité légalisé, copie CNI, deux photos d'identité",
                    'type_contrat' => TypeContrat::Cdd,
                    'secteur' => 'Sécurité / Gardiennage',
                    'ville' => 'Niamey',
                    'salaire_min' => null,
                    'salaire_max' => null,
                    'experience_requise' => 1,
                    'niveau_etude' => null,
                    'date_limite' => '2026-10-30',
                ],
            ],
        ];

        foreach ($offres as $entry) {
            $entrepriseData = $entry['entreprise'];
            $offreData = $entry['offre'];

            $slugBase = Str::slug($entrepriseData['nom']);
            $email = $slugBase.'@recruteur.sanem.ne';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $entrepriseData['nom'],
                    'password' => Hash::make('password'),
                    'role' => 'recruteur',
                    'statut' => 'actif',
                    'email_verified_at' => now(),
                ]
            );

            $entreprise = Entreprise::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nom' => $entrepriseData['nom'],
                    'slug' => $slugBase,
                    'secteur' => $entrepriseData['secteur'],
                    'taille' => $entrepriseData['taille'],
                    'ville' => $entrepriseData['ville'],
                    'description' => $entrepriseData['description'],
                    'verifiee' => $entrepriseData['verifiee'],
                ]
            );

            OffreEmploi::firstOrCreate(
                [
                    'entreprise_id' => $entreprise->id,
                    'titre' => $offreData['titre'],
                ],
                [
                    'slug' => Str::slug($offreData['titre'].'-'.$entrepriseData['nom']),
                    'description' => $offreData['description'],
                    'missions' => $offreData['missions'],
                    'profil_recherche' => $offreData['profil_recherche'],
                    'type_contrat' => $offreData['type_contrat'],
                    'secteur' => $offreData['secteur'],
                    'ville' => $offreData['ville'],
                    'salaire_min' => $offreData['salaire_min'],
                    'salaire_max' => $offreData['salaire_max'],
                    'experience_requise' => $offreData['experience_requise'],
                    'niveau_etude' => $offreData['niveau_etude'],
                    'date_limite' => $offreData['date_limite'],
                    'statut' => StatutOffre::Publiee,
                    'vues' => 0,
                    'publiee_le' => now(),
                ]
            );
        }
    }
}
