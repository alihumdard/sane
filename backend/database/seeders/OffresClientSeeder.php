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
