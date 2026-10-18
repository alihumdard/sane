import type { ReactNode } from "react";
import Link from "next/link";

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
 */
export function DashboardStatCard({ icon, value, label, accent, href, note }: Props) {
  const { bg, fg } = ACCENTS[accent];

  const contenu = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(16,99,45,0.25)]">
      <span
        className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
        style={{ backgroundColor: bg, color: fg }}
      >
        {icon}
      </span>
      <p className="text-[28px] font-extrabold leading-none tracking-tight text-[var(--sane-text)]">{value}</p>
      <p className="mt-1.5 text-[12.5px] font-medium leading-snug text-[var(--sane-text-light)]">{label}</p>
      {/* Pinned to the bottom so cards without a note still line up with ones
          that have a two-line label above them. */}
      <p className="mt-auto pt-2 text-[11px] font-semibold" style={{ color: fg }}>
        {note ?? " "}
      </p>
    </div>
  );

  return href ? <Link href={href} className="block h-full">{contenu}</Link> : contenu;
}
