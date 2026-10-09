"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Clock, Loader2, MapPin, Users } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiFormation, FormationsResponse } from "@/lib/types";

const MAX_FORMATIONS = 5;

interface Props {
  selected: number[];
  onToggle: (id: number, titre: string) => void;
}

export function FormationsStep({ selected, onToggle }: Props) {
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get<FormationsResponse>("/formations")
      .then((res) => {
        if (!cancelled) setFormations(res.data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--sane-border)] py-12">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <p className="sane-small">Chargement des formations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[var(--sane-red-dark)] p-4">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
        <p className="sane-small text-[var(--sane-red-dark)]">
          Impossible de charger les formations. {error}
        </p>
      </div>
    );
  }

  if (formations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--sane-border)] px-6 py-12 text-center">
        <p className="sane-small">Aucune formation n&apos;est disponible pour le moment.</p>
      </div>
    );
  }

  const limitReached = selected.length >= MAX_FORMATIONS;

  return (
    <fieldset>
      <legend className="sr-only">Formations</legend>

      <p className="sane-small mb-4">
        {selected.length === 0
          ? `Vous pouvez choisir jusqu'à ${MAX_FORMATIONS} formations.`
          : `${selected.length} formation${selected.length > 1 ? "s" : ""} sélectionnée${selected.length > 1 ? "s" : ""} sur ${MAX_FORMATIONS} maximum.`}
      </p>

      <div className="flex flex-col gap-2.5">
        {formations.map((f) => {
          const on = selected.includes(f.id);
          const disabled = f.complete || (limitReached && !on);

          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onToggle(f.id, f.titre)}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                on
                  ? "border-[var(--sane-green)] bg-[var(--sane-green-light)]"
                  : disabled
                    ? "cursor-not-allowed border-[var(--sane-border)] bg-[var(--sane-background)] opacity-60"
                    : "border-[var(--sane-border)] bg-white hover:border-[var(--sane-green)]"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                  on ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white" : "border-[var(--sane-border)]"
                }`}
              >
                {on && <Check size={13} />}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[length:var(--fs-small)] font-bold text-[var(--sane-text)]">{f.titre}</span>
                  {f.categorie && (
                    <span className="rounded-full bg-[var(--sane-green-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--sane-green)]">
                      {f.categorie.nom}
                    </span>
                  )}
                </span>

                <span className="sane-small mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} className="text-[var(--sane-orange)]" /> {f.duree}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} className="text-[var(--sane-orange)]" /> {f.lieu}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={11} className="text-[var(--sane-orange)]" />
                    {f.complete ? "Complet" : `${f.places_restantes} place${f.places_restantes > 1 ? "s" : ""}`}
                  </span>
                </span>
              </span>

              <span className="shrink-0 text-[10px] font-semibold text-[var(--sane-text-light)]">
                {f.niveau}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
