"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { StatistiquesPubliques } from "@/lib/edition";

export type { StatistiquesPubliques } from "@/lib/edition";
export { datesEdition } from "@/lib/edition";

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

