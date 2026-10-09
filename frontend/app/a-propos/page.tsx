import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, InfoBar } from "@/components/shared";
import {
  aboutInfo,
  VisionSection,
  MissionVisionValues,
  ImpactSection,
  ProjectSection,
  TeamSection,
} from "@/components/a-propos";

export default function AProposPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="À propos"
          eyebrow="Salon National de l'Emploi"
          title="À propos du SANEM"
          lead="Un engagement national pour l'emploi, les compétences et un Niger plus fort."
          description="Le Salon National de l'Emploi (SANEM) est un espace de rencontre entre les talents, les entreprises, les institutions et les opportunités, au service du développement socio-économique du Niger."
          imageFit="banner"
          image="/hero-about.webp"
          mobileImage="/propos-hero-sm.webp"
          actions={[
            { href: "/inscription", label: "Participer au SANEM" },
            { href: "/programme", label: "Découvrir le programme", variant: "secondary" },
          ]}
          stats={[
            { value: "+500", label: "Opportunités" },
            { value: "+100", label: "Entreprises" },
            { value: "+1000", label: "Participants" },
          ]}
        />
        <InfoBar items={aboutInfo} />
        <VisionSection />
        <MissionVisionValues />
        <ImpactSection />
        <ProjectSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
