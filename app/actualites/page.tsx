import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import { ActualitesExplorer } from "@/components/actualites";

export default function ActualitesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Actualités"
          eyebrow="Salon National de l'Emploi"
          title="Actualités du SANE"
          lead="Restez informé des dernières nouvelles."
          description="Découvrez nos actualités, annonces, événements et initiatives autour de l'emploi, de la formation et du développement des compétences au Niger."
          image="/sane_deal.png"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Nous contacter", variant: "secondary" },
          ]}
        />
        <ActualitesExplorer />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
