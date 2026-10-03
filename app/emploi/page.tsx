import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, InfoBar } from "@/components/shared";
import { JobsGrid, PartnersSection, EmploiStepsSection, emploiInfo } from "@/components/emploi";

export default function EmploiPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Emploi"
          eyebrow="Salon National de l'Emploi"
          title="Trouvez une opportunité d'emploi"
          lead="Des offres d'emploi réelles pour les talents nigériens."
          description="Connectez-vous aux entreprises, institutions et organisations qui recrutent au Niger. Parcourez les offres et postulez en quelques clics."
          image="/sane_deal.png"
          tone="dark"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/inscription", label: "Créer mon profil", variant: "secondary" },
          ]}
        />
        <InfoBar items={emploiInfo} />
        <JobsGrid />
        <PartnersSection />
        <EmploiStepsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
