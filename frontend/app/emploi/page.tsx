import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { EmploiHero, JobsGrid, PartnersSection, EmploiStepsSection } from "@/components/emploi";
import { BarreEmploi } from "@/components/shared/barres";
import type { PartenairePublic } from "@/components/emploi/PartnersSection";
import { lireApi } from "@/lib/serveur";

export default async function EmploiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; secteur?: string; ville?: string }>;
}) {
  const { q, secteur, ville } = await searchParams;
  const partenaires = await lireApi<PartenairePublic[]>("/partenaires", []);

  return (
    <>
      <Header />
      <main>
        <EmploiHero />
        <BarreEmploi />
        <JobsGrid termeInitial={q ?? ""} secteurInitial={secteur ?? ""} villeInitiale={ville ?? ""} />
        <PartnersSection partenaires={partenaires} />
        <EmploiStepsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
