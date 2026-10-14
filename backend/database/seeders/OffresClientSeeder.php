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
