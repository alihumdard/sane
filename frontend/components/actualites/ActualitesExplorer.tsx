"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { ArticleCard } from "@/components/shared";
import { CategoryTabs } from "./CategoryTabs";
import { SearchBar } from "./SearchBar";
import { FeaturedArticle } from "./FeaturedArticle";
import { NewsSidebar } from "./NewsSidebar";
import { articles, categoryLabels, tagColors } from "./data";

/** Owns the category / search / sort state shared by the tabs, the search bar and the article grid. */
export function ActualitesExplorer() {
  const [category, setCategory] = useState("tous");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles
      .filter((a) => category === "tous" || a.category === category)
      .filter((a) => !q || `${a.title} ${a.description}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === "ancien" ? a.iso.localeCompare(b.iso) : b.iso.localeCompare(a.iso)));
  }, [category, query, sort]);

  const hasFilters = category !== "tous" || query !== "" || sort !== "recent";

  function reset() {
    setCategory("tous");
    setQuery("");
    setSort("recent");
  }

  return (
    <>
      <CategoryTabs active={category} onChange={setCategory} />
      <SearchBar query={query} category={category} sort={sort} onQuery={setQuery} onCategory={setCategory} onSort={setSort} />

      <section className="bg-white py-10 sm:py-12 md:py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Dernières actualités" title="Nos dernières nouvelles" />
            <Link href="#" className={`${textLink} hidden sm:inline-flex`}>
              Voir toutes les actualités <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
            <div className="min-w-0">
              {filtered.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((a) => (
                    <ArticleCard
                      key={a.title}
                      image={a.image}
                      date={a.date}
                      title={a.title}
                      description={a.description}
                      tag={categoryLabels[a.category]}
                      tagColor={tagColors[a.category]}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--sane-border)] bg-[var(--sane-background)] px-6 py-12 text-center">
                  <p className="sane-h3 mb-1">Aucune actualité trouvée</p>
                  <p className="sane-small mb-4">Essayez un autre mot-clé ou une autre catégorie.</p>
                  <button type="button" onClick={reset} className={textLink}>
                    <X size={14} /> Réinitialiser les filtres
                  </button>
                </div>
              )}

              {hasFilters && filtered.length > 0 && (
                <button type="button" onClick={reset} className={`${textLink} mt-4`}>
                  <X size={14} /> Réinitialiser les filtres
                </button>
              )}

              <FeaturedArticle />
            </div>

            <NewsSidebar />
          </div>
        </Container>
      </section>
    </>
  );
}
