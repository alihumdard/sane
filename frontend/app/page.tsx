import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { AboutSection } from "@/components/sections/AboutSection";
import {
  JobsSection,
  type Choix,
  type OffreAccueil,
} from "@/components/sections/JobsSection";
import { lireApi } from "@/lib/serveur";
import type { ApiOffre } from "@/lib/types";
import { TrainingSection } from "@/components/sections/TrainingSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeatureLinksSection } from "@/components/sections/FeatureLinksSection";
import { CTASection } from "@/components/sections/CTASection";
/** The filter lists come alongside the offers, not from a separate call. */
async function lireFiltres(): Promise<{ secteur: Choix[]; ville: Choix[] }> {
  const vide = { secteur: [], ville: [] };

  try {
    const res = await fetch(
      `${process.env.API_INTERNE ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"}/offres?per_page=1`,
      { headers: { Accept: "application/json" }, cache: "no-store" }
    );

    if (!res.ok) return vide;

    const charge = (await res.json()) as { filtres?: { secteur?: Choix[]; ville?: Choix[] } };

    return { secteur: charge.filtres?.secteur ?? [], ville: charge.filtres?.ville ?? [] };
  } catch {
    return vide;
  }
}

export default async function Home() {
  // The four latest offers and the filters they carry, read while rendering.
  const offres = await lireApi<ApiOffre[]>("/offres?per_page=4", []);
  const filtres = await lireFiltres();

  const dernieres: OffreAccueil[] = offres.map((o) => ({
    titre: o.titre,
    slug: o.slug,
    entreprise: o.entreprise?.nom ?? "",
    ville: o.ville,
    contrat: o.type_contrat_label,
  }));

  return (
    <>
      <Header />

      <main>
        <Hero />

        <QuickActions />

        <CountdownSection />

        <AboutSection />

        <JobsSection offres={dernieres} secteurs={filtres.secteur} villes={filtres.ville} />

        <TrainingSection />

        <HowItWorksSection />

        <FeatureLinksSection />

        <CTASection />
        
      </main>

      <Footer />
    </>
  );
}