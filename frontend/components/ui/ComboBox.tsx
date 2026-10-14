"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { fieldClass } from "./styles";

/** A flat list, or options grouped under headings. */
export type Options = string[] | Record<string, string[]>;

interface Entree {
  valeur: string;
  groupe: string | null;
}

/**
 * Folds accents and case so "Nigerienne" finds "Nigérienne".
 *
 * Someone typing a nationality or a city on a phone keyboard will not reach
 * for the accents, and a filter that misses because of one is worse than no
 * filter at all.
 */
function pliable(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function aplatir(options: Options): Entree[] {
  if (Array.isArray(options)) {
    return options.map((valeur) => ({ valeur, groupe: null }));
  }

  return Object.entries(options).flatMap(([groupe, valeurs]) =>
    valeurs.map((valeur) => ({ valeur, groupe }))
  );
}

/**
 * A select you can type into.
 *
 * The native `<select>` was fine for five nationalities. With seventy-seven it
 * is a scrollbar: the list is longer than the screen, and the only way to
 * reach "Sénégalaise" is to drag past forty others. This filters as you type,
 * keeps the group headings, and is driven entirely from the keyboard.
 *
 * Written rather than installed: the behaviour needed here is a filter, a
 * highlight and five key handlers, which is a good deal less than any of the
 * select libraries weigh.
 *
 * Nothing is mounted or unmounted while the panel is open — the list is
 * rebuilt from the filter each render and the panel itself toggles on a class.
 * Google Translate holds references into this subtree, and removing a node
 * under it kills the page.
 */
export function ComboBox({
  id,
  options,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: {
  id: string;
  options: Options;
  value: string;
  onChange: (valeur: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const entrees = useMemo(() => aplatir(options), [options]);

  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [survole, setSurvole] = useState(0);

  const zone = useRef<HTMLDivElement>(null);
  const champ = useRef<HTMLInputElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const listeId = useId();

  const filtrees = useMemo(() => {
    const terme = pliable(recherche.trim());

    if (!terme) return entrees;

    return entrees.filter((e) => pliable(e.valeur).includes(terme));
  }, [entrees, recherche]);

  // Close on an outside click, and on Escape from anywhere.
  useEffect(() => {
    if (!ouvert) return;

    function surClic(e: MouseEvent) {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    }

    document.addEventListener("mousedown", surClic);

    return () => document.removeEventListener("mousedown", surClic);
  }, [ouvert]);

  // Focus the search box as soon as the panel opens, so typing just works.
  useEffect(() => {
    if (ouvert) champ.current?.focus();
    else setRecherche("");
  }, [ouvert]);

  // Keep the highlighted row in view when arrowing through a long list.
  useEffect(() => {
    if (!ouvert) return;

    liste.current
      ?.querySelector<HTMLElement>(`[data-index="${survole}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [survole, ouvert]);

  function choisir(valeur: string) {
    onChange(valeur);
    setOuvert(false);
  }

  function surTouche(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOuvert(false);

      return;
    }

    if (!ouvert && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOuvert(true);
      setSurvole(0);

      return;
    }

    if (!ouvert) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSurvole((i) => Math.min(i + 1, filtrees.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSurvole((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const choix = filtrees[survole];
      if (choix) choisir(choix.valeur);
    } else if (e.key === "Tab") {
      setOuvert(false);
    }
  }

  let groupePrecedent: string | null = null;

  return (
    <div ref={zone} className="relative">
      {/*
        A hidden native input carries the value, so the field takes part in
        form validation and submission exactly as the `<select>` it replaces.
      */}
      <input type="text" id={id} name={id} value={value} required={required} readOnly tabIndex={-1} aria-hidden className="sr-only" />

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOuvert(!ouvert)}
        onKeyDown={surTouche}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-controls={listeId}
        className={`${fieldClass} flex cursor-pointer items-center justify-between pr-3 text-left disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className={value ? "" : "text-[var(--sane-text-light)]"}>{value || placeholder}</span>
        <ChevronDown size={16} className={`shrink-0 text-[var(--sane-text-light)] transition-transform ${ouvert ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white shadow-lg ${
          ouvert ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-[var(--sane-border)] px-3 py-2">
          <Search size={14} className="shrink-0 text-[var(--sane-text-light)]" />
          <input
            ref={champ}
            type="text"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setSurvole(0);
            }}
            onKeyDown={surTouche}
            placeholder="Rechercher…"
            aria-label="Rechercher dans la liste"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--sane-text-light)]"
          />
        </div>

        <ul ref={liste} id={listeId} role="listbox" className="max-h-60 overflow-y-auto py-1">
          <li
            className={`px-3 py-6 text-center text-[13px] text-[var(--sane-text-light)] ${
              filtrees.length === 0 ? "block" : "hidden"
            }`}
          >
            Aucun résultat pour « {recherche} »
          </li>

          {filtrees.map((e, i) => {
            // Headings only while unfiltered: once a search narrows the list,
            // what matters is the matches, not which group they came from.
            const entete = !recherche && e.groupe && e.groupe !== groupePrecedent ? e.groupe : null;
            groupePrecedent = e.groupe;

            return (
              <li key={`${e.groupe ?? ""}-${e.valeur}`}>
                <p
                  className={`bg-[var(--sane-background)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--sane-text-light)] ${
                    entete ? "block" : "hidden"
                  }`}
                >
                  {entete}
                </p>

                <button
                  type="button"
                  role="option"
                  aria-selected={e.valeur === value}
                  data-index={i}
                  onClick={() => choisir(e.valeur)}
                  onMouseEnter={() => setSurvole(i)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] ${
                    i === survole ? "bg-[var(--sane-green-light)]" : ""
                  } ${e.valeur === value ? "font-semibold text-[var(--sane-green)]" : "text-[var(--sane-text)]"}`}
                >
                  {e.valeur}
                  <Check size={14} className={`shrink-0 ${e.valeur === value ? "opacity-100" : "opacity-0"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
