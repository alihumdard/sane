"use client";

import { Inbox, Search } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { Spinner } from "./Spinner";
import type { PaginationMeta } from "@/lib/types";

export interface Colonne<T> {
  cle: string;
  entete: string;
  /** Hidden below this breakpoint, so narrow screens show only the essentials. */
  masquer?: "sm" | "md" | "lg";
  /** Right-aligned on desktop — used by the row's action buttons. */
  fin?: boolean;
  rendu: (ligne: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  colonnes: Colonne<T>[];
  lignes: T[];
  meta: PaginationMeta | null;
  chargement: boolean;
  erreur: string | null;
  recherche: string;
  onRecherche: (v: string) => void;
  onPage: (p: number) => void;
  /** Stable identity per row; index is not safe across re-sorts. */
  cle: (ligne: T) => string | number;
  /** Buttons beside the search box — "Ajouter", exports, status filters. */
  actions?: React.ReactNode;
  /** Extra controls on their own row, below the search box. */
  filtres?: React.ReactNode;
  vide?: string;
  rechercheLabel?: string;
}

const MASQUER = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

/** The page numbers worth drawing around the current one. */
function fenetre(page: number, dernier: number): number[] {
  const pages = new Set<number>([1, dernier, page, page - 1, page + 1]);

  return [...pages].filter((p) => p >= 1 && p <= dernier).sort((a, b) => a - b);
}

/**
 * Shared shell for the back-office lists: search, table, pagination.
 *
 * Each cell carries its column name as `data-label`, which is what the mobile
 * card layout in globals.css prints beside the value. That used to be done
 * from the browser by a component mounted in the root layout, which observed
 * every mutation of document.body and re-queried the whole document — on all
 * 18 public pages too, where there is no table at all.
 */
export function AdminTable<T>({
  colonnes,
  lignes,
  meta,
  chargement,
  erreur,
  recherche,
  onRecherche,
  onPage,
  cle,
  actions,
  filtres,
  vide = "Aucun élément.",
  rechercheLabel = "Rechercher…",
}: AdminTableProps<T>) {
  const page = meta?.page ?? 1;
  const dernier = meta?.last_page ?? 1;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-[340px]">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]"
          />
          <input
            type="search"
            value={recherche}
            onChange={(e) => onRecherche(e.target.value)}
            placeholder={rechercheLabel}
            aria-label={rechercheLabel}
            className="h-11 w-full rounded-xl border border-[var(--sane-border)] bg-white pl-10 pr-10 text-[13px] text-[var(--sane-text)] outline-none transition-all placeholder:text-[var(--sane-text-light)]/70 focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8"
          />
          <Spinner
            actif={chargement && lignes.length > 0}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sane-green)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>

      <div className={"mb-3 flex flex-wrap items-center gap-2 " + (filtres ? "flex" : "hidden")}>{filtres}</div>

      <Alerte texte={erreur} className="mb-3" />

      <div className="overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white shadow-[0_1px_2px_rgba(16,35,26,0.04),0_8px_24px_-16px_rgba(16,99,45,0.18)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-[62px] z-[1] border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
              <tr>
                {colonnes.map((c) => (
                  <th
                    key={c.cle}
                    scope="col"
                    className={
                      "px-4 py-3.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[var(--sane-text-light)] " +
                      (c.fin ? "text-right " : "") +
                      (c.masquer ? MASQUER[c.masquer] : "")
                    }
                  >
                    {c.entete}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sane-border)]">
              {lignes.map((ligne) => (
                <tr key={cle(ligne)} className="transition-colors hover:bg-[var(--sane-green-light)]/40">
                  {colonnes.map((c) => (
                    <td
                      key={c.cle}
                      data-label={c.entete}
                      className={
                        "px-4 py-3.5 align-middle text-[13px] text-[var(--sane-text)] " +
                        (c.fin ? "text-right " : "") +
                        (c.masquer ? MASQUER[c.masquer] : "")
                      }
                    >
                      {c.rendu(ligne)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className={
            "items-center justify-center gap-2 py-12 " +
            (chargement && lignes.length === 0 ? "flex" : "hidden")
          }
        >
          <Spinner actif className="text-[var(--sane-green)]" size={18} />
          <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
        </p>

        <div
          className={
            "flex-col items-center gap-2 px-6 py-12 text-center " +
            (!chargement && lignes.length === 0 ? "flex" : "hidden")
          }
        >
          <span className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--sane-background)]">
            <Inbox size={24} className="text-[var(--sane-text-light)]/60" />
          </span>
          <p className="max-w-[420px] text-[13px] text-[var(--sane-text-light)]">
            {recherche ? "Aucun résultat pour « " + recherche + " »." : vide}
          </p>
        </div>
      </div>

      <nav
        aria-label="Pagination"
        className={"mt-4 flex-wrap items-center justify-between gap-3 " + (dernier > 1 ? "flex" : "hidden")}
      >
        <p className="text-[12px] text-[var(--sane-text-light)]">
          {meta ? meta.total + " élément(s) · page " + page + " sur " + dernier : ""}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPage(Math.max(1, page - 1))}
            disabled={page === 1 || chargement}
            className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[12px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)] disabled:opacity-40 disabled:hover:border-[var(--sane-border)] disabled:hover:bg-white disabled:hover:text-[var(--sane-text)]"
          >
            Précédent
          </button>

          {fenetre(page, dernier).map((p, i, liste) => (
            <span key={p} className="flex items-center">
              <span
                aria-hidden
                className={"px-1 text-[12px] text-[var(--sane-text-light)] " + (i > 0 && p - liste[i - 1] > 1 ? "inline" : "hidden")}
              >
                …
              </span>
              <button
                type="button"
                onClick={() => onPage(p)}
                aria-current={p === page ? "page" : undefined}
                disabled={chargement}
                className={
                  "h-8 min-w-8 rounded-lg px-2 text-[12px] font-semibold transition-colors " +
                  (p === page
                    ? "bg-[var(--sane-green)] text-white shadow-[0_4px_12px_-4px_rgba(16,99,45,0.5)]"
                    : "border border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]")
                }
              >
                {p}
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={() => onPage(Math.min(dernier, page + 1))}
            disabled={page === dernier || chargement}
            className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[12px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)] disabled:opacity-40 disabled:hover:border-[var(--sane-border)] disabled:hover:bg-white disabled:hover:text-[var(--sane-text)]"
          >
            Suivant
          </button>
        </div>
      </nav>
    </>
  );
}
