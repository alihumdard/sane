import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { AboutSection, type ChiffresAccueil } from "@/components/sections/AboutSection";
import {
  JobsSection,
  type Choix,
  type OffreAccueil,
} from "@/components/sections/JobsSection";
import { lireApi } from "@/lib/serveur";
import { imageParDefaut, imagesParCategorie } from "@/components/formations/data";
import type { ApiFormation, ApiOffre } from "@/lib/types";
import type { StatistiquesPubliques } from "@/lib/edition";
import { TrainingSection, type FormationAccueil } from "@/components/sections/TrainingSection";
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
  /*
   * In parallel: each of these was awaited on its own line, so the page
   * waited out four round trips end to end before it could start rendering.
   */
  const [offres, filtres, stats, catalogue] = await Promise.all([
    lireApi<ApiOffre[]>("/offres?per_page=4", []),
    lireFiltres(),
    lireApi<StatistiquesPubliques | null>("/statistiques", null),
    lireApi<ApiFormation[]>("/formations?limite=3", []),
  ]);

  const dernieresFormations: FormationAccueil[] = catalogue.map((f) => ({
    titre: f.titre,
    slug: f.slug,
    duree: f.duree,
    places: f.complete ? "Complet" : `${f.places_restantes} places`,
    image: f.image ?? imagesParCategorie[f.categorie?.nom ?? ""] ?? imageParDefaut,
  }));

  const chiffres: ChiffresAccueil | null = stats
    ? {
        offres: stats.emploi.offres,
        entreprises: stats.emploi.entreprises,
        inscriptions: stats.participation.inscriptions,
        formations: stats.formations.total,
      }
    : null;

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

        <AboutSection chiffres={chiffres} />

        <JobsSection offres={dernieres} secteurs={filtres.secteur} villes={filtres.ville} />

        <TrainingSection formations={dernieresFormations} />

        <HowItWorksSection />

        <FeatureLinksSection />

        <CTASection />
        
      </main>

      <Footer />
    </>
  );
}