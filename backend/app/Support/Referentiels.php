<?php

namespace App\Support;

/**
 * The option lists the forms offer: sectors, nationalities, cities.
 *
 * These are reference data, not enums: the columns behind them are plain text
 * and already hold values entered before the lists grew, so a case the server
 * refuses would make an existing registration unsavable. They are published
 * through /referentiels instead, and the forms read them from there — one
 * source, so a sector offered on a registration form is spelled exactly as the
 * one offered on a job posting.
 *
 * That spelling matters beyond tidiness: MoteurMatching awards 30 of its 100
 * points for an exact sector match, the single largest weight. While the
 * registration form said "Informatique et numérique" and the job form said
 * "Informatique & Digital", every such pair scored zero.
 */
final class Referentiels
{
    /**
     * Sectors of activity, shared by registrations, companies, jobseeker
     * profiles and job offers.
     *
     * Chosen for Niger's economy rather than a generic list: mining and oil,
     * livestock and crafts employ more people here than they would elsewhere,
     * and the NGO sector is a major employer in Niamey.
     */
    public const SECTEURS = [
        'Administration publique',
        'Agriculture & Élevage',
        'Artisanat',
        'Banque, Assurance & Microfinance',
        'BTP & Construction',
        'Commerce & Distribution',
        'Communication, Médias & Culture',
        'Eau & Assainissement',
        'Éducation & Formation',
        'Énergie',
        'Environnement & Développement durable',
        'Hôtellerie, Restauration & Tourisme',
        'Humanitaire & ONG',
        'Industrie & Agroalimentaire',
        'Informatique & Numérique',
        'Juridique & Conseil',
        'Logistique & Transport',
        'Mines & Pétrole',
        'Santé & Action sociale',
        'Sécurité & Défense',
        'Services aux entreprises',
        'Textile & Mode',
        'Autre',
    ];

    /**
     * Nationalities, grouped so a list this long stays usable in a dropdown.
     *
     * West Africa first, Niger at its head: the fair is national, and the
     * overwhelming majority of participants are Nigerien or from the region.
     * Europe and Asia follow because the partners exhibiting — GIZ, PNUD, the
     * World Bank, Enabel — bring staff from outside the continent, and until
     * now every one of them had to answer "Autre".
     */
    public const NATIONALITES = [
        "Afrique de l'Ouest" => [
            'Nigérienne',
            'Béninoise',
            'Burkinabè',
            'Cap-verdienne',
            'Gambienne',
            'Ghanéenne',
            'Guinéenne',
            'Bissau-guinéenne',
            'Ivoirienne',
            'Libérienne',
            'Malienne',
            'Mauritanienne',
            'Nigériane',
            'Sénégalaise',
            'Sierra-léonaise',
            'Togolaise',
        ],
        'Afrique centrale' => [
            'Camerounaise',
            'Centrafricaine',
            'Congolaise (RDC)',
            'Congolaise (Congo-Brazzaville)',
            'Gabonaise',
            'Tchadienne',
            'Équato-guinéenne',
            'Santoméenne',
        ],
        'Afrique du Nord' => [
            'Algérienne',
            'Égyptienne',
            'Libyenne',
            'Marocaine',
            'Soudanaise',
            'Tunisienne',
        ],
        "Afrique de l'Est et australe" => [
            'Burundaise',
            'Djiboutienne',
            'Éthiopienne',
            'Kényane',
            'Malgache',
            'Mozambicaine',
            'Ougandaise',
            'Rwandaise',
            'Somalienne',
            'Sud-africaine',
            'Tanzanienne',
            'Zambienne',
            'Zimbabwéenne',
        ],
        'Europe' => [
            'Allemande',
            'Belge',
            'Britannique',
            'Espagnole',
            'Française',
            'Italienne',
            'Néerlandaise',
            'Portugaise',
            'Suisse',
            'Russe',
            'Turque',
            'Ukrainienne',
        ],
        'Asie et Moyen-Orient' => [
            'Chinoise',
            'Coréenne',
            'Émiratie',
            'Indienne',
            'Indonésienne',
            'Japonaise',
            'Libanaise',
            'Malaisienne',
            'Pakistanaise',
            'Philippine',
            'Qatarienne',
            'Saoudienne',
            'Syrienne',
            'Vietnamienne',
        ],
        'Amériques et Océanie' => [
            'Américaine',
            'Argentine',
            'Australienne',
            'Brésilienne',
            'Canadienne',
            'Cubaine',
            'Mexicaine',
        ],
        'Autre' => [
            'Autre',
        ],
    ];

    /** Niger's regional capitals, plus the communes a participant may come from. */
    public const VILLES = [
        'Niamey',
        'Agadez',
        'Diffa',
        'Dosso',
        'Maradi',
        'Tahoua',
        'Tillabéri',
        'Zinder',
        'Arlit',
        'Birni-N\'Konni',
        'Gaya',
        'Tessaoua',
        'Autre',
    ];

    /** Flat list of every nationality, for anything that does not group them. */
    public static function nationalites(): array
    {
        return array_merge(...array_values(self::NATIONALITES));
    }
}
