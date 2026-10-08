import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero, FeatureBar } from "@/components/shared";
import {
  pressStats,
  ArticlesSection,
  ResourcesSection,
  MediaMentionsSection,
  NewsletterCTA,
} from "@/components/presse";

export default function PressePage() {
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
        <FeatureBar items={pressStats} />
        <ArticlesSection />
        <ResourcesSection />
        <MediaMentionsSection />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
