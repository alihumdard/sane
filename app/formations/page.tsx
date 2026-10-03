import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, InfoBar } from "@/components/shared";
import { FormationsGrid, WhySection, StepsSection, FaqSection, formationInfo } from "@/components/formations";

export default function FormationsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Formations"
          eyebrow="Salon National de l'Emploi"
          title="Formations du SANE"
          lead="Développez vos compétences pour un meilleur avenir."
          description="Le SANE propose des formations pratiques et adaptées aux besoins du marché du travail pour renforcer l'employabilité des jeunes et accompagner le développement des compétences au Niger."
          image="/formation-bg.png"
          tone="light"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/inscription", label: "S'inscrire à une formation", variant: "secondary" },
          ]}
        />
        <InfoBar items={formationInfo} />
        <FormationsGrid />
        <WhySection />
        <StepsSection />
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
