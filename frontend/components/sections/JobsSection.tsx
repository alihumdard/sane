"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Select } from "@/components/ui/Select";

/** One offer, as the card shows it. */
export interface OffreAccueil {
  titre: string;
  slug: string;
  entreprise: string;
  ville: string;
  contrat: string;
}

/** One entry of a filter, as /offres returns it. */
export interface Choix {
  valeur: string;
  libelle: string;
  total: number;
}

/** A contract type keeps its own tint, as before. */
const TEINTE_CONTRAT: Record<string, string> = {
  CDI: "bg-[var(--sane-orange)]/10 text-[var(--sane-orange)]",
  CDD: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  Stage: "bg-[var(--sane-c-fff7ed)] text-[var(--sane-c-b45309)]",
};

const TEINTE_PAR_DEFAUT = "bg-[var(--sane-background)] text-[var(--sane-text-light)]";

/**
 * The home page's job block: the latest offers, and a search that reaches
 * them.
 *
 * It listed four invented jobs — "Responsable Commercial, Entreprise ABC",
 * "Développeur Web, Tech Solutions" — above a search whose button did
 * nothing at all: three fields, no state behind them, and a `type="button"`
 * with no handler. A visitor typed what they were looking for and pressed
 * Rechercher, and the page sat there.
 */
export function JobsSection({
  offres = [],
  secteurs = [],
  villes = [],
}: {
  offres?: OffreAccueil[];
  secteurs?: Choix[];
  villes?: Choix[];
}) {
  const router = useRouter();
  const [terme, setTerme] = useState("");
  const [secteur, setSecteur] = useState("");
  const [ville, setVille] = useState("");

  function rechercher() {
    const params = new URLSearchParams();

    if (terme.trim()) params.set("q", terme.trim());
    if (secteur) params.set("secteur", secteur);
    if (ville) params.set("ville", ville);

    const requete = params.toString();

    router.push(requete ? `/emploi?${requete}` : "/emploi");
  }

  return (
    <section className="bg-[var(--sane-background)] py-14 md:py-16">
      <Container>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Offres d'emploi"
            icon={BriefcaseBusiness}
            title="Trouvez une opportunité"
          />

          <Link
            href="/emploi"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--sane-green)]"
          >
            Voir toutes les offres
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
          <div className="flex h-12 items-center gap-3 rounded-lg border border-[var(--sane-border)] bg-white px-4 sm:col-span-2 lg:col-span-1">
            <Search size={17} className="shrink-0 text-[var(--sane-c-71857a)]" />
            <input
              type="search"
              value={terme}
              onChange={(e) => setTerme(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                e.preventDefault();
                rechercher();
              }}
              placeholder="Intitulé du poste, compétence..."
              aria-label="Rechercher une offre"
              className="w-full bg-transparent text-sm text-[var(--sane-text)] outline-none placeholder:text-[var(--sane-c-8a9a91)]"
            />
          </div>

          <Select
            options={secteurs.map((c) => ({ value: c.valeur, label: `${c.libelle} (${c.total})` }))}
            placeholder="Secteur"
            icon={BriefcaseBusiness}
            value={secteur}
            onChange={setSecteur}
          />

          <Select
            options={villes.map((c) => ({ value: c.valeur, label: `${c.libelle} (${c.total})` }))}
            placeholder="Localisation"
            icon={MapPin}
            value={ville}
            onChange={setVille}
          />

          <button
            type="button"
            onClick={rechercher}
            className="h-12 w-full rounded-lg bg-[var(--sane-orange)] px-7 text-sm font-bold text-white transition hover:bg-[var(--sane-orange-dark)] sm:col-span-2 lg:col-span-1 lg:w-auto"
          >
            Rechercher
          </button>
        </div>

        {/* JOBS */}
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-[var(--sane-text)]">
            Offres récemment publiées
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {offres.map((job) => (
              <article
                key={job.slug}
                className="rounded-xl border border-[var(--sane-border)] bg-white p-5 shadow-[0_5px_20px_rgba(16,99,45,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(16,99,45,0.09)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sane-c-eaf4ed)] text-[var(--sane-green)]">
                  <BriefcaseBusiness size={19} />
                </div>

                <div className="mt-4 flex w-full items-center justify-between gap-2">
                  <h3 className="sane-h3">{job.titre}</h3>
                  <Link
                    href={`/emploi/${job.slug}`}
                    aria-label={`Voir l'offre — ${job.titre}`}
                    className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--sane-green)]/30 text-[var(--sane-green)] transition hover:border-[var(--sane-green)] hover:bg-[var(--sane-green)] hover:text-white"
                  >
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <p className="mt-1 text-xs text-[var(--sane-text-light)]">
                  {job.entreprise}
                </p>

                <div className="mt-3 flex items-center justify-between gap-1.5 text-xs text-[var(--sane-text-light)]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[var(--sane-orange)]" />
                    {job.ville}
                  </div>

                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
                      TEINTE_CONTRAT[job.contrat] ?? TEINTE_PAR_DEFAUT
                    }`}
                  >
                    {job.contrat}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

      </Container>
    </section>
  );
}
