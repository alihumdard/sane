"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, CalendarClock, FileText, Home, LogOut, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";

const LIENS = [
  { href: "/dashboard/recruteur", label: "Tableau de bord", icon: Home },
  { href: "/dashboard/recruteur/offres", label: "Mes offres", icon: Briefcase },
  { href: "/dashboard/recruteur/candidatures", label: "Candidatures", icon: FileText },
  { href: "/dashboard/recruteur/matching", label: "Candidats correspondants", icon: Sparkles },
  { href: "/dashboard/recruteur/entretiens", label: "Entretiens", icon: CalendarClock },
  { href: "/dashboard/recruteur/candidats", label: "Rechercher des profils", icon: Users },
  { href: "/dashboard/recruteur/entreprise", label: "Mon entreprise", icon: Building2 },
];

/** Shell shared by every recruiter page: sidebar, header, content slot. */
export function RecruteurLayout({
  titre,
  description,
  children,
}: {
  titre: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[var(--sane-background)]">
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 overflow-y-auto border-r border-[var(--sane-border)] bg-white lg:block">
        <div className="border-b border-[var(--sane-border)] px-5 py-4">
          <p className="text-[15px] font-bold text-[var(--sane-green-deep)]">SANEM</p>
          <p className="text-[11px] text-[var(--sane-text-light)]">Espace recruteur</p>
        </div>

        <nav className="flex flex-col gap-0.5 p-3">
          {LIENS.map(({ href, label, icon: Icon }) => {
            const actif = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={actif ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  actif
                    ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
                    : "text-[var(--sane-text)] hover:bg-[var(--sane-background)]"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => logout()}
            className="mt-2 flex items-center gap-2.5 rounded-lg border-t border-[var(--sane-border)] px-3 py-2.5 pt-4 text-left text-[13px] font-medium text-[var(--sane-text)] hover:bg-[var(--sane-background)]"
          >
            <LogOut size={17} /> Déconnexion
          </button>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <header className="border-b border-[var(--sane-border)] bg-white px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold text-[var(--sane-green-deep)]">{titre}</h1>
              {description && (
                <p className="text-[12px] text-[var(--sane-text-light)]">{description}</p>
              )}
            </div>
            {user && (
              <p className="text-[12px] text-[var(--sane-text-light)]">
                {user.nom} · <span className="font-semibold">{user.role_label}</span>
              </p>
            )}
          </div>

          {/* Mobile nav — the sidebar is hidden below lg. */}
          <nav className="mt-3 flex min-w-0 gap-2 overflow-x-auto lg:hidden">
            {LIENS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  pathname === href
                    ? "bg-[var(--sane-green)] text-white"
                    : "bg-[var(--sane-background)] text-[var(--sane-text)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
