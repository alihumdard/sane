"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { ReactNode } from "react";

/*
 * The sidebar only shows pages that really exist.
 *  - top-level entries need a route (item.href, ADMIN_ROUTES or a per-dashboard fallback)
 *  - dropdown entries need a route too; a dropdown with a single entry is shown as a plain link
 * To expose a new page, add its route below.
 */

/* Admin sections -> routes (only applied on /dashboard/admin/* pages) */
const ADMIN_ROUTES: Record<string, string> = {
  "Tableau de bord": "/dashboard/admin",
  "Utilisateurs": "/dashboard/admin/utilisateurs",
  "Emploi": "/dashboard/admin/emploi",
  "Formations": "/dashboard/admin/formations",
  "Événements": "/dashboard/admin/evenements",
  "Intervenants": "/dashboard/admin/intervenants",
  "Partenaires": "/dashboard/admin/partenaires",
  "Presse": "/dashboard/admin/presse",
  "FAQ": "/dashboard/admin/faq",
  "Notifications": "/dashboard/admin/notifications",
  "Rapports": "/dashboard/admin/rapports",
  "Paramètres": "/dashboard/admin/parametres",
  "Actualités": "/dashboard/admin/actualites",
};
const ADMIN_SUB_ROUTES: Record<string, string> = {
  "Candidatures": "/dashboard/admin/candidatures",
  "Inscriptions": "/dashboard/admin/inscriptions",
};
/* "Ajouter ..." entries open the add form of the matching section */
const ADMIN_ADD_ROUTES: Record<string, string> = {
  "Ajouter une offre": "/dashboard/admin/emploi",
  "Ajouter une formation": "/dashboard/admin/formations",
  "Ajouter un événement": "/dashboard/admin/evenements",
  "Ajouter un intervenant": "/dashboard/admin/intervenants",
  "Ajouter un partenaire": "/dashboard/admin/partenaires",
  "Ajouter une actualité": "/dashboard/admin/actualites",
  "Ajouter un communiqué": "/dashboard/admin/presse",
  "Ajouter une question": "/dashboard/admin/faq",
  "Créer une notification": "/dashboard/admin/notifications",
  "Générer un rapport": "/dashboard/admin/rapports",
};

/* Non-admin dashboards: entries that already have a page */
const MANAGEMENT_ROUTES: Record<string, string> = {
  "Événements": "/dashboard/admin/evenements",
  "Formations": "/dashboard/admin/formations",
  "Intervenants": "/dashboard/admin/intervenants",
  "Partenaires": "/dashboard/admin/partenaires",
  "Rapports": "/dashboard/admin/rapports",
  "Notifications": "/dashboard/admin/notifications",
  "Paramètres": "/dashboard/admin/parametres",
  "Programme": "/programme",
};
const PARTICIPANT_ROUTES: Record<string, string> = {
  "Mes formations": "/formations",
  "Mes opportunités": "/emploi",
  "Aide & FAQ": "/faq",
  "Déconnexion": "/connexion",
};
const FALLBACK_ROUTES: Record<string, Record<string, string>> = {
  "/dashboard/organisateur": MANAGEMENT_ROUTES,
  "/dashboard/participant": PARTICIPANT_ROUTES,
  "/dashboard/moussa": PARTICIPANT_ROUTES,
};

export interface SidebarItem {
  icon: ReactNode;
  label: string;
  /** page this entry opens (when the page exists) */
  href?: string;
  active?: boolean;
  chevron?: boolean;
  expanded?: boolean;
  subItems?: string[];
  activeSubIndex?: number;
  badge?: number;
  dividerBefore?: boolean;
}

interface Props {
  items: SidebarItem[];
  open?: boolean;
  onClose?: () => void;
}

interface SubEntry {
  label: string;
  /** index in the original subItems list (activeSubIndex refers to it) */
  idx: number;
  href?: string;
  addRoute?: string;
}

