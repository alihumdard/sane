"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface StatistiquesPubliques {
  edition: {
    annee: number;
    nom: string | null;
    date_debut: string | null;
    date_fin: string | null;
    lieu: string | null;
  } | null;
  emploi: { offres: number; entreprises: number; secteurs: number };
  formations: { total: number; places: number; formateurs: number };
  programme: { sessions: number; jours: number };
  participation: { inscriptions: number; partenaires: number };
  presse: { articles: number; medias: number };
  faq: { questions: number; categories: number };
}

/**
 * The figures the public pages print under their headings.
 *
 * They were written into the source: "+500 Offres d'emploi" and "+200
 * Entreprises" beside twelve real offers, "+0 Postes" and "+0 Secteurs" that
 * looked live and sat at zero, "+48" press mentions against four records.
 * A visitor reads one of those and either believes it or notices the zero.
 *
 * Null until the call answers, and the components render nothing in its
 * place — a counter is worth showing late, never worth inventing.
 */
export function useStatistiques(): StatistiquesPubliques | null {
  const [stats, setStats] = useState<StatistiquesPubliques | null>(null);

  useEffect(() => {
    let annule = false;

    api
      .get<{ data: StatistiquesPubliques }>("/statistiques")
      .then((r) => {
        if (!annule) setStats(r.data);
      })
      .catch(() => {
        // Nothing rather than a number nobody counted.
      });

    return () => {
      annule = true;
    };
  }, []);

  return stats;
}

/** "10 – 12 décembre 2026", from the edition rather than from three files. */
export function datesEdition(stats: StatistiquesPubliques | null): string {
  const debut = stats?.edition?.date_debut;
  const fin = stats?.edition?.date_fin;

  if (!debut || !fin) return "";

  const d = new Date(debut);
  const f = new Date(fin);
  const mois = f.toLocaleDateString("fr-FR", { month: "long" });

  // Same month, which it always is for a three-day fair: "10 – 12 décembre".
  return d.getMonth() === f.getMonth()
    ? `${d.getDate()} – ${f.getDate()} ${mois} ${f.getFullYear()}`
    : `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${f.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}
