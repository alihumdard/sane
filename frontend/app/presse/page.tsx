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
        <BarrePresse />
        <ArticlesSection />
        <ResourcesSection />
        <MediaMentionsSection />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
