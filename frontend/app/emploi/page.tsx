import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { EmploiHero, JobsGrid, PartnersSection, EmploiStepsSection } from "@/components/emploi";
import { BarreEmploi } from "@/components/shared/barres";
import type { PartenairePublic } from "@/components/emploi/PartnersSection";
import type { OffresResponse } from "@/lib/types";
import { lireApi } from "@/lib/serveur";

/** The whole payload, not just `data`: the filter lists and the total ride along. */
async function lireOffres(requete: string): Promise<OffresResponse | undefined> {
  const base = process.env.API_INTERNE ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

  try {
    const res = await fetch(`${base}/offres${requete ? `?${requete}` : ""}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return undefined;

    return (await res.json()) as OffresResponse;
  } catch {
    // The grid falls back to fetching from the browser.
    return undefined;
  }
}

export default async function EmploiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; secteur?: string; ville?: string }>;
}) {
  const { q, secteur, ville } = await searchParams;

  /*
   * The first page of results matches whatever the search box handed over, so
   * what the HTML carries is what the visitor asked for — not a default list
   * the browser then replaces.
   */
  const requete = new URLSearchParams();
  if (q) requete.set("q", q);
  if (secteur) requete.set("secteur", secteur);
  if (ville) requete.set("ville", ville);

  const [partenaires, offres] = await Promise.all([
    lireApi<PartenairePublic[]>("/partenaires", []),
    lireOffres(requete.toString()),
  ]);

  return (
    <>
      <Header />
      <main>
        <EmploiHero />
        <BarreEmploi />
        <JobsGrid
          termeInitial={q ?? ""}
          secteurInitial={secteur ?? ""}
          villeInitiale={ville ?? ""}
          initiales={offres}
        />
        <PartnersSection partenaires={partenaires} />
        <EmploiStepsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
