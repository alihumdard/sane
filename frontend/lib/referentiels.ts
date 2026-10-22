"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Referentiels {
  secteurs: string[];
  nationalites: Record<string, string[]>;
  villes: string[];
}

/**
 * Fallbacks for the lists the server owns.
 *
 * A form must be usable before /referentiels answers and if it never does:
 * behind a certificate the browser will not trust, or a proxy that eats the
 * call, an empty dropdown on a required field blocks the form for good.
 */
export const REPLI = {
  nationalite: {
    "Afrique de l'Ouest": ["Nigérienne", "Béninoise", "Burkinabè", "Cap-verdienne", "Gambienne", "Ghanéenne", "Guinéenne", "Bissau-guinéenne", "Ivoirienne", "Libérienne", "Malienne", "Mauritanienne", "Nigériane", "Sénégalaise", "Sierra-léonaise", "Togolaise"],
    "Afrique centrale": ["Camerounaise", "Centrafricaine", "Congolaise (RDC)", "Congolaise (Congo-Brazzaville)", "Gabonaise", "Tchadienne", "Équato-guinéenne", "Santoméenne"],
    "Afrique du Nord": ["Algérienne", "Égyptienne", "Libyenne", "Marocaine", "Soudanaise", "Tunisienne"],
    "Afrique de l'Est et australe": ["Burundaise", "Djiboutienne", "Éthiopienne", "Kényane", "Malgache", "Mozambicaine", "Ougandaise", "Rwandaise", "Somalienne", "Sud-africaine", "Tanzanienne", "Zambienne", "Zimbabwéenne"],
    "Europe": ["Allemande", "Belge", "Britannique", "Espagnole", "Française", "Italienne", "Néerlandaise", "Portugaise", "Suisse", "Russe", "Turque", "Ukrainienne"],
    "Asie et Moyen-Orient": ["Chinoise", "Coréenne", "Émiratie", "Indienne", "Indonésienne", "Japonaise", "Libanaise", "Malaisienne", "Pakistanaise", "Philippine", "Qatarienne", "Saoudienne", "Syrienne", "Vietnamienne"],
    "Amériques et Océanie": ["Américaine", "Argentine", "Australienne", "Brésilienne", "Canadienne", "Cubaine", "Mexicaine"],
    "Autre": ["Autre"],
  } as Record<string, string[]>,
  ville: ["Niamey", "Agadez", "Diffa", "Dosso", "Maradi", "Tahoua", "Tillabéri", "Zinder",
    "Arlit", "Birni-N'Konni", "Gaya", "Tessaoua", "Guidan Roumdji", "Madaoua", "Téra", "Autre"],
  secteur: ["Administration publique", "Agriculture & Élevage", "Artisanat",
    "Banque, Assurance & Microfinance", "BTP & Construction", "Commerce & Distribution",
    "Communication, Médias & Culture", "Eau & Assainissement", "Éducation & Formation",
    "Énergie", "Environnement & Développement durable", "Hôtellerie, Restauration & Tourisme",
    "Humanitaire & ONG", "Industrie & Agroalimentaire", "Informatique & Numérique",
    "Juridique & Conseil", "Logistique & Transport", "Mines & Pétrole",
    "Santé & Action sociale", "Sécurité & Défense", "Services aux entreprises",
    "Textile & Mode", "Autre"],
};

/** Diploma levels, shared by the registration form and the profile page. */
export const NIVEAUX_DIPLOME = [
  "Sans diplôme",
  "CAP / BEP",
  "Baccalauréat",
  "BTS / DUT",
  "Licence",
  "Master",
  "Doctorat",
  "Autre",
];

/** What a jobseeker is looking for, matched against a posting's contract type. */
export const TYPES_EMPLOI = ["CDI", "CDD", "Stage", "Alternance", "Consultant", "Freelance", "Autre"];

/**
 * The option lists the forms offer, from the server.
 *
 * Sectors and cities live on the server rather than in each form, so the
 * sector a jobseeker picks is spelled exactly like the sector a company picks
 * on a job posting — the matching engine compares them as text, and awards 30
 * of its 100 points for an exact match.
 */
export function useReferentiels() {
  const [listes, setListes] = useState({
    nationalite: REPLI.nationalite as string[] | Record<string, string[]>,
    ville: REPLI.ville,
    domaine: REPLI.secteur,
  });

  useEffect(() => {
    let annule = false;

    api
      .get<Referentiels>("/referentiels")
      .then((r) => {
        if (annule) return;

        setListes({
          nationalite: r.nationalites,
          ville: r.villes,
          domaine: r.secteurs,
        });
      })
      .catch(() => {
        // Keep the fallbacks: a short list still lets someone fill the form.
      });

    return () => {
      annule = true;
    };
  }, []);

  return listes;
}
