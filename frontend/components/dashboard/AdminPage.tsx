"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { AdminGuard } from "./AdminGuard";
import { useBarreLaterale } from "./useBarreLaterale";
import { adminNav, SECTIONS_ADMIN } from "@/lib/adminNav";
import { ACCENTS } from "./accents";

interface Props {
  /**
   * Sidebar entry to highlight. Normally left out: the section is read from
   * the URL, which cannot drift from where the page actually lives — the
   * Programme page used to pass a section name the menu had never heard of,
   * so nothing was highlighted on it.
   */
  section?: string;
  titre: string;
  description?: string;
  /** Buttons for the page as a whole, shown beside the title. */
  actions?: React.ReactNode;
  /** A page reached from a list, e.g. a form: shows "< back to the list". */
  retour?: { href: string; label: string };
  children: React.ReactNode;
}

/** The menu section whose route is the longest prefix of the current URL. */
function sectionDeLUrl(pathname: string): string {
  let gagnant = SECTIONS_ADMIN[0];

  for (const s of SECTIONS_ADMIN) {
    const base = s.href.split("?")[0];

    if ((pathname === base || pathname.startsWith(base + "/")) && base.length > gagnant.href.split("?")[0].length) {
      gagnant = s;
    }
  }

  return gagnant.label;
}

/** Chrome shared by every back-office screen: guard, sidebar, navbar, header. */
export function AdminPage({ section, titre, description, actions, retour, children }: Props) {
  const pathname = usePathname() ?? "/dashboard/admin";
  const [menu, setMenu] = useState(false);
  const { replie, basculer } = useBarreLaterale();

  const active = section ?? sectionDeLUrl(pathname);
  const racine = SECTIONS_ADMIN.find((s) => s.label === active);
  const couleurs = ACCENTS[racine?.accent ?? "green"];

  return (
    <AdminGuard>
      <div
        className="flex h-screen overflow-hidden bg-[var(--sane-background)]"
        style={{
          // A faint wash from the top, so the page is lit rather than flat.
          backgroundImage:
            "radial-gradient(1100px 420px at 70% -120px, rgba(16,99,45,0.07), transparent 70%)",
        }}
      >
        {/*
          The sidebar is off-canvas below lg and the header's hamburger is what
          brings it back. That state used to live in three individual pages, so
          on the thirteen that went through this component the button was wired
          to nothing and the menu could not be opened on a phone at all.
        */}
        <Suspense fallback={null}>
          <DashboardSidebar items={adminNav(active)} open={menu} onClose={() => setMenu(false)} replie={replie} />
        </Suspense>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardNavbar onMenuClick={() => setMenu(true)} onBasculer={basculer} replie={replie} />

          <main className="sane-colonne flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">
            <nav aria-label="Fil d'Ariane" className="mb-4 flex flex-wrap items-center gap-1 text-[11px]">
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center gap-1 text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)]"
              >
                <Home size={12} /> Back-office
              </Link>

              <ChevronRight size={12} className={"text-[var(--sane-border)] " + (racine ? "block" : "hidden")} />
              <Link
                href={racine?.href ?? "/dashboard/admin"}
                className={
                  "text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)] " +
                  (racine && racine.label !== titre ? "inline" : "hidden")
                }
              >
                {racine?.label}
              </Link>

              <ChevronRight
                size={12}
                className={"text-[var(--sane-border)] " + (racine && racine.label !== titre ? "block" : "hidden")}
              />
              <span className="font-semibold text-[var(--sane-text)]">{titre}</span>
            </nav>

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--sane-border)] pb-5">
              <div className="flex min-w-0 items-start gap-3.5">
                {/*
                  The module's own mark, in the module's own colour. Eighteen
                  screens opened on the same black heading over the same white,
                  so one list looked exactly like the next.
                */}
                <span
                  className="mt-0.5 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:flex"
                  style={{ backgroundColor: couleurs.fond, color: couleurs.trait }}
                >
                  {racine?.icon}
                </span>

              <div className="min-w-0">
                <Link
                  href={retour?.href ?? "#"}
                  className={
                    "mb-1.5 items-center gap-1 text-[12px] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-green-dark)] " +
                    (retour ? "inline-flex" : "hidden")
                  }
                >
                  <ChevronRight size={13} className="rotate-180" />
                  {retour?.label}
                </Link>

                <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[var(--sane-green-deep)] sm:text-[26px]">
                  {titre}
                </h1>
                <p
                  className={
                    "mt-1.5 max-w-[640px] text-[13px] leading-relaxed text-[var(--sane-text-light)] " +
                    (description ? "block" : "hidden")
                  }
                >
                  {description}
                </p>
              </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            </div>

            {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
