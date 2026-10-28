"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, X } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export interface SidebarItem {
  icon: ReactNode;
  label: string;
  /** The page this entry opens. Every entry has one. */
  href: string;
  active?: boolean;
  subItems?: { label: string; href: string }[];
  badge?: number;
}

interface Props {
  items: SidebarItem[];
  open?: boolean;
  onClose?: () => void;
  /** Shown under the logo, e.g. "Back-office" or "Espace recruteur". */
  espace?: string;
}

/**
 * The back-office menu.
 *
 * Nothing here is decorative: each entry and sub-entry carries the route it
 * opens, so there is no longer a class of menu item that looks clickable and
 * does nothing. The previous version matched labels against three lookup
 * tables, dropped whatever it could not resolve, and rendered the rest as
 * inert buttons whenever the label happened to be the current page.
 */
export default function DashboardSidebar({ items, open = false, onClose, espace = "Back-office" }: Props) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { user, logout } = useAuth();
  const [replies, setReplies] = useState<Record<string, boolean>>({});

  async function seDeconnecter() {
    onClose?.();

    try {
      await logout();
    } finally {
      router.replace("/connexion");
    }
  }

  const ouvert = (item: SidebarItem) => replies[item.label] ?? Boolean(item.active);

  return (
    <>
      {/*
        Mobile backdrop. Kept mounted and toggled with a class: Google
        Translate holds references into the subtree, and inserting or removing
        a node around them kills the page.
      */}
      <div
        onClick={onClose}
        aria-hidden
        className={"fixed inset-0 z-30 bg-[var(--sane-green-deep)]/40 lg:hidden " + (open ? "block" : "hidden")}
      />

      <aside
        className={
          "fixed inset-y-0 left-0 z-40 flex w-[258px] shrink-0 flex-col border-r border-[var(--sane-border)] bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 " +
          (open ? "translate-x-0 shadow-2xl" : "-translate-x-full")
        }
      >
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sane-background)] text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)] lg:hidden"
        >
          <X size={14} />
        </button>

        <Link
          href="/"
          title="Voir le site public"
          className="flex shrink-0 flex-col items-center gap-1 border-b border-[var(--sane-border)] px-5 py-4"
        >
          <Image
            src="/new-logo.png"
            alt="SANEM"
            width={116}
            height={78}
            priority
            className="h-auto w-[116px] object-contain"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--sane-text-light)]">
            {espace}
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {items.map((item) => {
            const expansible = Boolean(item.subItems?.length);
            const deplie = expansible && ouvert(item);
            const ici = item.active;

            const contenu = (
              <>
                <span className={ici ? "text-[var(--sane-green)]" : "text-[var(--sane-text-light)]"}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate text-[12.5px]">{item.label}</span>
                <span
                  aria-hidden
                  className={
                    "h-4 min-w-4 items-center justify-center rounded-full bg-[var(--sane-orange)] px-1 text-[9px] font-bold text-white " +
                    (item.badge ? "inline-flex" : "hidden")
                  }
                >
                  {item.badge}
                </span>
                <ChevronDown
                  size={14}
                  aria-hidden
                  className={
                    "shrink-0 text-[var(--sane-text-light)] transition-transform " +
                    (expansible ? "block " : "hidden ") +
                    (deplie ? "rotate-180" : "")
                  }
                />
              </>
            );

            const classe =
              "mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-semibold transition-colors " +
              (ici
                ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
                : "text-[var(--sane-text)] hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]");

            return (
              <div key={item.label}>
                {/*
                  A section with sub-entries toggles; one without navigates.
                  Either way the click does something, and the section's own
                  list page is always the first sub-entry.
                */}
                {expansible ? (
                  <button
                    type="button"
                    aria-expanded={deplie}
                    onClick={() => setReplies((r) => ({ ...r, [item.label]: !ouvert(item) }))}
                    className={classe}
                  >
                    {contenu}
                  </button>
                ) : (
                  <Link href={item.href} onClick={onClose} className={classe}>
                    {contenu}
                  </Link>
                )}

                <div
                  className={
                    "mb-1 ml-[22px] border-l border-[var(--sane-border)] pl-2 " + (deplie ? "block" : "hidden")
                  }
                >
                  {item.subItems?.map((sub) => {
                    const actif = sub.href === pathname;

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className={
                          "flex items-center gap-2 rounded-md px-2 py-[6px] text-[11.5px] transition-colors " +
                          (actif
                            ? "font-semibold text-[var(--sane-green)]"
                            : "text-[var(--sane-text-light)] hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]")
                        }
                      >
                        <span
                          aria-hidden
                          className={
                            "h-1.5 w-1.5 shrink-0 rounded-full " +
                            (actif ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-border)]")
                          }
                        />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-[var(--sane-border)] p-3">
          <p className="mb-2 truncate px-3 text-[11px] text-[var(--sane-text-light)]">
            {user ? user.nom + " · " + user.role_label : "—"}
          </p>
          {/*
            Not a link: the token has to be revoked server-side, and navigating
            alone would leave the session live on a shared machine.
          */}
          <button
            type="button"
            onClick={seDeconnecter}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] font-semibold text-[var(--sane-red-dark)] transition-colors hover:bg-[#fdf1f1]"
          >
            <LogOut size={17} /> Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
