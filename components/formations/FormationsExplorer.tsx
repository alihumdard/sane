"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { FormationCard } from "./FormationCard";
import { FormationFilters, type FormationFilterState } from "./FormationFilters";
import { formations } from "./data";

const initial: FormationFilterState = { search: "", domaine: "", niveau: "", format: "" };

/** Filters + the formation grid (they share the filter state). */
export function FormationsExplorer() {
  const [filters, setFilters] = useState(initial);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return formations.filter(
      (f) =>
        (!q || `${f.title} ${f.tag}`.toLowerCase().includes(q)) &&
        (!filters.domaine || f.tag === filters.domaine) &&
        (!filters.niveau || f.niveau === filters.niveau) &&
        (!filters.format || f.format === filters.format)
    );
  }, [filters]);

  const dirty = Object.values(filters).some(Boolean);
  const reset = () => setFilters(initial);

  return (
    <>
      <FormationFilters value={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} onReset={reset} dirty={dirty} />

      <section id="catalogue" className="scroll-mt-20 bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Nos formations"
              title="Des formations pour tous les profils"
              description={`${filtered.length} formation${filtered.length > 1 ? "s" : ""} ${dirty ? "correspondent à votre recherche" : "disponibles"}`}
            />
            {dirty && (
              <button type="button" onClick={reset} className={`${textLink} hidden shrink-0 sm:inline-flex`}>
                <X size={14} /> Réinitialiser les filtres
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((f) => (
                <FormationCard key={f.title} formation={f} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--sane-border)] bg-white px-6 py-12 text-center">
              <p className="sane-h3 mb-1">Aucune formation trouvée</p>
              <p className="sane-small mb-4">Essayez un autre mot-clé ou retirez certains filtres.</p>
              <button type="button" onClick={reset} className={textLink}>
                <X size={14} /> Réinitialiser les filtres
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/contact" className={textLink}>
              Vous ne trouvez pas votre formation ? Contactez-nous <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
