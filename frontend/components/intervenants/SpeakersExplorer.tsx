"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpeakerSearch } from "./SpeakerSearch";
import { SpeakerCard } from "./SpeakerCard";
import { ALL_SECTORS, type Speaker } from "./data";
import { api } from "@/lib/api";

interface ApiIntervenant {
  id: number;
  nom: string;
  fonction: string | null;
  organisation: string | null;
  secteur: string | null;
  bio: string | null;
  photo: string | null;
}

/** Search state + the speaker list (grid or list view). */
export function SpeakersExplorer({ initiaux = [] }: { initiaux?: Speaker[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [intervenants, setIntervenants] = useState<Speaker[]>(initiaux);
  const [charge, setCharge] = useState(initiaux.length > 0);

  /*
   * Skipped when the page arrived with its list already in it: the server
   * read it uncached while rendering, so fetching the same thing on mount
   * only spends a round trip to replace the list with itself.
   */
  const servi = useRef(initiaux.length > 0);

  /*
   * The speakers the organisers entered, and only those.
   *
   * The page used to show eight invented names written into this file —
   * "M. Ibrahim Maiga", "Mme Aïssatou Issa" — mixed in with the real ones the
   * client had added, with no way to tell them apart.
   */
  useEffect(() => {
    if (servi.current) {
      servi.current = false;

      return;
    }

    let annule = false;

    api
      .get<{ data: ApiIntervenant[] }>("/intervenants")
      .then((r) => {
        if (annule) return;

        setIntervenants(
          r.data.map((i) => ({
            name: i.nom,
            title: i.fonction ?? "",
            org: i.organisation ?? "",
            // The sector is what the filter below works on.
            tags: i.secteur ? [i.secteur] : [],
            img: i.photo ?? "/sane-deal3.webp",
            bio: i.bio ?? undefined,
          }))
        );
      })
      .catch(() => {
        // An empty list rather than names nobody invited.
      })
      .finally(() => {
        if (!annule) setCharge(true);
      });

    return () => {
      annule = true;
    };
  }, []);
  const [search, setSearch] = useState("");
  const [secteur, setSecteur] = useState(ALL_SECTORS);

  /** The sectors actually represented, rather than a written-in list. */
  const secteurs = useMemo(
    () => [ALL_SECTORS, ...new Set(intervenants.flatMap((p) => p.tags).filter(Boolean))],
    [intervenants]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return intervenants.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.org.toLowerCase().includes(q)) &&
        (secteur === ALL_SECTORS || p.tags.includes(secteur))
    );
  }, [search, secteur, intervenants]);

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
        secteurs={secteurs}
        onSearch={setSearch}
        onSecteur={setSecteur}
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
              {!charge
                ? "Chargement des intervenants…"
                : intervenants.length === 0
                  ? "Les intervenants seront annoncés prochainement."
                  : "Aucun intervenant ne correspond à votre recherche."}
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
