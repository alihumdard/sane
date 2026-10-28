import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared";
import {

  ArticlesSection,
  ResourcesSection,
  MediaMentionsSection,
  NewsletterCTA,
} from "@/components/presse";
import { BarrePresse } from "@/components/shared/barres";
import { COULEUR_TYPE, LIBELLE_TYPE } from "@/components/presse/ArticlesSection";
import type { ArticleCardData } from "@/components/shared";
import { lireApi } from "@/lib/serveur";
import type { ApiArticlePresse } from "@/lib/types";

export default async function PressePage() {
  const records = await lireApi<ApiArticlePresse[]>("/presse", []);

  const articles: ArticleCardData[] = records.map((a) => ({
    image: "/sane-deal3.webp",
    date: new Date(a.date_publication).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    tag: LIBELLE_TYPE[a.type] ?? a.media,
    tagColor: COULEUR_TYPE[a.type] ?? "var(--sane-green)",
    title: a.titre,
    description: a.resume ?? "",
    // No media page and no file means no link at all.
    href: a.lien ?? a.fichier ?? undefined,
  }));

  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Presse"
          eyebrow="SALON NATIONAL DE L'EMPLOI"
          title="Espace Presse"
          lead="Toute l'actualité du SANEM, nos communiqués, nos événements et nos ressources médias."
          image="/press-hero.webp"
          mobileImage="/press-hero-sm.webp"
          imageFit="banner"
          overlayStrength="light"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Nous contacter", variant: "secondary" },
          ]}
        />
        <BarrePresse />
        <ArticlesSection initiaux={articles} />
        <ResourcesSection />
        <MediaMentionsSection />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
