import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import { SpeakersExplorer } from "@/components/intervenants";
import type { Speaker } from "@/components/intervenants/data";
import { lireApi } from "@/lib/serveur";

interface ApiIntervenant {
  id: number;
  nom: string;
  fonction: string | null;
  organisation: string | null;
  secteur: string | null;
  bio: string | null;
  photo: string | null;
}
import { BarreIntervenants } from "@/components/shared/barres";

export default async function IntervenantsPage() {
  // Read while rendering, so the speakers are in the HTML the visitor gets.
  const intervenants = await lireApi<ApiIntervenant[]>("/intervenants", []);

  const initiaux: Speaker[] = intervenants.map((i) => ({
    name: i.nom,
    title: i.fonction ?? "",
    org: i.organisation ?? "",
    tags: i.secteur ? [i.secteur] : [],
    img: i.photo ?? "/sane-deal3.webp",
    bio: i.bio ?? undefined,
  }));

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
          image="/Intervenants2-png.webp"
          mobileImage="/intervenants-hero-sm.webp"
          imageFit="banner"
          overlayStrength="light"
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Proposer un intervenant", variant: "secondary" },
          ]}
        />
        <BarreIntervenants />
        <SpeakersExplorer initiaux={initiaux} />
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
