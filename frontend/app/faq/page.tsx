import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import { FaqExplorer } from "@/components/faq";
import { BarreFaq } from "@/components/shared/barres";

export const metadata: Metadata = {
  title: "FAQ – Salon National de l'Emploi",
  description:
    "Les réponses aux questions les plus fréquentes sur le SANEM : inscriptions, formations, emploi, partenariats et participation.",
};

const BASE_URL =
  process.env.API_INTERNE ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/**
 * Structured data so search engines can show the questions directly.
 *
 * Read on the server from the same records the page shows, rather than from a
 * list written into the source: the two had drifted apart, and the snippet
 * Google showed was not the FAQ the organisers had written.
 */
async function donneesStructurees(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/faq`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const { data } = (await res.json()) as { data: { question: string; reponse: string }[] };

    if (!data?.length) return null;

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.reponse },
      })),
    });
  } catch {
    return null;
  }
}

export default async function FAQPage() {
  const jsonLd = await donneesStructurees();

  return (
    <>
      <Header />
      <main>
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
        <PageHero
          breadcrumb="FAQ"
          eyebrow="Salon National de l'Emploi"
          title="FAQ"
          lead="Vos questions, nos réponses"
          description="Retrouvez ici les réponses aux questions les plus fréquentes sur le Salon National de l'Emploi, son programme, les formations, les inscriptions et la participation."
          image="/faq-hero.webp"
          mobileImage="/faq-hero-sm.webp"
          imageFit="banner"
          tone="dark"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Nous contacter", variant: "secondary" },
          ]}
        />
        <BarreFaq />
        <FaqExplorer />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
