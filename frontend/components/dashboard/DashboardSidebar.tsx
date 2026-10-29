"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ExternalLink, LogOut, X } from "lucide-react";
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
  /**
   * Heading this entry starts. Thirteen sections ran as one unbroken column,
   * so finding "Presse" meant reading the whole list; they are grouped by
   * what they are for now.
   */
  groupe?: string;
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

  /*
   * The query string, for the sub-entries that differ only by it: Emploi's
   * Entreprises and Entretiens are ?onglet= on one page, and comparing the
   * path alone highlighted "Offres" whichever of the three was open.
   *
   * Read after mounting rather than with useSearchParams, which would make
   * every back-office page render on demand for the sake of a highlight. The
   * first paint matches what the server sent; the highlight corrects itself
   * immediately after.
   */
  /*
   * The query string, for the sub-entries that differ only by it: Emploi's
   * three lists share one path and are told apart by ?onglet=.
   *
   * This is why the shells wrap the sidebar in a Suspense boundary — reading
   * the query is what asks for one.
   */
  const params = useSearchParams();
  const requete = params.size > 0 ? "?" + params.toString() : "";

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
          "fixed inset-y-0 left-0 z-40 flex w-[258px] shrink-0 flex-col border-r border-[var(--sane-border)] bg-white shadow-[1px_0_0_rgba(16,35,26,0.02),8px_0_28px_-24px_rgba(16,99,45,0.4)] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 " +
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

        {/*
          The mark leads back to the public site, which the old block never
          said: a logo, a grey word, and nothing to suggest either was for
          clicking.
        */}
        <Link
          href="/"
          title="Voir le site public"
          className="group relative flex shrink-0 flex-col items-center gap-2.5 overflow-hidden px-4 pb-3 pt-3.5"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(16,99,45,0.055) 0%, rgba(16,99,45,0.015) 55%, transparent 100%)",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-12 left-1/2 h-24 w-52 -translate-x-1/2 rounded-full bg-[var(--sane-green)]/12 blur-3xl transition-opacity duration-500 group-hover:opacity-75"
          />

          {/*
            Appears on hover rather than sitting there: the block has always
            led to the public site and nothing said so, but a permanent icon
            over a logo reads as part of the mark.
          */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-2.5 top-2.5 text-[var(--sane-green)] opacity-0 transition-opacity duration-200 group-hover:opacity-70"
          >
            <ExternalLink size={13} />
          </span>

          <Image
            src="/new-logo.png"
            alt="SANEM"
            width={168}
            height={62}
            priority
            className="relative h-auto w-full max-w-[168px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />

          <span className="relative inline-flex items-center gap-1.5 rounded-full border border-[var(--sane-green-muted)]/60 bg-white px-3 py-[5px] text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--sane-green)] shadow-[0_1px_2px_rgba(16,99,45,0.08)]">
            <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-[var(--sane-orange)]" />
            {espace}
          </span>

          {/*
            The brand's two colours as the edge of the block, instead of the
            same grey hairline that separates everything else — with a light
            travelling along it, over and over, so the panel has one thing in
            it that is alive.
          */}
          <span
            aria-hidden
            className="sane-ruban pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
            style={{
              // The two brand colours, repeated, flowing along the edge. The
              // mask fades both ends so it reads as an edge rather than as a
              // bar drawn across the panel.
              backgroundImage:
                "linear-gradient(90deg, var(--sane-green), var(--sane-orange), var(--sane-green), var(--sane-orange), var(--sane-green))",
              backgroundSize: "200% 100%",
              maskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)",
            }}
          />
        </Link>

        <nav className="sane-colonne flex-1 overflow-y-auto px-3 py-3">
          {items.map((item) => {
            const expansible = Boolean(item.subItems?.length);
            const deplie = expansible && ouvert(item);
            const ici = item.active;

            const contenu = (
              <>
                <span
                  className={
                    "sane-fleche flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors " +
                    (ici
                      ? "bg-white text-[var(--sane-green)] shadow-[0_1px_2px_rgba(16,99,45,0.18)]"
                      : "text-[var(--sane-text-light)] group-hover:text-[var(--sane-green)]")
                  }
                >
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
              "group relative mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-semibold transition-all " +
              (ici
                ? "bg-[var(--sane-green-light)] text-[var(--sane-green)] shadow-[inset_3px_0_0_var(--sane-green)]"
                : "text-[var(--sane-text)] hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]");

            return (
              <div key={item.label}>
                <p
                  className={
                    "mt-3 border-t border-[var(--sane-border)]/70 px-3 pb-2 pt-4 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--sane-text-light)]/60 " +
                    (item.groupe ? "block" : "hidden")
                  }
                >
                  {item.groupe}
                </p>

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

                {/*
                  The rule starts under the section's icon, so a sub-entry
                  reads as hanging from its parent rather than from the edge
                  of the panel.
                */}
                <div
                  className={
                    "mb-1.5 ml-[26px] space-y-[1px] border-l-2 border-[var(--sane-green-light)] pl-2.5 " +
                    (deplie ? "block" : "hidden")
                  }
                >
                  {item.subItems?.map((sub) => {
                    // The whole address, query included: Emploi's three
                    // lists share one path and differ only by ?onglet=.
                    const actif = sub.href === pathname + requete;

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className={
                          "flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[11.5px] transition-colors " +
                          (actif
                            ? "bg-[var(--sane-green-light)]/70 font-semibold text-[var(--sane-green)]"
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
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-[var(--sane-background)] px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green)] text-[11px] font-bold text-white">
              {(user?.nom ?? "?")
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((m) => m[0])
                .join("")
                .toUpperCase() || "?"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-bold text-[var(--sane-text)]">
                {user?.nom ?? "—"}
              </span>
              <span className="block truncate text-[10.5px] text-[var(--sane-text-light)]">
                {user?.role_label ?? ""}
              </span>
            </span>
          </div>
          {/*
            Not a link: the token has to be revoked server-side, and navigating
            alone would leave the session live on a shared machine.
          */}
          <button
            type="button"
            onClick={seDeconnecter}
            className="group flex w-full items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left text-[12.5px] font-semibold text-[var(--sane-red-dark)] transition-all hover:border-[#f3d4d4] hover:bg-[#fdf1f1]"
          >
            <span className="sane-fleche flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
              <LogOut size={16} />
            </span>
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
