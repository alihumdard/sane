<?php

namespace Database\Seeders;

use App\Enums\RoleUtilisateur;
use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use App\Models\Entreprise;
use App\Models\OffreEmploi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Real job adverts supplied by the client, for testing with their own data.
 *
 * Kept apart from EmploiSeeder, which invents its companies: these are real
 * organisations whose postings the ANPE has stamped, and nothing here should
 * be mistaken for sample data or quietly regenerated.
 *
 * Each advert is reproduced as published — the selection criteria, the papers
 * to bring and the office hours are the employer's words, because a candidate
 * turned away for a missing birth certificate is a real cost.
 *
 * Idempotent: re-running updates in place rather than duplicating.
 */
class OffresClientSeeder extends Seeder
{
    public function run(): void
    {
        $this->soges();
        $this->cosef();
        $this->banqueAtlantique();
        $this->pathfinder();
        $this->peralta();
        $this->befen();
    }

    /**
     * Group SOGES International — 20 security guards.
     *
     * Applications are filed on paper at their office, not online. The listing
     * still accepts an application here, because a job nobody can apply to
     * from the site is not much of a job board, but the description leads with
     * where to go and what to bring so nobody arrives empty-handed.
     */
    private function soges(): void
    {
        $entreprise = $this->entreprise(
            nom: 'Group SOGES International',
            secteur: 'Sécurité & Défense',
            description: 'Société de gardiennage et de sécurité, prestataire de services de '
                .'surveillance et de protection des personnes et des biens au Niger.',
            telephone: '20 33 07 99 / 96 40 05 50',
        );

        $this->offre($entreprise, [
            'titre' => 'Agent de sécurité (Vigile) — 20 postes',
            'description' => <<<'TEXTE'
            Group SOGES International, société de gardiennage et de sécurité, recrute vingt (20) agents de sécurité (vigiles).

            DOSSIER À FOURNIR
            • Un acte de naissance, copie légalisée
            • Un certificat de nationalité, copie légalisée
            • Une copie de la carte d'identité nationale
            • Deux photos d'identité

            DÉPÔT DU DOSSIER
            Au siège de SOGES, quartier Terminus, face au Ministère de l'Environnement, de 08h30 à 17h00.
            Contact : 20 33 07 99 / 96 40 05 50

            Avis enregistré auprès de l'Agence Nationale pour la Promotion de l'Emploi (ANPE Niamey).
            TEXTE,
            'missions' => 'Surveiller et protéger les sites confiés à la société ; contrôler les accès ; '
                .'assurer les rondes de jour comme de nuit ; signaler tout incident à la hiérarchie.',
            'profil_recherche' => <<<'TEXTE'
            • Être de nationalité nigérienne
            • Être âgé de 30 à 45 ans au plus
            • Avoir une expérience professionnelle en tant qu'agent de sécurité
            • Être disponible de jour comme de nuit
            TEXTE,
            'type_contrat' => TypeContrat::Cdd->value,
            'secteur' => 'Sécurité & Défense',
            'ville' => 'Niamey',
            'experience_requise' => 'Expérience exigée comme agent de sécurité',
            'niveau_etude' => 'Sans diplôme exigé',
            'date_limite' => '2026-10-30',
        ]);
    }

