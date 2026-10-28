import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import {

  PartnerLogosSection,
  PartnerTypesSection,
  ImpactSection,
  TestimonialsSection,
} from "@/components/partenaires";
import { BarrePartenaires } from "@/components/shared/barres";
import type { ApiPartenaire } from "@/components/partenaires/PartnerLogosSection";
import { lireApi } from "@/lib/serveur";

export default async function PartenairesPage() {
  const partenaires = await lireApi<ApiPartenaire[]>("/partenaires", []);

  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Partenaires"
          eyebrow="Réseau de partenaires"
          title={
            <>
              Nos <span className="text-[var(--sane-orange)]">Partenaires</span>
            </>
          }
          lead="Ensemble pour l'emploi de demain."
          description="Le SANEM réunit institutions publiques, entreprises privées, organisations internationales et société civile autour d'un objectif commun : promouvoir l'emploi au Niger."
          image="/Partenaires-hero.webp"
          mobileImage="/partenaires-hero-sm.webp"
          mobileImagePosition="90% center"
          imageFit="banner"
          overlayStrength="light"
          actions={[
            { href: "/contact", label: "Devenir partenaire" },
            { href: "#partenaires", label: "Voir tous les partenaires", variant: "secondary" },
          ]}
          stats={[{ value: "+50", label: "partenaires actifs" }]}
        />
        <BarrePartenaires />
        <PartnerLogosSection initiaux={partenaires} />
        <PartnerTypesSection />
        <ImpactSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
