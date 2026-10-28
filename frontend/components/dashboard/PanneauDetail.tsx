"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * A record's details, beside the list rather than on a page of its own.
 *
 * Verifying a company means vouching for it, and the moderator could see a
 * name, a sector and an offer count — not who was behind it, nor how to
 * reach them. Same for a user whose account is about to be suspended.
 *
 * A panel rather than a route: the decision is taken against the list, and
 * sending the moderator somewhere else loses the search and the page they
 * were on.
 */
export function PanneauDetail({
  ouvert,
  titre,
  sousTitre,
  onFermer,
  children,
  actions,
}: {
  ouvert: boolean;
  titre: string;
  sousTitre?: string | null;
  onFermer: () => void;
  children: ReactNode;
  /** Shown at the foot, e.g. the verification toggle. */
  actions?: ReactNode;
}) {
  useEffect(() => {
    if (!ouvert) return;

    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") onFermer();
    }

    document.addEventListener("keydown", surTouche);

    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-black/30"
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-titre"
    >
      <aside
        className="flex h-full w-full max-w-[420px] flex-col overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--sane-border)] p-5">
          <div className="min-w-0">
            <h2 id="detail-titre" className="text-[16px] font-bold text-[var(--sane-text)]">
              {titre}
            </h2>
            <p className={`mt-0.5 text-[12px] text-[var(--sane-text-light)] ${sousTitre ? "block" : "hidden"}`}>
              {sousTitre}
            </p>
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="shrink-0 rounded-lg p-1.5 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 p-5">
          <dl className="flex flex-col gap-3.5">{children}</dl>
        </div>

        <footer className={`border-t border-[var(--sane-border)] p-5 ${actions ? "block" : "hidden"}`}>
          {actions}
        </footer>
      </aside>
    </div>
  );
}

/** One fact. Hidden when there is nothing behind it. */
export function Fait({ label, valeur }: { label: string; valeur: ReactNode }) {
  const vide = valeur === null || valeur === undefined || valeur === "";

  return (
    <div className={vide ? "hidden" : "block"}>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sane-text-light)]">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-[14px] text-[var(--sane-text)]">{valeur}</dd>
    </div>
  );
}