    /**
     * Cabinet COSEF — one accountant, recruited on behalf of a client.
     *
     * COSEF is a recruitment firm, so the employer is not named: the advert
     * says only "une importante société commerciale de la place". The listing
     * is filed under COSEF, which is who a candidate writes to.
     *
     * Applications go by email or on paper, and the covering letter has to
     * carry an exact wording — "Candidature au poste de Comptable" — so that
     * sits at the top of the dossier list rather than buried in it.
     */
    private function cosef(): void
    {
        $entreprise = $this->entreprise(
            nom: 'Cabinet COSEF',
            secteur: 'Services aux entreprises',
            description: "Cabinet de conseil, d'études et de formation en gestion des ressources "
                ."humaines et en management. Recrute pour le compte de ses clients.",
            telephone: '20 73 64 80',
            siteWeb: 'https://www.cosef.ne',
        );

        $this->offre($entreprise, [
            'titre' => 'Comptable',
            'description' => <<<'TEXTE'
            Le cabinet COSEF recherche, pour le compte d'une importante société commerciale de la place, un (1) Comptable pour servir au niveau de son siège à Niamey.

            DOSSIER DE CANDIDATURE
            • Une demande manuscrite ou lettre de candidature adressée à Monsieur le Directeur Général du Cabinet COSEF, portant la mention « Candidature au poste de Comptable »
            • Une lettre de motivation
            • Un curriculum vitae récent, détaillé, certifié sincère, daté et signé
            • Des copies certifiées conformes des diplômes
            • Des copies des certificats ou attestations de travail précisant les emplois, les fonctions exercées et leur durée
            • Une copie légalisée du certificat de nationalité et une copie certifiée de l'extrait d'acte de naissance (ou du jugement supplétif en tenant lieu)
            • Des références professionnelles vérifiables, ou toute pièce justifiant l'aptitude et l'expérience du candidat

            DÉPÔT DU DOSSIER
            Par courriel à recrutement@cosef.ne, ou au Cabinet COSEF, quartier Plateau, 468 rue des Dallols, Niamey (anciens locaux de COTECNA, non loin de la garde présidentielle).
            Tél. : 20 73 64 80

            Date limite : le mardi 20 octobre 2026 à 17h30.

            Avis enregistré auprès de l'Agence Nationale pour la Promotion de l'Emploi (ANPE Niamey).
            TEXTE,
            'missions' => <<<'TEXTE'
            Sous la supervision du Directeur Général, le ou la comptable aura pour missions d'assurer la tenue de la comptabilité générale et analytique, de gérer et comptabiliser les opérations liées au commerce, de garantir la fiabilité des comptes et le respect des règles fiscales et douanières, de produire les rapports financiers et d'assurer le suivi de la trésorerie et des opérations en devises.

            • Saisir et classer les pièces comptables (achats, ventes, banques, caisse)
            • Procéder à l'enregistrement des factures fournisseurs et clients
            • Comptabiliser les frais annexes au transport de marchandises : transit, douane, transport maritime et aérien, assurances
            • Assurer le suivi et l'analyse des dossiers de revient des marchandises importées (coût d'achat réel incluant le fret et les droits de douane)
            • Traiter les opérations en devises et le suivi des gains ou pertes de change
            • Assurer les règlements fournisseurs et le suivi des encaissements clients
            • Participer à la valorisation et au suivi des stocks de marchandises
            • Effectuer les rapprochements bancaires, y compris sur les comptes en devises et les crédits documentaires (Credoc)
            • Assurer le suivi des comptes tiers et relancer les impayés
            • Participer à l'élaboration du budget de la société
            • Élaborer les rapports périodiques internes et destinés à l'administration fiscale (DGI et autres)
            • Préparer les déclarations fiscales (TVA sur importations, etc.) et procéder aux clôtures fiscales
            • Assurer l'établissement de la liasse fiscale annuelle
            • Contribuer à l'établissement du bilan et du compte de résultat
            • Établir les états financiers de la société
            • Assurer le classement et l'archivage des documents comptables
            TEXTE,
            'profil_recherche' => <<<'TEXTE'
            • Diplôme de niveau DTS ou Licence (Bac+3) au minimum en comptabilité, finance, gestion ou formation équivalente
            • Trois (3) ans d'expérience au minimum à un poste similaire, au sein d'une société commerciale, de transit ou d'import-export
            • Bonne maîtrise des techniques comptables générales
            • Connaissance de la fiscalité et de la douane de l'import-export (Incoterms, TVA internationale)
            • Bonne connaissance de Word et Excel (bon niveau)
            • Bonne maîtrise du logiciel de comptabilité et de gestion SAGE SARI
            • Sens des responsabilités, rigueur, organisation et planification du travail
            • Discrétion et respect de la confidentialité des données financières
            • Bonne moralité : honnêteté intellectuelle et tenue de la parole donnée
            • Capacité à travailler en équipe
            • Être disponible immédiatement
            TEXTE,
            'type_contrat' => TypeContrat::Cdi->value,
            'secteur' => 'Banque, Assurance & Microfinance',
            'ville' => 'Niamey',
            'experience_requise' => '3 ans minimum à un poste similaire',
            'niveau_etude' => 'Bac+3 (DTS ou Licence)',
            'date_limite' => '2026-10-20',
        ]);
    }

    /**
     * Banque Atlantique — one reporting accountant, closing 23 October.
     *
     * An internal vacancy sheet rather than a press advert: it is laid out as
     * a job description, with reporting lines, a grade (C1-1) and separate
     * columns for technical and behavioural competencies.
     *
     * The sheet itself says only "une Banque de la place" — the employer is
     * named in the file the client sent, not in the notice. Filed under the
     * bank, since that is what the client called it.
     *
     * It gives no address and no email, only a closing date. Nothing is
     * invented to fill the gap: the listing says what the notice says, and a
     * candidate applies through the site.
     */
    private function banqueAtlantique(): void
    {
        $entreprise = $this->entreprise(
            nom: 'Banque Atlantique Niger',
            secteur: 'Banque, Assurance & Microfinance',
            description: 'Établissement bancaire de la place, membre d\'un groupe bancaire régional.',
        );

        $this->offre($entreprise, [
            'titre' => 'Chargé Reporting Comptable',
            'description' => <<<'TEXTE'
            Publication de poste vacant n° 05102026 — zone de publication : Niger.

            Direction financière et comptable. Catégorie : cadre, classification C1-1.
            Rattachement hiérarchique : Chef de Service Comptable. Responsable fonctionnel : Directeur Financier et Comptable, en lien avec toutes les directions de la banque.

            MISSION
            Contribuer à la production des états financiers du Holding et assurer le reporting aux entités concernées — Holding, autorités de tutelle et de contrôle — selon le cadre établi.

            DOSSIER DE CANDIDATURE
            • La copie scannée du ou des diplômes requis
            • Le curriculum vitae portant la mention « certifié sincère »

            Date de forclusion : 23 octobre 2026.

            Avis enregistré auprès de l'Agence Nationale pour la Promotion de l'Emploi (ANPE Niamey).
            TEXTE,
            'missions' => <<<'TEXTE'
            • Effectuer les reportings comptables et réglementaires : situations périodiques, FODEP et ratios prudentiels
            • Préparer les justificatifs et la documentation à remettre aux autorités de tutelle
            • Produire les statistiques et les tableaux de bord : réserves obligatoires, emplois et ressources APB, évolution des dépôts en banque, ratio de solvabilité et de liquidité
            • Assurer le suivi et l'analyse des comptes généraux
            • Assurer et saisir les pièces comptables de journées complémentaires et de déséquilibres, et imputer les bordereaux de mouvements comptables relatifs aux titres
            • Veiller au classement des états périodiques et au maintien de l'ordre dans la conservation de la documentation
            • Veiller au respect des échéances et des délais de reporting, notamment auprès de la Banque Centrale
            • Assurer le contrôle interne de premier niveau de ses activités, en conformité avec les règles du Groupe
            • Veiller à la transmission des informations afin d'assurer la continuité de l'activité du service
            • Assister et participer aux réunions du service et aux autres réunions selon les besoins du groupe
            TEXTE,
            'profil_recherche' => <<<'TEXTE'
            CONDITIONS D'ÉLIGIBILITÉ
            • Trois (3) ans d'expérience professionnelle au minimum dans une institution financière
            • Réunir les qualités minimales requises pour le poste

            FORMATION ET COMPÉTENCES TECHNIQUES
            • Bac+4/5 en comptabilité ou finance
            • Bonne connaissance du Groupe, de ses métiers et de son organisation
            • Bonne connaissance des normes comptables et de la réglementation
            • Bonne connaissance de la réglementation prudentielle
            • Bonne culture financière
            • Très bonne maîtrise des outils informatiques et bureautiques

            COMPÉTENCES COMPORTEMENTALES
            • Capacité à analyser et interpréter les chiffres
            • Rigueur, organisation, réactivité
            • Initiative et anticipation
            • Communication écrite et orale
            • Maîtrise de soi et résistance à la pression
            • Sens pédagogique et disponibilité
            • Intégrité, confidentialité, fiabilité
            TEXTE,
            'type_contrat' => TypeContrat::Cdi->value,
            'secteur' => 'Banque, Assurance & Microfinance',
            'ville' => 'Niamey',
            'experience_requise' => '3 ans minimum en institution financière',
            'niveau_etude' => 'Bac+4/5 en comptabilité ou finance',
            'date_limite' => '2026-10-23',
        ]);
    }

    /**
     * Pathfinder International — four drivers, one per region.
     *
     * The first advert that is not for one place: a post each in Niamey,
     * Maradi, Tahoua and Zinder. `ville` holds one value, so it carries Niamey
     * — where the office is, and what the regional filter will match — while
     * the title and the description name all four. Splitting it into four
     * listings would be closer to the data model and further from the notice,
     * which is one vacancy with four seats.
     *
     * Pathfinder's safeguarding policy and its encouragement of women
     * applicants are kept in full: an NGO publishes those as a condition of
     * employment, not as decoration.
     */
    private function pathfinder(): void
    {
        $entreprise = $this->entreprise(
            nom: 'Pathfinder International',
            secteur: 'Humanitaire & ONG',
            description: "Organisation internationale de santé. Pathfinder envisage un monde qui "
                ."valorise et investit dans le leadership, la santé et la résilience des femmes "
                ."et des filles, et catalyse des solutions durables, menées par des femmes et "
                ."ancrées localement.",
            telephone: '+227 20 37 26 26 / 80 08 44 44',
            siteWeb: 'https://www.pathfinder.org',
        );

        $this->offre($entreprise, [
            'titre' => 'Chauffeur — 4 postes (Niamey, Maradi, Tahoua, Zinder)',
            'description' => <<<'TEXTE'
            Pathfinder International recrute quatre (04) chauffeurs dans le cadre de la mise en œuvre de ses activités.

            LIEUX DE TRAVAIL
            Un poste à Niamey, un à Maradi, un à Tahoua et un à Zinder.

            RESPONSABILITÉS PRINCIPALES
            Les chauffeurs assurent le transport du personnel dans le cadre des missions et de toute autre activité nécessitant des déplacements en véhicule, dans les meilleures conditions de sécurité, de confort et de ponctualité. Ils veillent à l'entretien courant des véhicules qui leur sont assignés et au bon état des équipements, conformément aux procédures et normes établies par l'organisation. Les titulaires du poste devront assurer le strict respect du Code de la route en vigueur au Niger ainsi que des politiques et consignes de sécurité de Pathfinder International.

            DOSSIER DE CANDIDATURE
            • Une lettre de motivation
            • Un curriculum vitae actualisé comprenant trois (03) références professionnelles
            • Une photocopie légalisée du permis de conduire
            • Les copies des diplômes obtenus
            • Les copies des certificats ou attestations de travail justifiant l'expérience professionnelle

            Date limite de soumission : le 16 octobre 2026.

            SAUVEGARDE ET PROTECTION
            Pathfinder s'engage à assurer la sauvegarde et la protection des personnes qu'elle sert et de son personnel, et applique une tolérance zéro à l'égard de tout comportement susceptible de nuire aux enfants, aux jeunes, aux adultes, à son personnel et à ses partenaires — y compris les abus sexuels, le harcèlement, les brimades et l'exploitation. Cet emploi est soumis à une série de vérifications de sécurité, conformément à la législation en vigueur dans le pays où le candidat est recruté.

            Pathfinder International encourage vivement les candidatures féminines et est fière d'être un employeur ayant une action positive et d'égalité d'opportunité pour tous.

            Avis enregistré auprès de l'Agence Nationale pour la Promotion de l'Emploi (ANPE Niamey).
            TEXTE,
            'missions' => <<<'TEXTE'
            • Assurer le transport du personnel et des visiteurs dans le cadre des activités de l'organisation
            • Effectuer les courses administratives et autres déplacements logistiques nécessaires au fonctionnement du bureau
            • Tenir à jour les carnets de bord des véhicules et tous les outils de suivi requis
            • Veiller à ce que toutes les procédures requises soient respectées en cas d'accident ou d'incident impliquant le véhicule
            • Contrôler régulièrement l'état général du véhicule (huile, eau, batterie, freins, pneus) et signaler toute défectuosité mécanique
            • Effectuer les réparations mineures lorsque nécessaire et faciliter la réalisation des réparations majeures
            • Veiller à la propreté et au bon entretien du véhicule qui lui est confié
            • Respecter en tout temps les règles de sécurité routière et les procédures internes de Pathfinder International
            • Exécuter toute autre tâche confiée par son superviseur dans le cadre de ses fonctions
            TEXTE,
            'profil_recherche' => <<<'TEXTE'
            • Être titulaire d'un permis de conduire valide obtenu depuis au moins cinq (05) ans
            • Avoir au minimum le niveau de la classe de troisième (3e)
            • Justifier d'au moins cinq (05) années d'expérience professionnelle en qualité de chauffeur
            • Une expérience au sein d'une ONG internationale ou d'un organisme de développement constituera un atout
            • Avoir des connaissances de base en entretien et réparations mineures de véhicules
            • Faire preuve de disponibilité, de flexibilité, de discrétion et d'un bon sens du service
            • Avoir une aptitude à travailler en équipe dans un environnement multiculturel
            • Posséder des compétences de base en informatique
            TEXTE,
            'type_contrat' => TypeContrat::Cdd->value,
            'secteur' => 'Logistique & Transport',
            'ville' => 'Niamey',
            'experience_requise' => '5 ans minimum comme chauffeur',
            'niveau_etude' => 'Niveau classe de 3e',
            'date_limite' => '2026-10-16',
        ]);
    }

    /**
     * Complexe Scolaire Peralta — a librarian for the school's resource centre.
     *
     * A ten-month fixed term starting in October, which is the school year
     * rather than a probationary period, so the duration leads the description.
     *
     * The sheet lists its duties under eight numbered headings; they are kept
     * that way rather than flattened into one list, because the shape is the
     * job: a librarian who catalogues but runs no reading club has done half
     * of it.
     */
    private function peralta(): void
    {
        $entreprise = $this->entreprise(
            nom: 'Complexe Scolaire Peralta',
            secteur: 'Éducation & Formation',
            description: "Établissement bioclimatique et inclusif ouvert en octobre 2022, composé "
                ."d'une école primaire de six classes et d'un collège de quatre classes. Peralta "
                ."place l'inclusion, la mixité sociale et la réussite scolaire au cœur de son "
                ."projet éducatif : la moitié de ses élèves, sélectionnés dans les quartiers de "
                ."Goudel, Lossogoungou et Koubia sur des critères de vulnérabilité, bénéficient "
                ."d'une bourse complète.",
            siteWeb: 'https://www.peralta.org',
        );

        $this->offre($entreprise, [
            'titre' => 'Bibliothécaire et Animateur du Centre des Ressources Documentaires, Culturelles et Numériques',
            'description' => <<<'TEXTE'
            Référence de l'offre : Du 07/10/2026_BIB_04. Publiée le 07/10/2026, pour une prise de poste en octobre 2026.

            Contrat à durée déterminée de dix (10) mois. Un (1) poste, au Complexe Scolaire Peralta, Niamey.

            CONTEXTE DU POSTE
            Sous la supervision de la Direction, le ou la bibliothécaire et animateur·trice du Centre des Ressources Documentaires, Culturelles et Numériques assure la gestion de la bibliothèque et des ressources documentaires de l'établissement ainsi que de son espace numérique, en étroite coordination avec le ou la chargé·e TIC. Il ou elle accompagne les usagers en les conseillant, informant et orientant dans l'accès et l'utilisation des ressources documentaires et numériques, contribue au renforcement des compétences culturelles, informationnelles et numériques des élèves et des enseignants, et conçoit des activités d'animation éducative visant à promouvoir la lecture, développer la capacité de recherche d'information et encourager l'usage responsable des outils numériques.

            ENGAGEMENT EN MATIÈRE DE PROTECTION ET D'ÉTHIQUE
            Le Complexe Scolaire Peralta adopte une politique de tolérance zéro à l'égard de toute forme d'exploitation, d'abus et de harcèlement sexuels (EAS-H), et veille à ce que seules les personnes partageant ses valeurs d'intégrité, de respect et de protection des enfants soient recrutées. Tous les candidats feront l'objet de vérifications de références professionnelles et de contrôles conformes aux exigences légales, avant toute prise de fonction.

            POUR POSTULER
            CV, lettre de motivation et carte ANPE à jour sont à envoyer à contactecoleperalta@.org au plus tard le jeudi 15 octobre 2026.

            Les candidatures féminines sont fortement encouragées.

            Avis enregistré auprès de l'Agence Nationale pour la Promotion de l'Emploi (ANPE Niamey).
            TEXTE,
            'missions' => <<<'TEXTE'
            1. GESTION DE LA BIBLIOTHÈQUE ET DE L'ESPACE INFORMATIQUE
            • Veiller au bon fonctionnement de la bibliothèque et de son espace numérique
            • Administrer et développer le fonds documentaire : gérer, enrichir, répertorier et indexer la collection de livres, ressources documentaires, logiciels, applications et jeux informatiques
            • Assurer le catalogage et le classement des ouvrages
            • Organiser le prêt et le suivi des emprunts
            • Veiller à la conservation des ressources
            • Produire les statistiques d'utilisation de la bibliothèque
            • Formuler des propositions d'acquisition de nouveaux ouvrages

            2. PROMOTION DE LA LECTURE
            • Mettre en œuvre le programme « Un livre par mois »
            • Organiser les heures de lecture et développer la lecture plaisir
            • Organiser des défis lecture et des concours de lecture et de compréhension
            • Promouvoir la lecture à domicile avec l'appui des parents

            3. ÉDUCATION À LA RECHERCHE DOCUMENTAIRE
            • Former les élèves à la recherche documentaire et à l'esprit critique
            • Développer les capacités de vérification des sources
            • Accompagner les projets pédagogiques nécessitant des recherches documentaires
            • Assister les enseignants dans leurs projets de recherche

            4. DÉVELOPPEMENT DES COMPÉTENCES NUMÉRIQUES (en collaboration avec le responsable TIC)
            • Initier les élèves à la recherche en ligne et les accompagner dans l'utilisation des outils numériques
            • Sensibiliser à la citoyenneté numérique et à la cybersécurité
            • Participer aux activités d'initiation à l'intelligence artificielle et accompagner les élèves dans son utilisation responsable pour les apprentissages

            5. ANIMATION CULTURELLE
            • Assurer l'animation du Club Lecture en lien avec le professeur de français
            • Participer à l'encadrement du Journal Scolaire
            • Organiser des expositions thématiques, des journées littéraires et culturelles
            • Participer aux semaines thématiques de l'établissement et valoriser les productions des élèves
            • Organiser des ateliers thématiques favorisant la créativité, la lecture critique et l'utilisation responsable des ressources numériques
            • Encourager les projets collaboratifs entre élèves et enseignants

            6. APPUI AUX ENSEIGNANTS
            • Conseiller les enseignants dans le choix des ressources pédagogiques
            • Préparer des bibliographies thématiques et appuyer la pédagogie de projet
            • Contribuer aux activités interdisciplinaires et participer aux réunions pédagogiques

            7. PARTENARIATS ET OUVERTURE
            • Développer des partenariats avec les bibliothèques et centres culturels
            • Identifier des opportunités de dons d'ouvrages
            • Contribuer à la visibilité de Peralta dans les réseaux éducatifs et culturels
            TEXTE,
            'profil_recherche' => <<<'TEXTE'
            FORMATION
            • Diplôme en bibliothéconomie, sciences de l'information documentaire, sciences de l'éducation, lettres, documentation, communication ou domaine équivalent
            • Une formation complémentaire en gestion documentaire numérique, animation culturelle, technologies éducatives ou médiation documentaire constitue un atout
            • Une certification en informatique, technologies éducatives ou outils numériques est souhaitable

            EXPÉRIENCE PROFESSIONNELLE
            • Au moins deux (2) années d'expérience dans une bibliothèque, un centre de documentation, un établissement scolaire ou une structure culturelle
            • Expérience dans l'animation d'activités éducatives, culturelles ou de promotion de la lecture appréciée
            • Expérience de travail avec des enfants et adolescents fortement souhaitée

            COMPÉTENCES TECHNIQUES
            • Maîtrise des techniques de gestion documentaire, de classement, de catalogage et d'archivage
            • Bonne connaissance de la littérature jeunesse et des ressources documentaires adaptées aux différents niveaux scolaires
            • Maîtrise des outils bureautiques (Word, Excel, PowerPoint, Outlook)
            • Maîtrise des outils de recherche documentaire et des ressources numériques
            • Capacité à utiliser des plateformes numériques éducatives et collaboratives
            • Connaissance des principes de la citoyenneté numérique, de la sécurité numérique et de l'utilisation responsable de l'intelligence artificielle dans un contexte éducatif
            • Capacité à produire des rapports d'activités et des statistiques de fréquentation et d'utilisation

            COMPÉTENCES PÉDAGOGIQUES
            • Excellentes capacités relationnelles et sens de l'accueil
            • Goût prononcé pour la lecture et la transmission des connaissances
            • Sens de l'organisation, de la rigueur et de la méthode
            • Esprit d'initiative, créativité et innovation
            • Autonomie et capacité à travailler en équipe
            • Sens de la discrétion et du respect de la confidentialité
            • Forte adhésion aux valeurs éducatives du Complexe Scolaire Peralta
            • Intérêt marqué pour l'innovation pédagogique et l'amélioration continue
            TEXTE,
            'type_contrat' => TypeContrat::Cdd->value,
            'secteur' => 'Éducation & Formation',
            'ville' => 'Niamey',
            'experience_requise' => '2 ans minimum en bibliothèque ou centre de documentation',
            'niveau_etude' => 'Diplôme en bibliothéconomie ou domaine équivalent',
            'date_limite' => '2026-10-15',
        ]);
    }

    /**
     * ONG BEFEN — four drivers at Guidan Roumdji.
     *
     * A medical NGO, so the notice is as much about conduct as about driving:
     * who may ride in a vehicle, seatbelts, speed limits, the logbook, what to
     * do at checkpoints. Those are the job, not boilerplate, and they are kept
     * under the same headings the notice uses.
     *
     * The warning that BEFEN takes neither money nor sexual favours for
     * handling an application is reproduced exactly. A candidate who has been
     * asked for either needs to read that, and an alert address to write to.
     */
    private function befen(): void
    {
        $entreprise = $this->entreprise(
            nom: 'ONG BEFEN',
            secteur: 'Santé & Action sociale',
            description: "Bien Être de la Femme et de l'Enfant au Niger — ONG médicale créée en "
                ."2002 pour promouvoir le bien-être de la femme et de l'enfant dans les domaines "
                ."de la santé et de l'éducation. En partenariat avec l'ONG médicale internationale "
                ."ALIMA depuis 2009, BEFEN est devenue un acteur majeur de la prise en charge de "
                ."la malnutrition aiguë et des pathologies prioritaires de la mère et de l'enfant.",
            ville: 'Guidan Roumdji',
        );

        $this->offre($entreprise, [
            'titre' => 'Chauffeur — 4 postes (Guidan Roumdji)',
            'description' => <<<'TEXTE'
            Avis de recrutement n° 06/Chauffeur/COORDO/RH/202610. Quatre (04) postes, lieu d'affectation : Guidan Roumdji.

            VALEURS ET PRINCIPES
            BEFEN/ALIMA promeut et défend les principes des droits humains fondamentaux, et applique une tolérance zéro envers les personnes coupables d'actes de violences sexistes et sexuelles ainsi qu'envers l'inaction face à des faits de violence supposés ou avérés. La protection des personnes bénéficiant et impactées par nos interventions est notre priorité absolue. Toute personne collaborant avec BEFEN/ALIMA s'engage à respecter la charte, le code de conduite et les politiques institutionnelles — dont la politique de protection contre les abus de pouvoir et les violences sexistes et sexuelles, et la politique de prévention de la corruption et de la fraude — et à signaler toute violation à une référente, un référent, sa hiérarchie ou à l'adresse alert@alima.ngo.

            COMPOSITION DU DOSSIER
            • Lettre de motivation
            • Curriculum vitae avec au moins trois contacts mail et téléphoniques de personnes de référence
            • Copies des diplômes
            • Copie de l'extrait de naissance
            • Copie du certificat de nationalité
            • Certificat de résidence
            • Copie de la carte ANPE à jour
            • Casier judiciaire datant de moins de 3 mois
            • Attestations de travail
            • Tout autre document susceptible de compléter le dossier

            DÉPÔT DES DOSSIERS
            Aux bureaux de l'ONG BEFEN à :
            • Maradi, quartier ALI DAN SOFO, même alignement que l'ancien bureau Conseil Régional
            • Guidan Roumdji, quartier Dan Kalgo, ancienne base de MSF-WACA

            Clôture : le vendredi 23 octobre 2026 à 17h00.

            REMARQUES IMPORTANTES
            • Les dossiers incomplets ne seront pas traités
            • Aucun document original ne doit être mis dans le dossier
            • En cas de rejet d'une candidature, celle-ci ne pourra pas être récupérée
            • Numéro de contact et références obligatoires
            • Aucune information ne pourra être transmise quant au rejet d'une candidature, ni par téléphone ni par courriel, en raison du grand nombre de candidatures
            • Seules les candidatures présélectionnées seront contactées pour passer les tests

            NB : Dans le cadre de sa politique de lutte contre la fraude et les abus, BEFEN n'accepte pas d'argent, encore moins les faveurs sexuelles, pour le traitement de ses dossiers ; nous vous prions de dénoncer tout comportement allant dans ce sens.

            Avis enregistré auprès de la Direction Régionale ANPE Maradi.
            TEXTE,
            'missions' => <<<'TEXTE'
            A. CONDUITE ET SÉCURITÉ DES PASSAGERS ET DES BIENS
            • Veille à ce que seuls les chauffeurs BEFEN conduisent les véhicules BEFEN, et signale toute transgression à son référent hiérarchique
            • Veille à ne transporter que les personnes autorisées : le personnel BEFEN, les personnes travaillant temporairement pour BEFEN ou collaborant avec elle, et les personnes nécessitant une assistance médicale urgente avec l'autorisation préalable d'un responsable médical
            • S'assure que tous les passagers non BEFEN ont formellement rempli et signé la décharge de responsabilité
            • S'assure que tous les déplacements et le transport de personnes ou de biens non BEFEN ont été soumis à l'approbation du Coordinateur en service
            • Avant de démarrer, informe chaque passager que sa ceinture doit être attachée, à l'avant comme à l'arrière
            • Ne transporte jamais de passagers à l'arrière des pick-up, sauf en cas d'urgence et de manière exceptionnelle, sur autorisation préalable d'un Coordinateur médical ou logistique
            • Conduit prudemment, respecte le code de la route et les limitations de vitesse définies dans le Logbook, et adapte sa vitesse à l'approche des populations, selon l'état de la route, le chargement, l'état technique du véhicule et les conditions météorologiques
            • Veille à suivre toutes les règles de sécurité établies sur la Mission lors du passage de barrages, douanes et postes de contrôle
            • Ne fume en aucun cas dans les véhicules BEFEN, ni à proximité lors du transport de matériel inflammable, et veille à ce que les passagers en fassent de même

            B. ENTRETIEN DU VÉHICULE
            • S'assure de la présence à bord du Logbook, des décharges de responsabilité, d'une malle d'urgence complète, des outils (cric, sangles, cordes) et du matériel de réserve, et prévient immédiatement en cas de manque ou de dysfonctionnement
            • Sauvegarde son véhicule des risques d'accident et de vol, notamment en veillant à un stationnement sûr
            • Veille à avoir un véhicule toujours propre et en état de rouler, conformément au Logbook
            • Vérifie chaque matin l'état de l'équipement radio ou de son téléphone portable
            • Veille à ce que la malle mécanique et le kit désembourbé soient à bord en cas de sortie hors du périmètre défini
            • Effectue ou participe à tous les contrôles journaliers, hebdomadaires et périodiques prévus au Logbook
            • Vérifie la planification des entretiens périodiques et veille à ce que le véhicule arrive à l'heure
            • Met du carburant dès que le niveau est en dessous de la moitié du réservoir, et avant chaque week-end ou jour férié
            • Remplit le carnet d'approvisionnement de carburant et le remet chaque mois à son référent hiérarchique
            • Contrôle la fixation et la répartition de la charge, et charge et décharge lui-même son véhicule
            • Vérifie l'état de son véhicule lorsqu'il a été utilisé par un autre chauffeur

            C. ADMINISTRATION ET COMMUNICATION
            • Remplit et met à jour correctement le Logbook (kilométrage, reçus d'essence, services, réparations, accidents, incidents) et les décharges de responsabilité
            • Veille à avoir un permis de conduire valide, vérifie que le permis de circulation et les autres certificats sont à jour, et informe son référent dans les délais permettant leur renouvellement
            • Veille à ce que tous les mouvements soient communiqués — appel au départ, localisation, nombre et nom des passagers, destination, appel à l'arrivée — par lui-même à l'arrêt ou par un passager, et n'assure en aucun cas cette communication en conduisant
            • En tournée, remet les documents de transport aux destinataires, vérifie avec eux le bon état des marchandises livrées et ramène au logisticien les documents dûment complétés et signés
            • Reste toujours à proximité du véhicule et joignable ; s'il doit le quitter, veille à ce qu'un autre membre du personnel s'en occupe

            D. APPAREILS MÉCANIQUES
            • Veille à la maintenance des appareils mécaniques listés par le référent technique (véhicules, générateur) et en assure le contrôle journalier

            E. INFORMATION
            • Signale aux passagers toute nouvelle règle concernant la sécurité, notamment sur les lieux et routes autorisés ou non

            LIENS HIÉRARCHIQUES
            Rend compte au Responsable logistique ou au Coordinateur Projet, et collabore avec les autres départements du projet.
            TEXTE,
            'profil_recherche' => <<<'TEXTE'
            PROFIL RECHERCHÉ
            • Être titulaire d'un permis de conduire catégorie B, C ou D
            • Maîtriser le code de la route, la conduite en ville et hors agglomération
            • Avoir fait au moins les études du niveau élémentaire (le niveau supérieur est un atout)
            • Savoir lire, écrire et parler couramment le français
            • Expérience d'au moins un an de conduite avec une ONG (atout)
            • Capacité à travailler en autonomie
            • Flexibilité et capacité à travailler sous pression
            • Bonne moralité

            QUALITÉS DU CANDIDAT
            • Bonnes aptitudes en communication et en gestion d'équipe
            • Bonne organisation, capable d'évaluer les priorités
            • Pro-activité et initiative pour anticiper les problèmes et y remédier
            • Collaboratif et patient
            • Capacité d'analyse et d'organisation
            • Sens critique et force de proposition
            • Rigueur, diplomatie
            • Autonomie et curiosité
            • Flexibilité et gestion du stress
            • Capacité d'écoute importante
            • Capacité à travailler en équipe dans des contextes difficiles

            LANGUES
            • Bonne maîtrise du français (lu, écrit, parlé) indispensable
            • Parler au moins deux (2) langues du terroir
            TEXTE,
            'type_contrat' => TypeContrat::Cdd->value,
            'secteur' => 'Logistique & Transport',
            'ville' => 'Guidan Roumdji',
            'experience_requise' => '1 an de conduite avec une ONG (atout)',
            'niveau_etude' => 'Niveau élémentaire minimum',
            'date_limite' => '2026-10-23',
        ]);
    }

    /**
     * The company, and the recruiter account that owns it.
     *
     * An offer belongs to a company, and a company to a user: without the
     * account there is nobody to manage the posting from the recruiter space.
     */
    private function entreprise(
        string $nom,
        string $secteur,
        string $description,
        ?string $telephone = null,
        ?string $siteWeb = null,
        ?string $ville = 'Niamey',
    ): Entreprise {
        $slug = Str::slug($nom);

        $user = User::firstOrCreate(
            ['email' => "recrutement@{$slug}.ne"],
            [
                'name' => $nom,
                'password' => 'changeme',
                'role' => RoleUtilisateur::Recruteur,
                'statut' => 'actif',
            ],
        );

        return Entreprise::updateOrCreate(
            ['slug' => $slug],
            [
                'user_id' => $user->id,
                'nom' => $nom,
                'secteur' => $secteur,
                'description' => $description,
                'telephone' => $telephone,
                'site_web' => $siteWeb,
                'ville' => $ville,
                // Vouched for by the ANPE, which stamped the advert.
                'verifiee' => true,
            ],
        );
    }

    private function offre(Entreprise $entreprise, array $donnees): void
    {
        $slug = Str::slug($donnees['titre'].' '.$entreprise->nom);

        OffreEmploi::updateOrCreate(
            ['slug' => $slug],
            [
                ...$donnees,
                'entreprise_id' => $entreprise->id,
                'statut' => StatutOffre::Publiee->value,
                'publiee_le' => now(),
            ],
        );

        $this->command?->info("  {$donnees['titre']}  —  {$entreprise->nom}");
    }
}
