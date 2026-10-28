import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Building2, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { primaryBtn } from "@/components/ui/styles";

export interface ChiffresImpact {
  offres: number;
  entreprises: number;
  formations: number;
  inscriptions: number;
}

/**
 * What the partnerships have actually produced.
 *
 * The four figures here were "+1000 opportunités créées", "+20 programmes
 * soutenus", "+30 projets réalisés" and "+100 experts mobilisés" — none of
 * them counted, all of them printed in the brand's largest numerals under the
 * heading "L'impact de nos partenaires". They now come from the same count
 * the rest of the site uses, and the section stays away while it has nothing
 * to report.
 */
export function ImpactSection({ chiffres }: { chiffres: ChiffresImpact | null }) {
  const lignes = chiffres
    ? [
        { icon: Briefcase, valeur: chiffres.offres, label: "Offres d'emploi publiées" },
        { icon: Building2, valeur: chiffres.entreprises, label: "Entreprises qui recrutent" },
        { icon: BookOpen, valeur: chiffres.formations, label: "Formations au catalogue" },
        { icon: Users, valeur: chiffres.inscriptions, label: "Inscriptions au salon" },
      ]
    : [];

  return (
    <section
      className={
        "bg-[var(--sane-green-deep)] py-10 sm:py-12 md:py-14 " + (lignes.length > 0 ? "block" : "hidden")
      }
    >
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="lg:max-w-[360px] lg:shrink-0">
            <SectionHeading
              tone="light"
              title="L'impact de nos partenaires"
              description="Grâce à nos partenaires, nous multiplions les opportunités et contribuons à un écosystème de l'emploi plus inclusif et durable au Niger."
              className="mb-7"
            />
            <Link href="/contact" className={primaryBtn}>
              Rejoindre nos partenaires <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 lg:flex-1">
            {lignes.map(({ icon: Icon, valeur, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white">
                  <Icon size={20} />
                </span>
                <span className="text-[length:var(--fs-h1)] font-extrabold leading-none text-white">{valeur}</span>
                <span className="sane-small on-dark">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
