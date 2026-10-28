import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/shared";
import { PartnerLogosSection, PartnerTypesSection, ImpactSection } from "@/components/partenaires";
import { BarrePartenaires } from "@/components/shared/barres";
import type { ApiPartenaire } from "@/components/partenaires/PartnerLogosSection";
import { lireApi } from "@/lib/serveur";

interface Statistiques {
  emploi: { offres: number; entreprises: number; secteurs: number };
  formations: { total: number; places: number; formateurs: number };
  participation: { inscriptions: number; partenaires: number };
  programme: { sessions: number; jours: number };
}


export default async function PartenairesPage() {
  // The badge read "+50 partenaires actifs" directly above a counter
  // reading the real number, five.
  const [partenaires, stats] = await Promise.all([
    lireApi<ApiPartenaire[]>("/partenaires", []),
    lireApi<Statistiques | null>("/statistiques", null),
  ]);

  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumb="Partenaires"
          eyebrow="Réseau de partenaires"
          title={
            <>
              Nos <span className="text-[var(--sane-orange)]">Partenaires</span>
            </>
          }
          lead="Ensemble pour l'emploi de demain."
          description="Le SANEM réunit institutions publiques, entreprises privées, organisations internationales et société civile autour d'un objectif commun : promouvoir l'emploi au Niger."
          image="/Partenaires-hero.webp"
          mobileImage="/partenaires-hero-sm.webp"
          mobileImagePosition="90% center"
          imageFit="banner"
          overlayStrength="light"
          actions={[
            { href: "/contact", label: "Devenir partenaire" },
            { href: "#partenaires", label: "Voir tous les partenaires", variant: "secondary" },
          ]}
          stats={
            stats
              ? [{ value: String(stats.participation.partenaires), label: "partenaires" }]
              : []
          }
        />
        <BarrePartenaires />
        <PartnerLogosSection initiaux={partenaires} />
        <PartnerTypesSection />
        <ImpactSection
          chiffres={
            stats
              ? {
                  offres: stats.emploi.offres,
                  entreprises: stats.emploi.entreprises,
                  formations: stats.formations.total,
                  inscriptions: stats.participation.inscriptions,
                }
              : null
          }
        />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
