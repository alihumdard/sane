"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronDown, Loader2, MapPin, Search } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { Container } from "@/components/ui/Container";
import { api, ApiError } from "@/lib/api";
import type { ApiOffre, FiltreValeur, OffresResponse } from "@/lib/types";

/** "12 mars 2026" — the API sends ISO, the UI reads French. */
function formatDate(iso: string | null): string {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Colour is presentation, so it is derived here rather than stored server-side. */
const PALETTE = [
  "var(--sane-green)",
  "var(--sane-orange)",
  "var(--sane-c-0066b2)",
  "var(--sane-c-e30613)",
  "var(--sane-c-1a5276)",
];

function couleur(id: number): string {
  return PALETTE[id % PALETTE.length];
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: FiltreValeur[];
}) {
  return (
    <div className="relative lg:min-w-[150px] lg:flex-1">
      <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        className="h-[46px] w-full cursor-pointer appearance-none rounded-xl bg-white pl-4 pr-10 text-[13px] text-[var(--sane-text)] shadow-sm outline-none ring-1 ring-black/[0.04] transition-shadow focus:ring-2 focus:ring-[var(--sane-green)] sm:h-[52px] sm:text-[14px]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>
            {o.libelle} ({o.total})
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Job board, served by the API.
 *
 * Searching and filtering happen server-side so the browser never holds the
 * whole table: only the current page of results crosses the wire, and the
 * query runs against the database indexes.
 */
/**
 * @param termeInitial What a search box handed over, read from `?q=` by the
 *   page — the one in the header, or the one on the home page, which also
 *   passes a sector and a city. Read on the server rather than from `window` here: a
 *   useState initialiser also runs during rendering on the server, where
 *   there is no address, and hydration keeps that empty value — so
 *   /emploi?q=comptable listed every offer and showed an empty box.
 */
export function JobsGrid({
  termeInitial = "",
  secteurInitial = "",
  villeInitiale = "",
  initiales,
}: {
  termeInitial?: string;
  secteurInitial?: string;
  villeInitiale?: string;
  /**
   * The first page of results, read while the page was rendered.
   *
   * Without it the served HTML of /emploi held the filters, the headings and
   * no offers at all: the busiest page of the site reached a search engine
   * empty, and a visitor on a slow connection saw a spinner until the script
   * ran and the call came back.
   */
  initiales?: OffresResponse;
}) {
  const [offres, setOffres] = useState<ApiOffre[]>(initiales?.data ?? []);
  const [filtres, setFiltres] = useState<OffresResponse["filtres"]>(
    initiales?.filtres ?? { secteur: [], ville: [], type_contrat: [] }
  );
  const [total, setTotal] = useState(initiales?.meta.total ?? 0);
  const [page, setPage] = useState(1);
  const [dernierePage, setDernierePage] = useState(initiales?.meta.last_page ?? 1);

  const [recherche, setRecherche] = useState(termeInitial);
  const [secteur, setSecteur] = useState(secteurInitial);
  const [ville, setVille] = useState(villeInitiale);
  const [contrat, setContrat] = useState("");

  const [chargement, setChargement] = useState(initiales === undefined);
  const [erreur, setErreur] = useState<string | null>(null);

  // Debounced so typing does not fire a request per keystroke.
  const [rechercheActive, setRechercheActive] = useState(termeInitial);

  useEffect(() => {
    const t = setTimeout(() => {
      setRechercheActive(recherche);
      setPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [recherche]);

  const requete = useMemo(() => {
    const params = new URLSearchParams();
    if (rechercheActive) params.set("q", rechercheActive);
    if (secteur) params.set("secteur", secteur);
    if (ville) params.set("ville", ville);
    if (contrat) params.set("type_contrat", contrat);
    params.set("page", String(page));

    return params.toString();
  }, [rechercheActive, secteur, ville, contrat, page]);

  // Guards against an earlier, slower response overwriting a newer one.
  const requeteEnCours = useRef(0);

  const charger = useCallback(async () => {
    const jeton = ++requeteEnCours.current;

    try {
      setChargement(true);
      setErreur(null);

      const res = await api.get<OffresResponse>(`/offres?${requete}`);

      if (jeton !== requeteEnCours.current) return;

      setOffres(res.data);
      setFiltres(res.filtres);
      setTotal(res.meta.total);
      setDernierePage(res.meta.last_page);
    } catch (e) {
      if (jeton !== requeteEnCours.current) return;

      setErreur(
        e instanceof ApiError
          ? e.message
          : "Impossible de charger les offres. Vérifiez votre connexion et réessayez."
      );
    } finally {
      if (jeton === requeteEnCours.current) setChargement(false);
    }
  }, [requete]);

  /*
   * Skipped once when the page arrived with its first results: the query is
   * the same one the server already answered, so fetching it again on mount
   * would spend a round trip to replace the list with itself.
   */
  const premierRendu = useRef(initiales !== undefined);

  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;

      return;
    }

    // Deferred to a microtask so the first state update happens after the
    // effect's synchronous body, avoiding a cascading render.
    void Promise.resolve().then(charger);
  }, [charger]);

  function reinitialiser() {
    setRecherche("");
    setSecteur("");
    setVille("");
    setContrat("");
    setPage(1);
  }

  const filtreActif = Boolean(rechercheActive || secteur || ville || contrat);

  return (
    <>
      <section className="bg-[var(--sane-green-light)] py-8 sm:py-10 md:py-12">
        <Container>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
              Recherche d&apos;emploi
            </span>
          </div>
          <h2 className="mb-1.5 text-[18px] font-bold text-[var(--sane-text)] sm:text-[length:var(--fs-h2)]">
            Trouvez l&apos;offre qui vous correspond
          </h2>
          <p className="mb-4 text-[13px] text-[var(--sane-text-light)] sm:mb-6 sm:text-[length:var(--fs-body)]">
            Recherchez parmi les offres d&apos;emploi publiées par nos partenaires.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-nowrap">
            <div className="relative sm:col-span-2 lg:min-w-[180px] lg:flex-1">
              <Search size={16} strokeWidth={2.2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
              <input
                type="search"
                placeholder="Intitulé du poste, compétence..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                aria-label="Rechercher une offre"
                className="h-[46px] w-full rounded-xl bg-white pl-11 pr-4 text-[13px] text-[var(--sane-text)] shadow-sm outline-none ring-1 ring-black/[0.04] transition-shadow placeholder:text-[var(--sane-text-light)] focus:ring-2 focus:ring-[var(--sane-green)] sm:h-[52px] sm:text-[14px]"
              />
            </div>

            <Select value={secteur} onChange={(v) => { setSecteur(v); setPage(1); }} placeholder="Secteur d'activité" options={filtres.secteur} />
            <Select value={ville} onChange={(v) => { setVille(v); setPage(1); }} placeholder="Lieu" options={filtres.ville} />
            <Select value={contrat} onChange={(v) => { setContrat(v); setPage(1); }} placeholder="Type de contrat" options={filtres.type_contrat} />
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-12 md:py-16">
        <Container>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[var(--sane-text-light)] sm:text-[length:var(--fs-body)]">
              {chargement ? "Recherche en cours…" : `${total} offre${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
            </p>
            {filtreActif && (
              <button
                type="button"
                onClick={reinitialiser}
                className="text-[13px] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-orange)]"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          <Alerte texte={erreur} className="" />

          {chargement && offres.length === 0 && (
            <p className="flex items-center justify-center gap-2 py-12">
              <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
              <span className="text-[13px] text-[var(--sane-text-light)]">Chargement des offres…</span>
            </p>
          )}

          {!chargement && !erreur && offres.length === 0 && (
            <p className="py-12 text-center text-[13px] text-[var(--sane-text-light)]">
              Aucune offre ne correspond à votre recherche.
            </p>
          )}

          {offres.length > 0 && (
            <div className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${chargement ? "opacity-60" : ""}`}>
              {offres.map((offre) => (
                <article
                  key={offre.id}
                  className="flex flex-col rounded-2xl border border-[var(--sane-border)] bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                      style={{ backgroundColor: couleur(offre.id) }}
                    >
                      {(offre.entreprise?.nom ?? "?").slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[var(--sane-text)]">
                        {offre.entreprise?.nom}
                      </p>
                      <p className="truncate text-[12px] text-[var(--sane-text-light)]">{offre.secteur}</p>
                    </div>
                  </div>

                  <h3 className="mb-2 text-[15px] font-bold leading-snug text-[var(--sane-text)]">
                    {offre.titre}
                  </h3>

                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--sane-text-light)]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} /> {offre.ville}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} /> {formatDate(offre.publiee_le)}
                    </span>
                  </div>

                  <span className="mb-4 inline-flex w-fit rounded-full bg-[var(--sane-green-light)] px-3 py-1 text-[11px] font-semibold text-[var(--sane-green)]">
                    {offre.type_contrat_label}
                  </span>

                  <Link
                    href={`/emploi/${offre.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-orange)]"
                  >
                    Voir l&apos;offre <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          )}

          {dernierePage > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || chargement}
                className="rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[13px] font-semibold transition-colors hover:border-[var(--sane-green)] disabled:opacity-40"
              >
                Précédent
              </button>
              <span className="px-2 text-[13px] text-[var(--sane-text-light)]">
                Page {page} sur {dernierePage}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(dernierePage, p + 1))}
                disabled={page === dernierePage || chargement}
                className="rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[13px] font-semibold transition-colors hover:border-[var(--sane-green)] disabled:opacity-40"
              >
                Suivant
              </button>
            </nav>
          )}
        </Container>
      </section>
    </>
  );
}
