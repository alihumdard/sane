<?php

namespace Database\Seeders;

use App\Models\Actualite;
use App\Models\ArticlePresse;
use App\Models\FaqEntree;
use App\Models\Partenaire;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Moves the editorial content the frontend hardcoded in its data.ts files
 * into the database, so the public pages render from the back office.
 */
class ContenuSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->actualites() as $i => $donnees) {
            Actualite::firstOrCreate(
                ['slug' => Str::slug($donnees['titre'])],
                [...$donnees, 'publiee' => true, 'publiee_le' => now()->subDays(($i + 1) * 3)],
            );
        }

        foreach ($this->faq() as $ordre => $entree) {
            FaqEntree::firstOrCreate(
                ['question' => $entree['question']],
                [...$entree, 'ordre' => $ordre, 'publiee' => true],
            );
        }

        foreach ($this->partenaires() as $ordre => $partenaire) {
            Partenaire::firstOrCreate(
                ['slug' => Str::slug($partenaire['nom'])],
                [...$partenaire, 'ordre' => $ordre, 'publie' => true],
            );
        }

        foreach ($this->presse() as $article) {
            ArticlePresse::firstOrCreate(
                ['titre' => $article['titre']],
                [...$article, 'publie' => true],
            );
        }
    }

    private function actualites(): array
    {
        return [
            [
                'titre' => 'Le SANEM 2026 ouvre ses inscriptions',
                'categorie' => 'communiques',
                'extrait' => "Les inscriptions au Salon National de l'Emploi 2026 sont désormais ouvertes à tous les demandeurs d'emploi et recruteurs.",
                'contenu' => "Les inscriptions au Salon National de l'Emploi 2026 sont ouvertes.\n\nL'événement se tiendra du 10 au 12 décembre 2026 à Niamey et réunira entreprises, institutions et demandeurs d'emploi autour d'un même objectif : favoriser l'insertion professionnelle au Niger.\n\nLa participation est entièrement gratuite, formations comprises.",
                'auteur' => "Comité d'organisation",
            ],
            [
                'titre' => 'Plus de 200 entreprises attendues à Niamey',
                'categorie' => 'evenements',
                'extrait' => 'Les secteurs du numérique, de la santé et de l\'agriculture seront fortement représentés.',
                'contenu' => "Plus de deux cents entreprises et institutions ont confirmé leur présence.\n\nLes secteurs les plus représentés sont le numérique, la santé, l'agriculture et les projets de développement. Chaque exposant disposera d'un espace dédié aux entretiens de recrutement.",
                'auteur' => "Comité d'organisation",
            ],
            [
                'titre' => 'Un programme de formations gratuites pour tous les participants',
                'categorie' => 'formations',
                'extrait' => 'Rédaction de CV, préparation aux entretiens, compétences numériques : les ateliers sont ouverts à tous.',
                'contenu' => "Le SANEM propose un programme de formations gratuites pendant les trois jours du salon.\n\nLes ateliers couvrent la rédaction de CV, la préparation aux entretiens d'embauche, les compétences numériques de base et la création d'entreprise. Les places étant limitées, l'inscription préalable est recommandée.",
                'auteur' => 'Équipe formations',
            ],
            [
                'titre' => "Partenariat avec le Ministère de l'Emploi",
                'categorie' => 'partenariats',
                'extrait' => "Le Ministère de l'Emploi et de la Formation Professionnelle soutient officiellement le salon.",
                'contenu' => "Le Ministère de l'Emploi et de la Formation Professionnelle apporte son soutien officiel au Salon National de l'Emploi.\n\nCe partenariat permettra d'articuler le salon avec les dispositifs nationaux d'insertion et de formation professionnelle.",
                'auteur' => "Comité d'organisation",
            ],
        ];
    }

    private function faq(): array
    {
        return [
            ['categorie' => 'generalites', 'question' => "Qu'est-ce que le SANEM ?", 'reponse' => "Le Salon National de l'Emploi (SANEM) est un événement national qui réunit demandeurs d'emploi, entreprises et institutions autour de l'insertion professionnelle au Niger."],
            ['categorie' => 'generalites', 'question' => 'Quand et où se tient le SANEM 2026 ?', 'reponse' => 'Le salon se tiendra du 10 au 12 décembre 2026 à Niamey.'],
            ['categorie' => 'inscriptions', 'question' => "L'inscription est-elle payante ?", 'reponse' => "Non. L'inscription au salon et la participation aux formations sont entièrement gratuites."],
            ['categorie' => 'inscriptions', 'question' => 'Comment puis-je m\'inscrire ?', 'reponse' => 'Rendez-vous sur la page Inscription et complétez le formulaire en quelques étapes. Vous recevrez un email de confirmation avec votre référence.'],
            ['categorie' => 'inscriptions', 'question' => 'Puis-je modifier mon inscription après validation ?', 'reponse' => "Contactez l'équipe d'organisation en rappelant votre référence d'inscription. Les modifications sont possibles tant que votre dossier n'a pas été validé."],
            ['categorie' => 'formations', 'question' => 'Combien de formations puis-je suivre ?', 'reponse' => 'Vous pouvez sélectionner jusqu\'à cinq formations, dans la limite des places disponibles.'],
            ['categorie' => 'formations', 'question' => 'Que se passe-t-il si une formation est complète ?', 'reponse' => 'Une formation complète ne peut plus être sélectionnée. Les places libérées par des annulations sont automatiquement remises à disposition.'],
            ['categorie' => 'emploi', 'question' => 'Comment postuler à une offre ?', 'reponse' => "Créez un compte demandeur d'emploi, complétez votre profil, déposez votre CV puis postulez directement depuis la page de l'offre."],
            ['categorie' => 'emploi', 'question' => 'Mon profil est-il visible par les recruteurs ?', 'reponse' => "Uniquement si vous l'activez. Vos coordonnées ne sont communiquées à une entreprise que lorsque vous postulez à l'une de ses offres."],
            ['categorie' => 'entreprises', 'question' => 'Comment publier une offre d\'emploi ?', 'reponse' => 'Créez un compte recruteur et renseignez le profil de votre entreprise. Après vérification par les organisateurs, vous pourrez publier vos offres.'],
        ];
    }

    private function partenaires(): array
    {
        return [
            ['nom' => 'République du Niger', 'type' => 'institutionnel', 'logo' => '/niger_ministere_emploi.png', 'description' => "Ministère de l'Emploi et de la Formation Professionnelle."],
            ['nom' => 'Organisation Internationale du Travail', 'type' => 'institutionnel', 'logo' => '/organisation_internationale_travail.png', 'description' => 'Agence des Nations Unies pour le monde du travail.'],
            ['nom' => 'Enabel', 'type' => 'partenaire', 'logo' => '/enabel.png', 'description' => 'Agence belge de développement.'],
            ['nom' => 'GIZ', 'type' => 'partenaire', 'logo' => '/giz.png', 'description' => 'Coopération allemande au développement.'],
            ['nom' => 'AFD', 'type' => 'partenaire', 'logo' => '/afd.png', 'description' => 'Agence française de développement.'],
        ];
    }

    private function presse(): array
    {
        return [
            ['titre' => 'Dossier de presse — SANEM 2026', 'media' => 'SANEM', 'type' => 'dossier', 'date_publication' => now()->subDays(30)->toDateString(), 'resume' => "Présentation complète de l'événement, du programme et des partenaires."],
            ['titre' => "Le Niger lance son premier Salon National de l'Emploi", 'media' => 'ANP', 'type' => 'article', 'date_publication' => now()->subDays(20)->toDateString(), 'resume' => "L'Agence Nigérienne de Presse revient sur le lancement du salon."],
            ['titre' => 'Communiqué : ouverture des inscriptions', 'media' => 'SANEM', 'type' => 'communique', 'date_publication' => now()->subDays(10)->toDateString(), 'resume' => 'Les inscriptions sont ouvertes à tous les publics.'],
        ];
    }
}
