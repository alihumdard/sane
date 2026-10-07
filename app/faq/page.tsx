import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, FeatureBar } from "@/components/shared";
import { faqStats, faqData, FaqExplorer } from "@/components/faq";

export const metadata: Metadata = {
  title: "FAQ – Salon National de l'Emploi",
  description:
    "Les réponses aux questions les plus fréquentes sur le SANEM : inscriptions, formations, emploi, partenariats et participation.",
};

/** Structured data so search engines can show the questions directly. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: Object.values(faqData)
    .flat()
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <PageHero
          breadcrumb="FAQ"
          eyebrow="Salon National de l'Emploi"
          title="FAQ"
          lead="Vos questions, nos réponses"
          description="Retrouvez ici les réponses aux questions les plus fréquentes sur le Salon National de l'Emploi, son programme, les formations, les inscriptions et la participation."
          image="/faq-hero.png"
          imageFit="banner"
          tone="dark"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Nous contacter", variant: "secondary" },
          ]}
        />
        <FeatureBar items={faqStats} />
        <FaqExplorer />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
