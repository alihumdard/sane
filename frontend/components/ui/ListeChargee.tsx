import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

/**
 * Wraps a list that reloads in place.
 *
 * The obvious shape — `{chargement ? <Spinner/> : liste.length ? <ul/> : <Vide/>}`
 * — replaces the whole subtree every time the data is refetched. Under Google
 * Translate that is fatal: Translate rewrote the rows and kept references into
 * them, so React's next removal hits a node that is no longer where it left it
 * and the page dies with removeChild.
 *
 * So all three states stay mounted and only their visibility changes. A reload
 * after the first dims the list rather than replacing it, which also reads
 * better: the rows do not jump away while a status is being saved.
 */
export function ListeChargee({
  premierChargement,
  chargement,
  vide,
  messageVide,
  children,
}: {
  /** True until the first response arrives — the only time there is nothing to show. */
  premierChargement: boolean;
  chargement: boolean;
  vide: boolean;
  messageVide: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <p className={`items-center gap-2 py-10 ${premierChargement ? "flex" : "hidden"}`}>
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
      </p>

      <div
        className={`rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center text-[13px] text-[var(--sane-text-light)] ${
          !premierChargement && vide ? "block" : "hidden"
        }`}
      >
        {messageVide}
      </div>

      <div
        aria-busy={chargement}
        className={`transition-opacity ${chargement ? "opacity-50" : ""} ${
          !premierChargement && !vide ? "block" : "hidden"
        }`}
      >
        {children}
      </div>
    </>
  );
}
