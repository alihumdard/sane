import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OffreDetail } from "@/components/emploi/OffreDetail";
import type { ApiOffre } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/**
 * Fetched on the server so the page is indexable and reaches the visitor as
 * rendered HTML. Job posts change rarely, so the response is cached briefly:
 * a burst of traffic on one offer hits the cache rather than the database.
 */
async function getOffre(slug: string): Promise<ApiOffre | null> {
  const res = await fetch(`${BASE_URL}/offres/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const payload = await res.json();

  return payload.data as ApiOffre;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offre = await getOffre(slug);

  if (!offre) return { title: "Offre introuvable — SANEM" };

  return {
    title: `${offre.titre} — ${offre.entreprise?.nom ?? "SANEM"}`,
    description: offre.description.slice(0, 160),
  };
}

export default async function OffrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offre = await getOffre(slug);

  if (!offre) notFound();

  return (
    <>
      <Header />
      <main>
        <OffreDetail offre={offre} />
      </main>
      <Footer />
    </>
  );
}
