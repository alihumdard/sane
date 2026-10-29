import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Props {
  icon: ReactNode;
  value: string | number;
  label: string;
  /** One of the four validated categorical accents — see app/globals.css. */
  accent: "green" | "orange" | "blue" | "teal";
  href?: string;
  /** A short state note ("3 en attente") rendered under the label, not a fake delta. */
  note?: string;
}

const ACCENTS: Record<Props["accent"], { bg: string; fg: string }> = {
  green: { bg: "var(--sane-green-tint)", fg: "var(--sane-green)" },
  orange: { bg: "var(--sane-orange-tint)", fg: "var(--sane-orange)" },
  blue: { bg: "var(--sane-blue-tint)", fg: "var(--sane-blue)" },
  teal: { bg: "#e6f6f4", fg: "#0d9488" },
};

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
  const { bg, fg } = ACCENTS[accent];

  const contenu = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--sane-green-muted)] hover:shadow-[0_14px_32px_-14px_rgba(16,99,45,0.4)]">
      {/* A wash of the tile's own colour, so the four accents read as a set. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full opacity-[0.35] blur-2xl transition-opacity group-hover:opacity-60"
        style={{ backgroundColor: bg }}
      />

      <div className="relative mb-4 flex items-start justify-between">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
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
