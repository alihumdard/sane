import type { Metadata } from "next";
import {
  ActualitesContenu,
  COULEUR_TAG,
  LIBELLE_TAG,
  type ArticleAffiche,
  type EvenementAVenir,
} from "@/components/actualites/ActualitesContenu";
import type { JourProgramme } from "@/components/programme/ScheduleSection";
import { lireApi } from "@/lib/serveur";
import type { ApiActualite } from "@/lib/types";

export const metadata: Metadata = {
  title: "Actualités — SANEM",
  description:
    "Les dernières nouvelles du Salon National de l'Emploi : annonces, partenariats, formations et temps forts de l'édition.",
};

export default async function ActualitesPage() {
  const [articles, jours] = await Promise.all([
    lireApi<ApiActualite[]>("/actualites?per_page=30", []),
    lireApi<JourProgramme[]>("/programme", []),
  ]);

  /*
   * The sidebar's "Prochains événements": the next sessions of the schedule,
   * which the organisers keep up to date, rather than three written-in events
   * dated April 2024.
   */
  const aujourdhui = new Date().toISOString().slice(0, 10);

  const evenements: EvenementAVenir[] = jours
    .filter((j) => j.jour >= aujourdhui)
    .flatMap((j) =>
      j.sessions.map((session) => ({
        title: session.titre,
        date: new Date(j.jour).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        location: session.lieu ?? "",
      }))
    )
    .slice(0, 3);

  const initiaux: ArticleAffiche[] = articles.map((a) => ({
    slug: a.slug,
    image: a.image ?? "/sane_deal.webp",
    date: a.publiee_le
      ? new Date(a.publiee_le).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
      : "",
    tag: LIBELLE_TAG[a.categorie] ?? a.categorie,
    tagColor: COULEUR_TAG[a.categorie] ?? "var(--sane-green)",
    title: a.titre,
    description: a.extrait ?? "",
  }));

  return <ActualitesContenu initiaux={initiaux} evenements={evenements} />;
}
