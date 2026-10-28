"use client";

import { useParametres } from "@/lib/parametres";
import { contactInfo, type ContactInfoItem } from "./data";

/**
 * The contact details, with the organisation's own settings taking over.
 *
 * Shared by the list and the strip under the hero: the strip used to be
 * computed from the declarations at module load, so it kept showing the
 * address written into the source while the list below showed what the
 * organisers had actually entered.
 *
 * An entry with nothing behind it is dropped rather than shown empty.
 */
export function useCoordonnees(): ContactInfoItem[] {
  const { telephone, email, adresse } = useParametres();

  const valeurs: Record<string, string | null> = {
    "Téléphone": telephone,
    "Email": email,
    "Adresse": adresse,
  };

  return contactInfo
    .map((c) => ({ ...c, value: valeurs[c.title] ?? c.value }))
    .filter((c) => c.value !== "");
}
