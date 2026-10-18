"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiEntretien } from "@/lib/types";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const COULEUR_POINT: Record<string, string> = {
  en_attente: "bg-[var(--sane-orange)]",
  confirme: "bg-[var(--sane-green)]",
  termine: "bg-[var(--sane-text-light)]",
  annule: "bg-[var(--sane-red-dark)]",
};

function cleJour(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Month-grid calendar for scheduled interviews — the "calendrier" the
 * contract asks for, distinct from the flat list both dashboards had before.
 * Each day with an interview shows a colored dot per status; clicking a day
 * opens that day's interviews below the grid rather than in a popover, so it
 * works the same on touch as on a mouse.
 */
export function EntretiensCalendrier({
  entretiens,
  renderEntretien,
}: {
  entretiens: ApiEntretien[];
  renderEntretien: (e: ApiEntretien) => React.ReactNode;
}) {
  const [mois, setMois] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [jourChoisi, setJourChoisi] = useState<string | null>(null);

  const parJour = useMemo(() => {
    const m = new Map<string, ApiEntretien[]>();
    for (const e of entretiens) {
      if (!e.creneau) continue;
      const cle = cleJour(new Date(e.creneau.debut));
      m.set(cle, [...(m.get(cle) ?? []), e]);
    }
    return m;
  }, [entretiens]);

  const semaines = useMemo(() => {
    const premierDuMois = new Date(mois.getFullYear(), mois.getMonth(), 1);
    // Monday-first grid: ISO weekday (1=Mon..7=Sun) shifted to a 0-based offset.
    const decalage = (premierDuMois.getDay() + 6) % 7;
    const debutGrille = new Date(premierDuMois);
    debutGrille.setDate(debutGrille.getDate() - decalage);

    const jours: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(debutGrille);
      d.setDate(d.getDate() + i);
      jours.push(d);
    }

    const lignes: Date[][] = [];
    for (let i = 0; i < jours.length; i += 7) lignes.push(jours.slice(i, i + 7));
    return lignes;
  }, [mois]);

  const aujourdHui = cleJour(new Date());
  const entretiensDuJour = jourChoisi ? (parJour.get(jourChoisi) ?? []) : [];

  return (
    <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold capitalize text-[var(--sane-text)]">
          {mois.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Mois précédent"
            onClick={() => setMois((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="rounded-lg p-1.5 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMois(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })}
            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-green)] hover:bg-[var(--sane-green-light)]"
          >
            Aujourd&apos;hui
          </button>
          <button
            type="button"
            aria-label="Mois suivant"
            onClick={() => setMois((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="rounded-lg p-1.5 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid w-full grid-cols-7 gap-y-1" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
        {JOURS.map((j) => (
          <div key={j} className="pb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--sane-text-light)]">
            {j}
          </div>
        ))}

        {semaines.map((semaine) =>
          semaine.map((jour) => {
            const cle = cleJour(jour);
            const horsMois = jour.getMonth() !== mois.getMonth();
            const estAujourdhui = cle === aujourdHui;
            const estChoisi = cle === jourChoisi;
            const evenements = parJour.get(cle) ?? [];

            return (
              <div key={cle} className="flex items-center justify-center py-0.5">
                <button
                  type="button"
                  onClick={() => setJourChoisi((j) => (j === cle ? null : cle))}
                  disabled={evenements.length === 0}
                  className={`flex h-9 w-9 flex-col items-center justify-center gap-0.5 rounded-full text-[12px] transition-colors ${
                    estChoisi
                      ? "bg-[var(--sane-green)] font-bold text-white"
                      : estAujourdhui
                        ? "border border-[var(--sane-green)] font-bold text-[var(--sane-green)]"
                        : horsMois
                          ? "text-[var(--sane-border)]"
                          : "text-[var(--sane-text)] hover:bg-[var(--sane-background)]"
                  } ${evenements.length === 0 ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className="leading-none">{jour.getDate()}</span>
                  {evenements.length > 0 && (
                    <span className="flex gap-0.5">
                      {evenements.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`h-1 w-1 rounded-full ${estChoisi ? "bg-white" : COULEUR_POINT[e.statut] ?? "bg-[var(--sane-text-light)]"}`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {jourChoisi && (
        <div className="mt-4 border-t border-[var(--sane-border)] pt-4">
          <p className="mb-3 text-[12px] font-semibold capitalize text-[var(--sane-text-light)]">
            {(() => {
              const [annee, moisIdx, jour] = jourChoisi.split("-").map(Number);
              return new Date(annee, moisIdx, jour).toLocaleDateString("fr-FR", {
                weekday: "long", day: "numeric", month: "long",
              });
            })()}
          </p>
          {entretiensDuJour.length === 0 ? (
            <p className="text-[12px] text-[var(--sane-text-light)]">Aucun entretien ce jour-là.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {entretiensDuJour.map((e) => (
                <li key={e.id}>{renderEntretien(e)}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
