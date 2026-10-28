"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ExternalLink, LogOut, Menu, Search, Settings } from "lucide-react";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { CIBLES_RECHERCHE } from "@/lib/adminNav";
import { useAuth } from "@/lib/auth";

export interface CibleRecherche {
  /** Words an admin might type to reach this page, folded and unaccented. */
  mots: string[];
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface Props {
  onMenuClick?: () => void;
  /** Where the account menu's settings entry points. */
  parametres?: { href: string; label: string };
  /** The pages the search box can reach; the back-office sections by default. */
  cibles?: CibleRecherche[];
  placeholder?: string;
}

/** "Amadou Issoufou" -> "AI", so a face is never invented for an account. */
function initiales(nom: string): string {
  const mots = nom.trim().split(/\s+/).filter(Boolean);

  if (mots.length === 0) return "?";

  return (mots.length > 1 ? mots[0][0] + mots[mots.length - 1][0] : mots[0].slice(0, 2)).toUpperCase();
}

/** Folds accents and case so "actualité" is found by typing "actualite". */
function plier(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * The back-office header.
 *
 * Two things here used to be fiction. The avatar was a stock photo fetched
 * from randomuser.me on every page load, under a name and role written into
 * the component — so every account was shown as "Admin / Administrateur" with
 * a stranger's face. And the search box was an input with no state and no
 * handler: it accepted typing and did nothing with it.
 *
 * Now the name and role come from the session, the avatar is the account's own
 * initials, and the search box goes to the section you asked for.
 */
export default function DashboardNavbar({
  onMenuClick,
  parametres = { href: "/dashboard/admin/parametres", label: "Paramètres" },
  cibles = CIBLES_RECHERCHE,
  placeholder = "Aller à une section…",
}: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [terme, setTerme] = useState("");
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const fermer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenu(false);
        setFocus(false);
      }
    };

    document.addEventListener("mousedown", fermer);

    return () => document.removeEventListener("mousedown", fermer);
  }, []);

  const resultats = useMemo(() => {
    const q = plier(terme.trim());

    if (q.length < 2) return [];

    return cibles
      .filter((c) => plier(c.label).includes(q) || c.mots.some((m) => m.includes(q) || q.includes(m)))
      .slice(0, 6);
  }, [terme, cibles]);

  function ouvrir(href: string) {
    setTerme("");
    setFocus(false);
    router.push(href);
  }

  async function seDeconnecter() {
    setMenu(false);

    try {
      await logout();
    } finally {
      router.replace("/connexion");
    }
  }

  const nom = user?.nom ?? "—";
  const role = user?.role_label ?? "";

  return (
    <header
      ref={ref}
      className="sticky top-0 z-20 flex items-center gap-2 border-b border-[var(--sane-border)] bg-white/95 px-3 py-2.5 backdrop-blur sm:gap-3 sm:px-6"
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--sane-border)] text-[var(--sane-text-light)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)] lg:hidden"
      >
        <Menu size={17} />
      </button>

      <div className="relative min-w-0 flex-1 sm:max-w-[420px]">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]"
        />
        <input
          type="search"
          value={terme}
          onChange={(e) => setTerme(e.target.value)}
          onFocus={() => setFocus(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && resultats[0]) ouvrir(resultats[0].href);
            if (e.key === "Escape") setFocus(false);
          }}
          placeholder={placeholder}
          aria-label="Rechercher une section du back-office"
          className="h-9 w-full rounded-lg border border-[var(--sane-border)] bg-[var(--sane-background)] pl-9 pr-3 text-[12.5px] text-[var(--sane-text)] outline-none transition-colors placeholder:text-[var(--sane-text-light)]/70 focus:border-[var(--sane-green)] focus:bg-white"
        />

        <div
          className={
            "absolute left-0 right-0 top-11 overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white py-1 shadow-xl " +
            (focus && resultats.length > 0 ? "block" : "hidden")
          }
        >
          {resultats.map((r) => (
            <button
              key={r.href}
              type="button"
              onClick={() => ouvrir(r.href)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12.5px] text-[var(--sane-text)] transition-colors hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]"
            >
              <span className="text-[var(--sane-text-light)]">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        <p
          className={
            "absolute left-0 right-0 top-11 rounded-xl border border-[var(--sane-border)] bg-white px-3 py-2.5 text-[12px] text-[var(--sane-text-light)] shadow-xl " +
            (focus && terme.trim().length >= 2 && resultats.length === 0 ? "block" : "hidden")
          }
        >
          Aucune section ne correspond à « {terme.trim()} ».
        </p>
      </div>

      <NotificationBell />

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-label="Menu du compte"
          className="flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-[var(--sane-background)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green)] text-[11px] font-bold text-white">
            {initiales(nom)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block max-w-[140px] truncate text-[12px] font-bold text-[var(--sane-green-deep)]">
              {nom}
            </span>
            <span className="block text-[10px] text-[var(--sane-text-light)]">{role}</span>
          </span>
          <ChevronDown size={14} className="hidden text-[var(--sane-text-light)] sm:block" />
        </button>

        <div
          className={
            "absolute right-0 top-11 w-[220px] overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white py-1 shadow-xl " +
            (menu ? "block" : "hidden")
          }
        >
          <div className="border-b border-[var(--sane-border)] px-3 py-2">
            <p className="truncate text-[12px] font-bold text-[var(--sane-green-deep)]">{nom}</p>
            <p className="truncate text-[10px] text-[var(--sane-text-light)]">{user?.email ?? role}</p>
          </div>

          <Link
            href={parametres.href}
            onClick={() => setMenu(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--sane-text)] transition-colors hover:bg-[var(--sane-background)]"
          >
            <Settings size={13} /> {parametres.label}
          </Link>

          <Link
            href="/"
            target="_blank"
            onClick={() => setMenu(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--sane-text)] transition-colors hover:bg-[var(--sane-background)]"
          >
            <ExternalLink size={13} /> Voir le site public
          </Link>

          <button
            type="button"
            onClick={seDeconnecter}
            className="flex w-full items-center gap-2 border-t border-[var(--sane-border)] px-3 py-2 text-left text-[12px] font-semibold text-[var(--sane-red-dark)] transition-colors hover:bg-[#fdf1f1]"
          >
            <LogOut size={13} /> Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
