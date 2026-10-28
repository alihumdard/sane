"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, CalendarClock, Heart, LayoutDashboard, UserRound } from "lucide-react";

const LIENS = [
  { href: "/dashboard/participant", label: "Mon tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/profil", label: "Mon profil", icon: UserRound },
  { href: "/dashboard/entretiens", label: "Mes entretiens", icon: CalendarClock },
  { href: "/emploi", label: "Offres d'emploi", icon: Briefcase },
  { href: "/formations", label: "Formations", icon: Heart },
];

/**
 * The jobseeker's own pages, linked to one another.
 *
 * The three screens of this space — the dashboard, the profile and the
 * interviews — sat inside the public header with no way to get from one to
 * the next: the profile page had no link back, and the interviews page was
 * reachable only from a stat tile on the dashboard.
 */
export function NavEspace() {
  const ici = usePathname() ?? "";

  return (
    <nav
      aria-label="Mon espace"
      className="mb-5 flex gap-2 overflow-x-auto rounded-2xl border border-[var(--sane-border)] bg-white p-2"
    >
      {LIENS.map(({ href, label, icon: Icon }) => {
        const actif = ici === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={actif ? "page" : undefined}
            className={
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold transition-colors " +
              (actif
                ? "bg-[var(--sane-green)] text-white"
                : "text-[var(--sane-text)] hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]")
            }
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
