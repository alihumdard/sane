import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, FeatureBar } from "@/components/shared";
import { contactBarItems, ContactSection, LocationSection } from "@/components/contact";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Contact"
          eyebrow="Salon National de l'Emploi"
          title="Contactez le SANEM"
          lead="Nous sommes à votre écoute."
          description="Une question, une demande d'information ou une proposition de partenariat ? Notre équipe est disponible pour vous répondre et vous accompagner."
          tagline={"Des échanges\npour un Niger\nplus fort"}
          image="/contact hero2.png"
          tone="dark"
          imageFit="banner"
          imagePosition="center center"
          overlayStrength="light"
          actions={[
            { href: "#contact-form", label: "Nous écrire" },
            { href: "/programme", label: "Voir le programme", variant: "secondary" },
          ]}
          floatingCardText={"EMPLOI\nFORMATION\nOPPORTUNITÉS\nAVENIR"}
        />
        <FeatureBar items={contactBarItems} />
        <ContactSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
