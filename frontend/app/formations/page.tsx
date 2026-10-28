import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import { FormationsExplorer, WhySection, StepsSection, FaqSection } from "@/components/formations";
import { BarreFormations } from "@/components/shared/barres";
import { lireApi } from "@/lib/serveur";
import type { StatistiquesPubliques } from "@/lib/edition";
import type { ApiFormation } from "@/lib/types";

export const metadata: Metadata = {
  title: "Formations – Salon National de l'Emploi",
  description:
    "Des formations pratiques et certifiantes pour renforcer l'employabilité des jeunes et développer les compétences au Niger.",
};

export default async function FormationsPage() {
  const [formations, stats] = await Promise.all([
    lireApi<ApiFormation[]>("/formations", []),
    lireApi<StatistiquesPubliques | null>("/statistiques", null),
  ]);

  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Formations"
          eyebrow="Salon National de l'Emploi"
          title="Formations du SANEM"
          lead="Développez vos compétences pour un meilleur avenir."
          description="Le SANEM propose des formations pratiques et adaptées aux besoins du marché du travail pour renforcer l'employabilité des jeunes et accompagner le développement des compétences au Niger."
          imageFit="banner"
          image="/formation-bg.webp"
          mobileImage="/formation-hero-sm.webp"
          tone="light"
          actions={[
            { href: "#catalogue", label: "Voir les formations" },
            { href: "/inscription", label: "S'inscrire à une formation", variant: "secondary" },
          ]}
          stats={
            stats
              ? [
                  { value: String(stats.formations.total), label: "Formations" },
                  { value: String(stats.formations.places), label: "Places" },
                  { value: String(stats.formations.formateurs), label: "Intervenants" },
                ]
              : []
          }
        />
        <BarreFormations />
        <FormationsExplorer initiaux={formations} />
        <WhySection />
        <StepsSection />
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
