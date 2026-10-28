"use client";

import { useStatistiques, datesEdition } from "@/lib/statistiques";

/**
 * The event's dates, from the edition the organisers marked active.
 *
 * They were written into three separate files as "10- 12 décembre 2026" —
 * hyphen glued to the first number, space on the wrong side — so moving the
 * salon by a day meant finding all three.
 *
 * `repli` is what shows until the figures arrive, and if they never do.
 */
export function DatesSalon({ repli = "" }: { repli?: string }) {
  const dates = datesEdition(useStatistiques()?.edition);

  return <>{dates || repli}</>;
}

/** The venue, from the same edition. */
export function LieuSalon({ repli = "Niamey, Niger" }: { repli?: string }) {
  const stats = useStatistiques();

  return <>{stats?.edition?.lieu || repli}</>;
}
