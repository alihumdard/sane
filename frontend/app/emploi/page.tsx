import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { EmploiHero, JobsGrid, PartnersSection, EmploiStepsSection } from "@/components/emploi";
import { BarreEmploi } from "@/components/shared/barres";

export default async function EmploiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; secteur?: string; ville?: string }>;
}) {
  const { q, secteur, ville } = await searchParams;

  return (
    <>
      <Header />
      <main>
        <EmploiHero />
        <BarreEmploi />
        <JobsGrid termeInitial={q ?? ""} secteurInitial={secteur ?? ""} villeInitiale={ville ?? ""} />
        <PartnersSection />
        <EmploiStepsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
