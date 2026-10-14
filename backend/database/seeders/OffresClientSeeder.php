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
