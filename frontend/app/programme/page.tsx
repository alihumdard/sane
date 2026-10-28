import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, InfoBar } from "@/components/shared";
import { ScheduleSection, VenueSection, DocumentsSection, infosEvenement } from "@/components/programme";
import type { JourProgramme } from "@/components/programme/ScheduleSection";
import { lireApi } from "@/lib/serveur";
import { datesEdition } from "@/lib/edition";

interface Statistiques {
  edition: { date_debut: string | null; date_fin: string | null; lieu: string | null } | null;
  emploi: { offres: number; entreprises: number; secteurs: number };
  formations: { total: number; places: number; formateurs: number };
  participation: { inscriptions: number; partenaires: number };
  programme: { sessions: number; jours: number };
}


export default async function ProgrammePage() {
  const [jours, stats] = await Promise.all([
    lireApi<JourProgramme[]>("/programme", []),
    lireApi<Statistiques | null>("/statistiques", null),
  ]);

  const dates = datesEdition(stats?.edition);
  const lieu = stats?.edition?.lieu ?? null;

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
          image="/programe-hero.webp"
          mobileImage="/programe-hero-sm.webp"
          actions={[
            { href: "/inscription", label: "S'inscrire au SANEM" },
            { href: "#programme", label: "Voir le programme", variant: "secondary" },
          ]}
          stats={
            stats
              ? [
                  { value: String(stats.programme.sessions), label: "Sessions" },
                  { value: String(stats.formations.formateurs), label: "Intervenants" },
                  {
                    value: String(stats.programme.jours),
                    label: stats.programme.jours > 1 ? "Journées" : "Journée",
                  },
                ]
              : []
          }
        />
        <InfoBar
          items={infosEvenement({
            dates,
            lieu,
            inscriptions: stats?.participation.inscriptions ?? 0,
            sessions: stats?.programme.sessions ?? 0,
            jours: stats?.programme.jours ?? 0,
          })}
        />
        <ScheduleSection initiaux={jours} />
        <CTASection />
        <VenueSection dates={dates} lieu={lieu} />
        <DocumentsSection />
      </main>
      <Footer />
    </>
  );
}
