import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, FeatureBar } from "@/components/shared";
import {
  partnerStats,
  PartnerLogosSection,
  PartnerTypesSection,
  ImpactSection,
  TestimonialsSection,
} from "@/components/partenaires";

export default function PartenairesPage() {
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
          image="/partners hero.png"
          imageFit="banner"
          overlayStrength="light"
          actions={[
            { href: "/contact", label: "Devenir partenaire" },
            { href: "#partenaires", label: "Voir tous les partenaires", variant: "secondary" },
          ]}
          stats={[{ value: "+50", label: "partenaires actifs" }]}
        />
        <FeatureBar items={partnerStats} variant="plain" />
        <PartnerLogosSection />
        <PartnerTypesSection />
        <ImpactSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
