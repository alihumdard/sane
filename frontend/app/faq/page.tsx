import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import { FaqExplorer } from "@/components/faq";
import type { ApiFaq } from "@/components/faq/FaqExplorer";
import { lireApi } from "@/lib/serveur";
import { BarreFaq } from "@/components/shared/barres";

export const metadata: Metadata = {
  title: "FAQ – Salon National de l'Emploi",
  description:
    "Les réponses aux questions les plus fréquentes sur le SANEM : inscriptions, formations, emploi, partenariats et participation.",
};

export default async function FAQPage() {
  const entrees = await lireApi<ApiFaq[]>("/faq", []);

  /*
   * Structured data from the same records the page shows, rather than from a
   * list written into the source: the two had drifted apart, and the snippet
   * Google showed was not the FAQ the organisers had written.
   */
  const jsonLd = entrees.length
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entrees.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.reponse },
        })),
      })
    : null;

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
        <FaqExplorer initiales={entrees} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
