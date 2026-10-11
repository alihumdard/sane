"use client";

import { AlertCircle, Loader2, Search } from "lucide-react";
import type { PaginationMeta } from "@/lib/types";

export interface Colonne<T> {
  cle: string;
  entete: string;
  /** Hidden below this breakpoint, so narrow screens show only the essentials. */
  masquer?: "sm" | "md" | "lg";
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
  actions?: React.ReactNode;
  vide?: string;
}

const MASQUER = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

/** Shared shell for the back-office lists: search, table, pagination. */
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
  vide = "Aucun élément.",
}: AdminTableProps<T>) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-[360px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
          <input
            type="search"
            value={recherche}
            onChange={(e) => onRecherche(e.target.value)}
            placeholder="Rechercher…"
            aria-label="Rechercher"
            className="h-[40px] w-full rounded-lg border border-[var(--sane-border)] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[var(--sane-green)]"
          />
        </div>
        {actions}
      </div>

      {erreur && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-4">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
          <span className="text-[13px] text-[var(--sane-red-dark)]">{erreur}</span>
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
              <tr>
                {colonnes.map((c) => (
                  <th
                    key={c.cle}
                    scope="col"
                    className={`px-4 py-3 text-[12px] font-semibold text-[var(--sane-text-light)] ${c.masquer ? MASQUER[c.masquer] : ""}`}
                  >
                    {c.entete}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y divide-[var(--sane-border)] ${chargement ? "opacity-60" : ""}`}>
              {lignes.map((ligne) => (
                <tr key={cle(ligne)}>
                  {colonnes.map((c) => (
                    <td
                      key={c.cle}
                      className={`px-4 py-3 text-[13px] text-[var(--sane-text)] ${c.masquer ? MASQUER[c.masquer] : ""}`}
                    >
                      {c.rendu(ligne)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {chargement && lignes.length === 0 && (
          <p className="flex items-center justify-center gap-2 py-10">
            <Loader2 size={16} className="animate-spin text-[var(--sane-green)]" />
            <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
          </p>
        )}

        {!chargement && lignes.length === 0 && (
          <p className="py-10 text-center text-[13px] text-[var(--sane-text-light)]">{vide}</p>
        )}
      </div>

      {meta && meta.last_page > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            onClick={() => onPage(Math.max(1, meta.page - 1))}
            disabled={meta.page === 1 || chargement}
            className="rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="px-2 text-[12px] text-[var(--sane-text-light)]">
            Page {meta.page} sur {meta.last_page} · {meta.total} élément(s)
          </span>
          <button
            type="button"
            onClick={() => onPage(Math.min(meta.last_page, meta.page + 1))}
            disabled={meta.page === meta.last_page || chargement}
            className="rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40"
          >
            Suivant
          </button>
        </nav>
      )}
    </>
  );
}
