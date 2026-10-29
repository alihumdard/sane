"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, CalendarClock, ChevronRight, FileText, Home, Sparkles, Users } from "lucide-react";
import DashboardNavbar, { type CibleRecherche } from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import { ACCENTS, type Accent } from "@/components/dashboard/accents";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

const LIENS: { href: string; label: string; icon: React.ReactNode; accent: Accent; groupe?: string }[] = [
  { href: "/dashboard/recruteur", label: "Tableau de bord", accent: "green", icon: <Home size={18} /> },
  { groupe: "Recrutement", href: "/dashboard/recruteur/offres", label: "Mes offres", accent: "orange", icon: <Briefcase size={18} /> },
  { href: "/dashboard/recruteur/candidatures", label: "Candidatures", accent: "blue", icon: <FileText size={18} /> },
  { href: "/dashboard/recruteur/matching", label: "Candidats correspondants", accent: "teal", icon: <Sparkles size={18} /> },
  { href: "/dashboard/recruteur/entretiens", label: "Entretiens", accent: "orange", icon: <CalendarClock size={18} /> },
  { href: "/dashboard/recruteur/candidats", label: "Rechercher des profils", accent: "blue", icon: <Users size={18} /> },
  { groupe: "Mon compte", href: "/dashboard/recruteur/entreprise", label: "Mon entreprise", accent: "green", icon: <Building2 size={18} /> },
];

/** What the recruiter's search box can reach, by what they might type. */
const CIBLES: CibleRecherche[] = [
  { mots: ["offre", "poste", "annonce", "publier"], label: "Mes offres", href: "/dashboard/recruteur/offres", icon: <Briefcase size={14} /> },
  { mots: ["candidature", "postulant", "dossier"], label: "Candidatures", href: "/dashboard/recruteur/candidatures", icon: <FileText size={14} /> },
  { mots: ["correspondance", "matching", "suggestion"], label: "Candidats correspondants", href: "/dashboard/recruteur/matching", icon: <Sparkles size={14} /> },
  { mots: ["entretien", "rendez", "creneau", "planning"], label: "Entretiens", href: "/dashboard/recruteur/entretiens", icon: <CalendarClock size={14} /> },
  { mots: ["candidat", "profil", "cv", "recherche"], label: "Rechercher des profils", href: "/dashboard/recruteur/candidats", icon: <Users size={14} /> },
  { mots: ["entreprise", "societe", "logo", "fiche"], label: "Mon entreprise", href: "/dashboard/recruteur/entreprise", icon: <Building2 size={14} /> },
];

/**
 * Shell shared by every recruiter page.
 *
 * It used to carry its own sidebar and its own header — no account menu, no
 * notification bell, no way out but a "Déconnexion" row at the bottom of a
 * column that disappeared below `lg`, where the only navigation left was a
 * row of pills. It now uses the same chrome as the back-office, so the two
 * spaces behave the same way and there is one menu to maintain.
 */
export function RecruteurLayout({
  titre,
  description,
  actions,
  retour,
  children,
}: {
  titre: string;
  description?: string;
  /** Buttons for the page as a whole, shown beside the title. */
  actions?: React.ReactNode;
  /** A page reached from a list: shows "< back to the list". */
  retour?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const [menu, setMenu] = useState(false);

  const items: SidebarItem[] = LIENS.map((l) => ({
    ...l,
    active: pathname === l.href || pathname.startsWith(l.href + "/"),
  }));

  const section = items.find((i) => i.active);
  const couleurs = ACCENTS[LIENS.find((l) => l.label === section?.label)?.accent ?? "green"];

  return (
    <RoleGuard roles={["entreprise", "recruteur"]} espace="l'espace recruteur">
      <div
        className="flex h-screen overflow-hidden bg-[var(--sane-background)]"
        style={{
          // A faint wash from the top, so the page is lit rather than flat.
          backgroundImage:
            "radial-gradient(1100px 420px at 70% -120px, rgba(16,99,45,0.07), transparent 70%)",
        }}
      >
        <Suspense fallback={null}>
          <DashboardSidebar items={items} open={menu} onClose={() => setMenu(false)} espace="Espace recruteur" />
        </Suspense>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardNavbar
            onMenuClick={() => setMenu(true)}
            cibles={CIBLES}
            parametres={{ href: "/dashboard/recruteur/entreprise", label: "Mon entreprise" }}
          />

          <main className="sane-colonne flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">
            <nav aria-label="Fil d'Ariane" className="mb-4 flex flex-wrap items-center gap-1 text-[11px]">
              <Link
                href="/dashboard/recruteur"
                className="inline-flex items-center gap-1 text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)]"
              >
                <Home size={12} /> Espace recruteur
              </Link>

              <ChevronRight
                size={12}
                className={"text-[var(--sane-border)] " + (section && section.label !== titre ? "block" : "hidden")}
              />
              <Link
                href={section?.href ?? "/dashboard/recruteur"}
                className={
                  "text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)] " +
                  (section && section.label !== titre ? "inline" : "hidden")
                }
              >
                {section?.label}
              </Link>

              <ChevronRight
                size={12}
                className={"text-[var(--sane-border)] " + (section && section.label !== titre ? "block" : "hidden")}
              />
              <span className="font-semibold text-[var(--sane-text)]">{titre}</span>
            </nav>

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--sane-border)] pb-5">
              <div className="flex min-w-0 items-start gap-3.5">
                {/* The page's own mark, in the page's own colour. */}
                <span
                  className="mt-0.5 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:flex"
                  style={{ backgroundColor: couleurs.fond, color: couleurs.trait }}
                >
                  {section?.icon}
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
    </RoleGuard>
  );
}
