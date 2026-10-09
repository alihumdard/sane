"use client";

import { Check } from "lucide-react";
import { typeParticipationOptions, type TypeParticipationValue } from "./data";

interface Props {
  value: string;
  onChange: (value: TypeParticipationValue) => void;
}

export function ParticipationStep({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Type de participation</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {typeParticipationOptions.map(({ value: v, titre, description, icon: Icon }) => {
          const selected = value === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(v)}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                selected
                  ? "border-[var(--sane-green)] bg-[var(--sane-green-light)]"
                  : "border-[var(--sane-border)] bg-white hover:border-[var(--sane-green)]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  selected ? "bg-[var(--sane-green)] text-white" : "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
                }`}
              >
                {selected ? <Check size={18} /> : <Icon size={18} />}
              </span>
              <span className="min-w-0">
                <span className="block text-[length:var(--fs-small)] font-bold text-[var(--sane-text)]">{titre}</span>
                <span className="sane-small mt-0.5 block text-[12px]">{description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
