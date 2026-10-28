"use client";

import type { LucideIcon } from "lucide-react";
import { FeatureBar } from "./FeatureBar";
import { InfoBar } from "./InfoBar";
import { useStatistiques, type StatistiquesPubliques } from "@/lib/statistiques";

export interface Compteur {
  icon: LucideIcon;
  label: string;
  /** Read from the live figures; return null to leave the tile out. */
  valeur: (s: StatistiquesPubliques) => number | string | null;
}

/**
 * A strip of counters, from what is actually in the database.
 *
 * Every page used to carry its own written-in numbers — "+500 Offres
 * d'emploi" above twelve real offers, "+0 Postes à pourvoir" beside them.
 * Nothing is rendered until the figures arrive, and a tile whose value comes
 * back null is dropped rather than shown as zero.
 */
export function BarreStatistiques({
  compteurs,
  variant,
  forme = "feature",
}: {
  compteurs: Compteur[];
  variant?: "soft" | "solid" | "plain";
  /** The two strips the pages already use; same counters, different chrome. */
  forme?: "feature" | "info";
}) {
  const stats = useStatistiques();

  if (!stats) return null;

  const retenus = compteurs
    .map((c) => ({ icon: c.icon, label: c.label, valeur: c.valeur(stats) }))
    .filter((c) => c.valeur !== null && c.valeur !== "");

  if (retenus.length === 0) return null;

  if (forme === "info") {
    return (
      <InfoBar
        items={retenus.map((c) => ({ icon: c.icon, title: c.label, description: String(c.valeur) }))}
      />
    );
  }

  return (
    <FeatureBar
      items={retenus.map((c) => ({ icon: c.icon, label: c.label, value: String(c.valeur) }))}
      variant={variant}
    />
  );
}
