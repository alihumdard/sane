"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { fieldClass, textLink } from "@/components/ui/styles";
import { CategoryGrid } from "./CategoryGrid";
import { FaqCategoryBlock } from "./FaqCategoryBlock";
import { FaqContactPrompt } from "./FaqContactPrompt";
import { faqCategories, faqData } from "./data";

/** Category cards, a search box and the questions (two equal columns: categories are laid out in pairs). */
export function FaqExplorer() {
  const [active, setActive] = useState("generalites");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  /** questions per category (all of them, or only the ones matching the search) */
  const visible = useMemo(() => {
    const out: Record<string, (typeof faqData)[string]> = {};
    for (const [key, list] of Object.entries(faqData)) {
      out[key] = searching ? list.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(q)) : list;
    }
    return out;
  }, [q, searching]);

  const keys = faqCategories.map((c) => c.key).filter((key) => visible[key].length > 0);
  const total = keys.reduce((n, key) => n + visible[key].length, 0);

  function select(key: string) {
    setActive(key);
    setQuery("");
    // wait one frame so the full list is back before scrolling
    requestAnimationFrame(() => document.getElementById(`faq-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <>
      <CategoryGrid active={active} onSelect={select} />

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
