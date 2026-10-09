"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, X, Loader2, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { api } from "@/lib/api";
import type { ApiFormation, FormationsResponse } from "@/lib/types";
import { FormationCard } from "./FormationCard";
import { FormationFilters, type FormationFilterState } from "./FormationFilters";

const initial: FormationFilterState = { search: "", domaine: "", niveau: "", format: "" };

/** Filters + the formation grid (they share the filter state). */
export function FormationsExplorer() {
  const [filters, setFilters] = useState(initial);
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get<FormationsResponse>("/formations")
      .then((res) => {
        if (!cancelled) {
          setFormations(res.data);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return formations.filter((f) => {
      const categorie = f.categorie?.nom ?? "";
      return (
        (!q || `${f.titre} ${categorie}`.toLowerCase().includes(q)) &&
        (!filters.domaine || categorie === filters.domaine) &&
        (!filters.niveau || f.niveau === filters.niveau) &&
        (!filters.format || f.format === filters.format)
      );
    });
  }, [filters, formations]);

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
              description={
                loading
                  ? "Chargement du catalogue…"
                  : `${filtered.length} formation${filtered.length > 1 ? "s" : ""} ${dirty ? "correspondent à votre recherche" : "disponibles"}`
              }
            />
            {dirty && !loading && (
              <button type="button" onClick={reset} className={`${textLink} hidden shrink-0 sm:inline-flex`}>
                <X size={14} /> Réinitialiser les filtres
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--sane-border)] bg-white px-6 py-16">
              <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
              <p className="sane-small">Chargement des formations…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-[var(--sane-red-dark)] bg-white px-6 py-12 text-center">
              <AlertCircle size={24} className="mx-auto mb-2 text-[var(--sane-red-dark)]" />
              <p className="sane-h3 mb-1">Impossible de charger les formations</p>
              <p className="sane-small">{error}</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((f) => (
                <FormationCard key={f.id} formation={f} />
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
