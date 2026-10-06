import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero, FeatureBar } from "@/components/shared";
import { speakerStats, SpeakersExplorer } from "@/components/intervenants";

export default function IntervenantsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Intervenants"
          eyebrow="Salon National de l'Emploi"
          title="Nos Intervenants"
          lead="Des experts pour un Niger plus fort."
          description="Des experts, des leaders et des professionnels engagés pour partager leurs expériences et inspirer les talents du Niger."
          image="/Intervenants2 png.png"
          imageFit="banner"
          overlayStrength="light"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Proposer un intervenant", variant: "secondary" },
          ]}
        />
        <FeatureBar items={speakerStats} />
        <SpeakersExplorer />
        <CTASection
          tone="dark"
          title={
            <>
              Partagez votre expertise
              <br />
              avec les talents de demain.
            </>
          }
          description="Rejoignez le Salon National de l'Emploi en tant qu'intervenant et contribuez à construire un Niger plus fort."
          actions={[{ href: "/contact", label: "Devenir intervenant" }]}
        />
      </main>
      <Footer />
    </>
  );
}
