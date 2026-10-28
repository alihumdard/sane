import Link from "next/link";
import { ArrowRight, Briefcase, Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fieldClass, primaryBtn, selectClass, textLink } from "@/components/ui/styles";

interface Props {
  search: string;
  secteur: string;
  /** The sectors actually represented, built from the records themselves. */
  secteurs: string[];
  onSearch: (v: string) => void;
  onSecteur: (v: string) => void;
}

export function SpeakerSearch({ search, secteur, secteurs, onSearch, onSecteur }: Props) {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Découvrez nos intervenants"
            title="Trouvez un intervenant"
            description="Recherchez par nom, secteur ou expertise pour découvrir nos intervenants."
          />
          <Link href="#speakers" className={`${textLink} hidden shrink-0 sm:inline-flex`}>
            Voir tous les intervenants <ArrowRight size={14} />
          </Link>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Nom de l'intervenant..."
              aria-label="Rechercher un intervenant"
              className={`${fieldClass} pl-10`}
            />
          </div>
          <div className="relative">
            <Briefcase size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
            {/* One filter, over the sectors the speakers actually carry. */}
            <select value={secteur} onChange={(e) => onSecteur(e.target.value)} aria-label="Secteur" className={`${selectClass} pl-10`}>
              {secteurs.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={`${primaryBtn} sm:col-span-2 lg:col-span-1`}>
            Rechercher
          </button>
        </form>
      </Container>
    </section>
  );
}
