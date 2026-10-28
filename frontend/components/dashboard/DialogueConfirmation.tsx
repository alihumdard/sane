"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { SpinnerOu } from "./Spinner";

/**
 * Asks before something irreversible, in the page rather than through the
 * browser.
 *
 * `window.confirm` freezes the tab, cannot say which record is about to go,
 * looks nothing like the rest of the back-office, and is invisible to the
 * tools used to test it. Seven places asked that way.
 *
 * Mounted only while something is pending: a dialog is a thing that appears,
 * and nothing inside it is translated in place beforehand.
 */
export function DialogueConfirmation({
  ouvert,
  titre,
  message,
  confirmer = "Supprimer",
  enCours = false,
  onConfirmer,
  onAnnuler,
}: {
  ouvert: boolean;
  titre: string;
  /** What exactly is about to happen, naming the record. */
  message: string;
  confirmer?: string;
  enCours?: boolean;
  onConfirmer: () => void;
  onAnnuler: () => void;
}) {
  // Escape closes it, as it would a native dialog.
  useEffect(() => {
    if (!ouvert) return;

    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") onAnnuler();
    }

    document.addEventListener("keydown", surTouche);

    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert, onAnnuler]);

  if (!ouvert) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-titre"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onAnnuler}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fef2f2]">
            <AlertTriangle size={18} className="text-[var(--sane-red-dark)]" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="confirmation-titre" className="text-[15px] font-bold text-[var(--sane-text)]">
              {titre}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--sane-text-light)]">{message}</p>
          </div>
          <button
            type="button"
            onClick={onAnnuler}
            aria-label="Fermer"
            className="shrink-0 rounded-lg p-1 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onAnnuler}
            disabled={enCours}
            className="rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[13px] font-semibold text-[var(--sane-text)] hover:bg-[var(--sane-background)] disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirmer}
            disabled={enCours}
            autoFocus
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--sane-red-dark)] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-60"
          >
            <SpinnerOu actif={enCours} size={14}>
              <AlertTriangle size={14} />
            </SpinnerOu>
            {confirmer}
          </button>
        </div>
      </div>
    </div>
  );
}
