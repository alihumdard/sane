/**
 * The public figures and the edition they belong to, without React.
 *
 * `useStatistiques` lives next door in a client module; the pages that read
 * the statistics while rendering need the shape and the date formatting on
 * the server, and importing them from a `"use client"` module fails the
 * build: "Attempted to call datesEdition() from the server".
 */
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
 * "10 – 12 décembre 2026", from the edition rather than from three files.
 *
 * Takes the edition alone rather than the whole payload, so a page that reads
 * the statistics on the server — and declares only the fields it uses — can
 * format the dates without restating the entire response shape.
 */
export function datesEdition(
  edition: { date_debut: string | null; date_fin: string | null } | null | undefined
): string {
  const debut = edition?.date_debut;
  const fin = edition?.date_fin;

  if (!debut || !fin) return "";

  const d = new Date(debut);
  const f = new Date(fin);
  const mois = f.toLocaleDateString("fr-FR", { month: "long" });

  // Same month, which it always is for a three-day fair: "10 – 12 décembre".
  return d.getMonth() === f.getMonth()
    ? `${d.getDate()} – ${f.getDate()} ${mois} ${f.getFullYear()}`
    : `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${f.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}