export default function DashboardSidebar({ items, open = false, onClose }: Props) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isAdmin = pathname.startsWith("/dashboard/admin");
  const fallback = FALLBACK_ROUTES[pathname] ?? {};
  const [toggled, setToggled] = useState<Record<number, boolean>>({});

  const resolveHref = (item: SidebarItem) => item.href ?? (isAdmin ? ADMIN_ROUTES[item.label] : fallback[item.label]);

  /** dropdown entries that have a page; the first entry is the section's own list page */
  const resolveSubs = (item: SidebarItem, sectionHref?: string): SubEntry[] => {
    if (!isAdmin || !item.subItems) return [];
    return item.subItems
      .map((label, idx): SubEntry => ({
        label,
        idx,
        addRoute: ADMIN_ADD_ROUTES[label],
        href: idx === 0 ? sectionHref : ADMIN_SUB_ROUTES[label],
      }))
      .filter((s) => s.href || s.addRoute);
  };

  const visible = items
    .map((item, i) => {
      const href = resolveHref(item);
      const subs = resolveSubs(item, href);
      return { item, i, href, subs, hasDropdown: subs.length > 1 };
    })
    .filter(({ item, href }) => item.active || !!href);

  const isExpanded = (item: SidebarItem, i: number) => toggled[i] ?? !!item.expanded;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        flex w-[250px] shrink-0 flex-col border-r border-[var(--sane-border)] bg-white
        fixed inset-y-0 left-0 z-40 transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sane-background)] lg:hidden"
        >
          <X size={14} className="text-[var(--sane-text-light)]" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col items-center border-b border-[var(--sane-border)] px-5 pt-4 pb-4"
        >
          <Image
            src="/new-logo.png"
            alt="SANEM Logo"
            width={132}
            height={88}
            priority
            className="h-auto w-[132px] object-contain"
          />
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {visible.map(({ item, i, href, subs, hasDropdown }) => {
            const expanded = hasDropdown && isExpanded(item, i);
            const cls = `flex w-full items-center gap-2.5 py-2 mb-0.5 text-left transition-all ${
              item.active
                ? "text-[var(--sane-green)] font-bold pl-3 pr-3 border-l-[3px] border-[var(--sane-green)] bg-[var(--sane-background)]"
                : "text-[var(--sane-green)] hover:bg-[var(--sane-background)] rounded-lg px-3"
            }`;
            const inner = (
              <>
                <span className="text-[var(--sane-green)]">{item.icon}</span>
                <span className="flex-1 text-[12px]">{item.label}</span>
                {item.badge && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--sane-orange)] px-1 text-[9px] font-bold text-white">{item.badge}</span>
                )}
                {hasDropdown && (
                  <span
                    role="button"
                    aria-label={expanded ? "Replier" : "Déplier"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setToggled((t) => ({ ...t, [i]: !isExpanded(item, i) }));
                    }}
                  >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </>
            );

            return (
              <div key={item.label}>
                {item.dividerBefore && <div className="my-2 border-t border-[var(--sane-border)]" />}

                {href && href !== pathname ? (
                  <Link href={href} onClick={onClose} className={cls}>{inner}</Link>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    onClick={() => hasDropdown && setToggled((t) => ({ ...t, [i]: !isExpanded(item, i) }))}
                  >
                    {inner}
                  </button>
                )}

                {expanded && (
                  <div className="ml-4 mb-1 border-l border-[var(--sane-border)]">
                    {subs.map((sub) => {
                      const isActive = sub.idx === (item.activeSubIndex ?? 0);
                      const subCls = `flex w-full items-center gap-1.5 pl-2 pr-2 py-1 text-[10px] text-left ${
                        isActive ? "text-[var(--sane-green)] font-semibold" : "text-[var(--sane-text-light)] hover:text-[var(--sane-green-deep)]"
                      }`;
                      const dot = (
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-[var(--sane-green)]" : "bg-[var(--sane-text-light)]/40"}`} />
                      );

                      if (sub.addRoute) {
                        const addRoute = sub.addRoute;
                        return (
                          <button
                            key={sub.label}
                            type="button"
                            className={subCls}
                            onClick={() => {
                              onClose?.();
                              if (pathname === addRoute) window.dispatchEvent(new Event("admin:add"));
                              else router.push(addRoute + "?add=1");
                            }}
                          >
                            {dot}
                            {sub.label}
                          </button>
                        );
                      }
                      return sub.href && sub.href !== pathname ? (
                        <Link key={sub.label} href={sub.href} onClick={onClose} className={subCls}>
                          {dot}
                          {sub.label}
                        </Link>
                      ) : (
                        <button key={sub.label} type="button" className={subCls}>
                          {dot}
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

      </aside>
    </>
  );
}
