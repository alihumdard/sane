import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import {
  VisionSection,
  MissionVisionValues,
  ImpactSection,
  ProjectSection,
  TeamSection,
} from "@/components/a-propos";
import { BarreAPropos } from "@/components/shared/barres";

import { lireApi } from "@/lib/serveur";

interface Statistiques {
  emploi: { offres: number; entreprises: number; secteurs: number };
  formations: { total: number; places: number; formateurs: number };
  participation: { inscriptions: number; partenaires: number };
  programme: { sessions: number; jours: number };
}


export default async function AProposPage() {
  // Counted, not invented: the badge used to read "+500 Opportunités".
  const stats = await lireApi<Statistiques | null>("/statistiques", null);

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
          stats={
            stats
              ? [
                  { value: String(stats.emploi.offres), label: "Offres publiées" },
                  { value: String(stats.emploi.entreprises), label: "Entreprises" },
                  { value: String(stats.participation.inscriptions), label: "Inscrits" },
                ]
              : []
          }
        />
        <BarreAPropos />
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
