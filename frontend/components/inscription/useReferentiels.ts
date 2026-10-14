"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { options, type Referentiels } from "./data";

/**
 * The option lists the registration form offers, from the server.
 *
 * Nationalities, cities and sectors live on the server rather than in this
 * file, so the sector a participant picks is spelled exactly like the sector a
 * company picks on a job posting — the matching engine compares them as text,
 * and awards 30 of its 100 points for an exact match.
 *
 * Starts from the short fallback lists in `data.ts` and replaces them once the
 * request answers: a required dropdown that is empty while a fetch is in
 * flight would block the registration, and a failed fetch would block it for
 * good.
 */
export function useReferentiels() {
  const [listes, setListes] = useState({
    nationalite: options.nationalite,
    ville: options.ville,
    domaine: options.domaine,
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
        // Keep the fallbacks: a short list still lets someone register.
      });

    return () => {
      annule = true;
    };
  }, []);

  return listes;
}
