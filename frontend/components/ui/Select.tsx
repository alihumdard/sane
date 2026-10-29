"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  /** How many records match, when the list comes from the data. */
  total?: number;
}

interface SelectProps {
  options: SelectOption[];
  /** Shown when nothing is chosen, and as the entry that clears the choice. */
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  /** Describes the control to a screen reader; the placeholder by default. */
  label?: string;
  className?: string;
}

/**
 * The dropdown the public pages use instead of a native `<select>`.
 *
 * The native one cannot be styled past its box: the list it opens is drawn by
 * the operating system, in its own font, with its own blue highlight, and on
 * a page built in the salon's greens it arrived looking like a different
 * application. It also cannot show the count beside each sector the way the
 * job board needs.
 *
 * Nothing is mounted or unmounted as it opens and closes — the panel is
 * always in the tree and only its visibility changes. Google Translate holds
 * references into this subtree, and inserting or removing a node under it
 * kills the page.
 *
 * The real value lives with the caller; this keeps no copy of it. The one it
 * replaced did, and never noticed when "Réinitialiser les filtres" cleared
 * the value underneath it: the list went back to showing everything while
 * the box went on naming a sector.
 */
export function Select({
  options,
  placeholder,
  value,
  onChange,
  icon: Icon,
  label,
  className = "",
}: SelectProps) {
  const [ouvert, setOuvert] = useState(false);
  const [survole, setSurvole] = useState(-1);
  const zone = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const idListe = useId();

  const choisi = options.find((o) => o.value === value);

  useEffect(() => {
    if (!ouvert) return;

    function surClic(e: MouseEvent) {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    }

    document.addEventListener("mousedown", surClic);

    return () => document.removeEventListener("mousedown", surClic);
  }, [ouvert]);

  // Opening on the current choice rather than at the top: with twenty-odd
  // sectors, landing on the first one hides the answer already given.
  useEffect(() => {
    if (!ouvert) return;

    const depart = options.findIndex((o) => o.value === value);

    queueMicrotask(() => setSurvole(depart));
  }, [ouvert, options, value]);

  useEffect(() => {
    liste.current
      ?.querySelector<HTMLElement>(`[data-rang="${survole}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [survole]);

  function choisir(v: string) {
    onChange(v);
    setOuvert(false);
  }

  function auClavier(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOuvert(false);

      return;
    }

    if (!ouvert && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOuvert(true);

      return;
    }

    if (!ouvert) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSurvole((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSurvole((i) => Math.max(-1, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSurvole(-1);
    } else if (e.key === "End") {
      e.preventDefault();
      setSurvole(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choisir(survole === -1 ? "" : options[survole].value);
    } else if (e.key === "Tab") {
      setOuvert(false);
    }
  }

  const ligne =
    "flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-[13px] transition-colors";

  return (
    <div ref={zone} className={"relative " + className}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        onKeyDown={auClavier}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-controls={idListe}
        aria-label={label ?? placeholder}
        className={
          "flex h-[46px] w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 text-left transition-all sm:h-[52px] " +
          (ouvert
            ? "border-[var(--sane-green)] ring-4 ring-[var(--sane-green)]/8"
            : "border-[var(--sane-border)] hover:border-[var(--sane-green-muted)]")
        }
      >
        {Icon && <Icon size={16} className="shrink-0 text-[var(--sane-text-light)]" />}

        <span
          className={
            "flex-1 truncate text-[13px] sm:text-[14px] " +
            (choisi ? "font-medium text-[var(--sane-text)]" : "text-[var(--sane-text-light)]")
          }
        >
          {choisi?.label ?? placeholder}
        </span>

        <span
          className={
            "shrink-0 rounded-full bg-[var(--sane-green-light)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--sane-green)] " +
            (choisi?.total !== undefined ? "inline-block" : "hidden")
          }
        >
          {choisi?.total}
        </span>

        <ChevronDown
          size={16}
          className={
            "shrink-0 text-[var(--sane-text-light)] transition-transform duration-200 " +
            (ouvert ? "rotate-180" : "")
          }
        />
      </button>

      <ul
        ref={liste}
        id={idListe}
        role="listbox"
        aria-label={label ?? placeholder}
        className={
          "absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[260px] overflow-y-auto rounded-xl border border-[var(--sane-border)] bg-white py-1 shadow-[0_18px_40px_-16px_rgba(16,99,45,0.35)] " +
          (ouvert ? "block" : "hidden")
        }
      >
        {/* Clears the choice; the placeholder names what that means. */}
        <li>
          <button
            type="button"
            data-rang={-1}
            role="option"
            aria-selected={!choisi}
            onClick={() => choisir("")}
            onMouseEnter={() => setSurvole(-1)}
            className={
              ligne +
              " " +
              (survole === -1 ? "bg-[var(--sane-background)] " : "") +
              (choisi ? "text-[var(--sane-text-light)]" : "font-semibold text-[var(--sane-green)]")
            }
          >
            <Check
              size={14}
              className={"shrink-0 " + (choisi ? "invisible" : "text-[var(--sane-green)]")}
            />
            {placeholder}
          </button>
        </li>

        {options.map((o, i) => {
          const actif = o.value === value;

          return (
            <li key={o.value}>
              <button
                type="button"
                data-rang={i}
                role="option"
                aria-selected={actif}
                onClick={() => choisir(o.value)}
                onMouseEnter={() => setSurvole(i)}
                className={
                  ligne +
                  " " +
                  (survole === i ? "bg-[var(--sane-background)] " : "") +
                  (actif ? "font-semibold text-[var(--sane-green)]" : "text-[var(--sane-text)]")
                }
              >
                <Check
                  size={14}
                  className={"shrink-0 " + (actif ? "text-[var(--sane-green)]" : "invisible")}
                />

                <span className="flex-1 truncate">{o.label}</span>

                <span
                  className={
                    "shrink-0 text-[11px] text-[var(--sane-text-light)] " +
                    (o.total !== undefined ? "inline" : "hidden")
                  }
                >
                  {o.total}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
