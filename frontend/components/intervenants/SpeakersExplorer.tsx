"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpeakerSearch } from "./SpeakerSearch";
import { SpeakerCard } from "./SpeakerCard";
import { ALL_DOMAINS, ALL_SECTORS, speakers, type Speaker } from "./data";
import { api } from "@/lib/api";

interface ApiIntervenant {
  id: number;
  nom: string;
  fonction: string | null;
  organisation: string | null;
  bio: string | null;
  photo: string | null;
}

/** Search state + the speaker list (grid or list view). */
export function SpeakersExplorer() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [ajoutes, setAjoutes] = useState<Speaker[]>([]);

  /*
   * Speakers entered from the administration, alongside the ones written into
   * this file. The page used to show only the latter, so an organiser could
   * fill in a speaker and find them nowhere on the site.
   *
   * They carry no tags — the admin form has no such field — so the sector and
   * domain filters leave them out. They appear in the unfiltered list and in a
   * name search, which is what the organiser entering them expects to see.
   */
  useEffect(() => {
    let annule = false;

    api
      .get<{ data: ApiIntervenant[] }>("/intervenants")
      .then((r) => {
        if (annule) return;

        setAjoutes(
          r.data.map((i) => ({
            name: i.nom,
            title: i.fonction ?? "",
            org: i.organisation ?? "",
            tags: [],
            img: i.photo ?? "/sane-deal3.webp",
            bio: i.bio ?? undefined,
          }))
        );
      })
      .catch(() => {
        // The written-in list still fills the page.
      });

    return () => {
      annule = true;
    };
  }, []);
  const [search, setSearch] = useState("");
  const [secteur, setSecteur] = useState(ALL_SECTORS);
  const [domaine, setDomaine] = useState(ALL_DOMAINS);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const hasTag = (value: string) => (p: Speaker) =>
      p.tags.some((t) => t.toLowerCase().includes(value.toLowerCase()));
    return [...ajoutes, ...speakers].filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.org.toLowerCase().includes(q)) &&
        (secteur === ALL_SECTORS || hasTag(secteur)(p)) &&
        (domaine === ALL_DOMAINS || hasTag(domaine)(p))
    );
  }, [search, secteur, domaine, ajoutes]);

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
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
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
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
