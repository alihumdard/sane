"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type Reseau = "facebook" | "twitter" | "instagram" | "linkedin" | "youtube";

export interface ParametresSite {
  nom: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  site_web: string | null;
  logo_url: string | null;
  reseaux: Partial<Record<Reseau, string>>;
}

const VIDE: ParametresSite = {
  nom: null,
  email: null,
  telephone: null,
  adresse: null,
  site_web: null,
  logo_url: null,
  reseaux: {},
};

/**
 * The organisation's own details, as the public site needs them.
 *
 * The phone number, the address and the five social accounts used to be
 * written into the source — the number as `+227 XX XX XX XX` in three
 * separate files, the accounts as ten `href="#"` on every page. They belong
 * to whoever runs the salon, not to us, and they change without a release.
 *
 * Nothing here is required: a field that is empty is simply not rendered, so
 * the site is correct before anyone has filled the form in and stays correct
 * if this call never answers.
 */
export function useParametres(): ParametresSite {
  const [parametres, setParametres] = useState<ParametresSite>(VIDE);

  useEffect(() => {
    let annule = false;

    api
      .get<{ data: ParametresSite }>("/parametres")
      .then((r) => {
        if (!annule) setParametres({ ...VIDE, ...r.data, reseaux: r.data.reseaux ?? {} });
      })
      .catch(() => {
        // Nothing to show rather than something wrong.
      });

    return () => {
      annule = true;
    };
  }, []);

  return parametres;
}
