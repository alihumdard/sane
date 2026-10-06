import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, FeatureBar } from "@/components/shared";
import { perks, RegistrationSection, DocumentsSection, InscriptionFaq } from "@/components/inscription";

export default function InscriptionPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Inscription participant"
          eyebrow="Salon National de l'Emploi"
          title="Inscription Participant"
          lead="Rejoignez le SANEM et vivez une expérience unique."
          description="Inscrivez-vous pour participer au Salon National de l'Emploi et accédez aux conférences, formations, rencontres et opportunités d'emploi."
          image="/sane_deal.png"
          actions={[
            { href: "#form", label: "Créer mon compte" },
            { href: "/programme", label: "Voir le programme", variant: "secondary" },
          ]}
        />
        <FeatureBar items={perks} variant="solid" />
        <RegistrationSection />
        <DocumentsSection />
        <InscriptionFaq />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
