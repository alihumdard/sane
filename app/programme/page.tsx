import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, InfoBar } from "@/components/shared";
import { ScheduleSection, VenueSection, DocumentsSection, eventInfo } from "@/components/programme";

export default function ProgrammePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Programme"
          eyebrow="Salon National de l'Emploi"
          title="Programme du SANEM"
          lead="Des échanges, des formations et des rencontres pour construire l'avenir de l'emploi au Niger."
          description="Découvrez le programme conçu par le Salon National de l'Emploi pour inspirer, former et connecter les talents, les entreprises et les institutions engagées pour l'emploi au Niger."
          imageFit="banner"
          image="/programe-hero.png"
          actions={[
            { href: "/inscription", label: "S'inscrire au SANEM" },
            { href: "#programme", label: "Voir le programme", variant: "secondary" },
          ]}
          stats={[
            { value: "8", label: "Sessions" },
            { value: "+20", label: "Intervenants" },
            { value: "1", label: "Journée" },
          ]}
        />
        <InfoBar items={eventInfo} />
        <ScheduleSection />
        <CTASection />
        <VenueSection />
        <DocumentsSection />
      </main>
      <Footer />
    </>
  );
}
