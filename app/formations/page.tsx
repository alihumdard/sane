import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, InfoBar } from "@/components/shared";
import { FormationsExplorer, WhySection, StepsSection, FaqSection, formationInfo } from "@/components/formations";

export const metadata: Metadata = {
  title: "Formations – Salon National de l'Emploi",
  description:
    "Des formations pratiques et certifiantes pour renforcer l'employabilité des jeunes et développer les compétences au Niger.",
};

export default function FormationsPage() {
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
          tone="light"
          actions={[
            { href: "#catalogue", label: "Voir les formations" },
            { href: "/inscription", label: "S'inscrire à une formation", variant: "secondary" },
          ]}
        />
        <InfoBar items={formationInfo} />
        <FormationsExplorer />
        <WhySection />
        <StepsSection />
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
