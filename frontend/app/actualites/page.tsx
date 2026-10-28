import type { Metadata } from "next";
import {
  ActualitesContenu,
  COULEUR_TAG,
  LIBELLE_TAG,
  type ArticleAffiche,
} from "@/components/actualites/ActualitesContenu";
import { lireApi } from "@/lib/serveur";
import type { ApiActualite } from "@/lib/types";

export const metadata: Metadata = {
  title: "Actualités — SANEM",
  description:
    "Les dernières nouvelles du Salon National de l'Emploi : annonces, partenariats, formations et temps forts de l'édition.",
};

export default async function ActualitesPage() {
  const articles = await lireApi<ApiActualite[]>("/actualites?per_page=30", []);

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

  return <ActualitesContenu initiaux={initiaux} />;
}
