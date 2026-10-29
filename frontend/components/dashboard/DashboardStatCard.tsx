import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ACCENTS, DEPART, type Accent } from "./accents";

interface Props {
  icon: ReactNode;
  value: string | number;
  label: string;
  /** One of the four validated categorical accents — see app/globals.css. */
  accent: Accent;
  href?: string;
  /** A short state note ("3 en attente") rendered under the label, not a fake delta. */
  note?: string;
}

/**
 * The one stat-tile shape shared by every role's overview (admin, recruiter,
 * jobseeker). Deliberately has no `trend`/`delta` prop: none of these pages
 * have a prior-period figure to compare against, and a fabricated "+12%"
 * would be worse than no trend at all.
 *
 * A tile that leads somewhere says so — a corner arrow that lifts on hover.
 * Eight of them in a row were visually identical whether or not they were
 * clickable, so half the grid looked inert.
 */
export function DashboardStatCard({ icon, value, label, accent, href, note }: Props) {
  const { fond: bg, trait: fg, lueur } = ACCENTS[accent];

  const contenu = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white pb-5 pl-5 pr-5 pt-6 shadow-[0_1px_2px_rgba(16,35,26,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--sane-green-muted)] hover:shadow-[0_18px_38px_-16px_rgba(16,99,45,0.45)]">
      {/*
        The tile's colour as a bar across its top, with a shine crossing it
        again and again. The four accents were only a tinted square behind an
        icon before, which a row of tiles did not read as colour at all.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] overflow-hidden"
        style={{ backgroundColor: fg, boxShadow: "0 1px 10px " + lueur }}
      >
        <span
          className="sane-eclat absolute inset-y-0 w-1/4"
          style={{
            animationDelay: DEPART[accent],
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
          }}
        />
      </span>
      {/* A wash of the tile's own colour, so the four accents read as a set. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-[0.45] blur-2xl transition-all duration-300 group-hover:scale-125 group-hover:opacity-80"
        style={{ backgroundColor: bg }}
      />

      <div className="relative mb-4 flex items-start justify-between">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
          style={{ backgroundColor: bg, color: fg }}
        >
          {icon}
        </span>

        <ArrowUpRight
          size={16}
          aria-hidden
          className={
            "sane-fleche sane-fleche-haut shrink-0 text-[var(--sane-border)] group-hover:text-[var(--sane-green)] " +
            (href ? "block" : "hidden")
          }
        />
      </div>

      <p className="relative text-[30px] font-extrabold leading-none tracking-[-0.02em] text-[var(--sane-text)]">
        {value}
      </p>
      <p className="relative mt-2 text-[12.5px] font-medium leading-snug text-[var(--sane-text-light)]">
        {label}
      </p>

      {/* Pinned to the bottom so cards without a note still line up with ones
          that have a two-line label above them. */}
      <p className="relative mt-auto pt-2.5 text-[11px] font-semibold" style={{ color: fg }}>
        {note ?? " "}
      </p>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {contenu}
    </Link>
  ) : (
    contenu
  );
}
