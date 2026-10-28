"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { fieldClass, textLink } from "@/components/ui/styles";
import { CategoryGrid } from "./CategoryGrid";
import { FaqCategoryBlock } from "./FaqCategoryBlock";
import { FaqContactPrompt } from "./FaqContactPrompt";
import { api } from "@/lib/api";
import type { FaqEntry } from "@/components/shared";

export interface ApiFaq {
  id: number;
  categorie: string;
  question: string;
  reponse: string;
}

/** Category cards, a search box and the questions (two equal columns: categories are laid out in pairs). */
/**
 * The questions the organisers entered, grouped by their category.
 *
 * Twenty-seven were written into the source and shown instead of the eleven
 * in the database: editing the FAQ from the back-office changed nothing on
 * the site.
 */
export function FaqExplorer({ initiales = [] }: { initiales?: ApiFaq[] }) {
  const [active, setActive] = useState(initiales[0]?.categorie ?? "");
  const [query, setQuery] = useState("");
  const [entrees, setEntrees] = useState<ApiFaq[]>(initiales);

  /*
   * Skipped when the page arrived with its list already in it: the server
   * read it uncached while rendering, so fetching the same thing on mount
   * only spends a round trip to replace the list with itself.
   */
  const servi = useRef(initiales.length > 0);

  useEffect(() => {
    if (servi.current) {
      servi.current = false;

      return;
    }

    let annule = false;

    api
      .get<{ data: ApiFaq[] }>("/faq")
      .then((r) => {
        if (annule) return;

        setEntrees(r.data ?? []);
        setActive((a) => a || r.data?.[0]?.categorie || "");
      })
      .catch(() => {
        // An empty FAQ rather than answers nobody wrote.
      });

    return () => {
      annule = true;
    };
  }, []);

  /** Grouped in the order the categories first appear. */
  const parCategorie = useMemo(() => {
    const groupes: Record<string, FaqEntry[]> = {};

    for (const e of entrees) {
      (groupes[e.categorie] ??= []).push({ question: e.question, answer: e.reponse });
    }

    return groupes;
  }, [entrees]);

  const categories = useMemo(() => Object.keys(parCategorie), [parCategorie]);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  /** questions per category (all of them, or only the ones matching the search) */
  const visible = useMemo(() => {
    const out: Record<string, FaqEntry[]> = {};

    for (const [cle, liste] of Object.entries(parCategorie)) {
      out[cle] = searching
        ? liste.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(q))
        : liste;
    }

    return out;
  }, [q, searching, parCategorie]);

  const keys = categories.filter((cle) => visible[cle].length > 0);
  const total = keys.reduce((n, key) => n + visible[key].length, 0);

  function select(key: string) {
    setActive(key);
    setQuery("");
    // wait one frame so the full list is back before scrolling
    requestAnimationFrame(() => document.getElementById(`faq-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <>
      <CategoryGrid active={active} onSelect={select} categories={categories} comptes={parCategorie} />

      <section className="bg-white py-10 sm:py-12 md:py-16">
        <Container>
          {/* Search */}
          <div className="mb-8 sm:mb-10">
            <div className="relative mx-auto max-w-[640px]">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une question (inscription, formation, emploi...)"
                aria-label="Rechercher dans la FAQ"
                className={`${fieldClass} pl-11 pr-11`}
              />
              {searching && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {searching && (
              <p role="status" className="sane-small mt-3 text-center">
                {total > 0 ? `${total} résultat${total > 1 ? "s" : ""} pour « ${query.trim()} »` : `Aucun résultat pour « ${query.trim()} »`}
              </p>
            )}
          </div>

          {total > 0 ? (
            <>
              {/* Categories in pairs (6|6, 5|5), the contact card fills the last cell so both sides end level */}
              <div className="grid items-start gap-x-8 gap-y-8 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-2">
                {keys.map((key) => (
                  <FaqCategoryBlock
                    key={`${key}-${q}`}
                    categoryKey={key}
                    highlighted={!searching && key === active}
                    items={visible[key]}
                    openAll={searching}
                  />
                ))}
                {!searching && <FaqContactPrompt variant="card" />}
              </div>
              {searching && <FaqContactPrompt />}
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-dashed border-[var(--sane-border)] bg-[var(--sane-background)] px-6 py-12 text-center">
                <p className="sane-h3 mb-1">Aucune question trouvée</p>
                <p className="sane-small mb-4">Essayez un autre mot-clé ou parcourez les thématiques ci-dessus.</p>
                <button type="button" onClick={() => setQuery("")} className={textLink}>
                  <X size={14} /> Effacer la recherche
                </button>
              </div>
              <FaqContactPrompt title="Posez-nous directement votre question" />
            </>
          )}
        </Container>
      </section>
    </>
  );
}
