"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { ReactNode } from "react";

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
  "Contenus": "/dashboard/admin/actualites",
  "Communication": "/dashboard/admin/notifications",
};
const ADMIN_SUB_ROUTES: Record<string, string> = {
  "Candidatures": "/dashboard/admin/candidatures",
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

export interface SidebarItem {
  icon: ReactNode;
  label: string;
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

export default function DashboardSidebar({ items, open = false, onClose }: Props) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isAdmin = pathname.startsWith("/dashboard/admin");
  const [toggled, setToggled] = useState<Record<number, boolean>>({});
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
        flex w-[250px] shrink-0 flex-col border-r border-[#DDE8E0] bg-white
        fixed inset-y-0 left-0 z-40 transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F9F6] lg:hidden"
        >
          <X size={14} className="text-[#61756B]" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center px-5 pt-5 pb-2">
          <div className="flex items-center gap-1">
            <svg width="36" height="36" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#10632D"/>
              <text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANE</text>
              <path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-[18px] font-extrabold text-[#1e3a5f]">SANE</span>
          </div>
          <span className="text-[7px] font-semibold tracking-[0.15em] text-[#61756B] uppercase">Salon National de l&apos;Emploi</span>
          <svg className="mt-2" width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,5 5,10 0,5" fill="#E57617"/>
          </svg>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {items.map((item, i) => (
            <div key={i}>
              {item.dividerBefore && <div className="my-2 border-t border-[#DDE8E0]" />}
              {(() => {
                const href = isAdmin ? ADMIN_ROUTES[item.label] : undefined;
                const hasSub = !!item.subItems?.length;
                const cls = `flex w-full items-center gap-2.5 py-2 mb-0.5 text-left transition-all ${
                  item.active
                    ? "text-[#10632D] font-bold pl-3 pr-3 border-l-[3px] border-[#10632D] bg-[#F5F9F6]"
                    : "text-[#10632D] hover:bg-[#F5F9F6] rounded-lg px-3"
                }`;
                const inner = (
                  <>
                    <span className="text-[#10632D]">{item.icon}</span>
                    <span className="flex-1 text-[12px]">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E57617] px-1 text-[9px] font-bold text-white">{item.badge}</span>
                    )}
                    {item.chevron && (
                      <span
                        role="button"
                        onClick={(e) => {
                          if (!hasSub) return;
                          e.preventDefault();
                          e.stopPropagation();
                          setToggled((t) => ({ ...t, [i]: !isExpanded(item, i) }));
                        }}
                      >
                        {isExpanded(item, i) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </>
                );
                return href && href !== pathname ? (
                  <Link href={href} onClick={onClose} className={cls}>{inner}</Link>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    onClick={() => hasSub && setToggled((t) => ({ ...t, [i]: !isExpanded(item, i) }))}
                  >
                    {inner}
                  </button>
                );
              })()}
              {isExpanded(item, i) && item.subItems && (
                <div className="ml-4 mb-1 border-l border-[#DDE8E0]">
                  {item.subItems.map((sub, si) => {
                    const isActive = si === (item.activeSubIndex ?? 0);
                    const subHref = isAdmin ? ADMIN_SUB_ROUTES[sub] : undefined;
                    const addRoute = isAdmin ? ADMIN_ADD_ROUTES[sub] : undefined;
                    const subCls = `flex w-full items-center gap-1.5 pl-2 pr-2 py-1 text-[10px] text-left ${
                      isActive ? "text-[#10632D] font-semibold" : "text-[#61756B] hover:text-[#0a2e16]"
                    }`;
                    if (addRoute) {
                      return (
                        <button
                          key={si}
                          type="button"
                          className={subCls}
                          onClick={() => {
                            onClose?.();
                            if (pathname === addRoute) window.dispatchEvent(new Event("admin:add"));
                            else router.push(addRoute + "?add=1");
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-[#61756B]/40" />
                          {sub}
                        </button>
                      );
                    }
                    return subHref && subHref !== pathname ? (
                      <Link key={si} href={subHref} onClick={onClose} className={subCls}>
<span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-[#10632D]" : "bg-[#61756B]/40"}`} />
                        {sub}
                      </Link>
                    ) : (
                      <button key={si} type="button" className={subCls}>
<span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-[#10632D]" : "bg-[#61756B]/40"}`} />
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

      </aside>
    </>
  );
}
