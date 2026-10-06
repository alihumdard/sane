"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpeakerSearch } from "./SpeakerSearch";
import { SpeakerCard } from "./SpeakerCard";
import { ALL_DOMAINS, ALL_SECTORS, speakers } from "./data";

/** Search state + the speaker list (grid or list view). */
export function SpeakersExplorer() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [secteur, setSecteur] = useState(ALL_SECTORS);
  const [domaine, setDomaine] = useState(ALL_DOMAINS);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const hasTag = (value: string) => (p: (typeof speakers)[number]) =>
      p.tags.some((t) => t.toLowerCase().includes(value.toLowerCase()));
    return speakers.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.org.toLowerCase().includes(q)) &&
        (secteur === ALL_SECTORS || hasTag(secteur)(p)) &&
        (domaine === ALL_DOMAINS || hasTag(domaine)(p))
    );
  }, [search, secteur, domaine]);

  const toggle = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
      active
        ? "border-[var(--sane-green)] bg-[var(--sane-green-light)] text-[var(--sane-green)]"
        : "border-[var(--sane-border)] text-[var(--sane-text-light)] hover:border-[var(--sane-green)]"
    }`;

  return (
    <>
      <SpeakerSearch
        search={search}
        secteur={secteur}
        domaine={domaine}
        onSearch={setSearch}
        onSecteur={setSecteur}
        onDomaine={setDomaine}
      />

      <section id="speakers" className="scroll-mt-20 bg-white py-10 sm:py-12 md:py-16">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Nos intervenants" title="Des profils inspirants pour l'avenir du Niger" />
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => setView("grid")} aria-label="Vue en grille" aria-pressed={view === "grid"} className={toggle(view === "grid")}>
                <LayoutGrid size={15} />
              </button>
              <button type="button" onClick={() => setView("list")} aria-label="Vue en liste" aria-pressed={view === "list"} className={toggle(view === "list")}>
                <List size={15} />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="sane-body rounded-2xl border border-dashed border-[var(--sane-border)] bg-[var(--sane-background)] px-6 py-12 text-center">
              Aucun intervenant ne correspond à votre recherche.
            </p>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p) => (
                <SpeakerCard key={p.name} speaker={p} view="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((p) => (
                <SpeakerCard key={p.name} speaker={p} view="list" />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
