"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { ACCUEIL_PAR_ROLE, useAuth } from "@/lib/auth";

/**
 * Account area of the public header.
 *
 * A signed-in visitor used to see "Se connecter / S'inscrire" on every public
 * page, with nothing to say whose session was open or how to leave it — the
 * only way out was to find a dashboard first.
 *
 * While the session is being restored it keeps the signed-out buttons rather
 * than a spinner: that is what the server rendered, and swapping them for a
 * placeholder would flash on every page load for visitors who have no account.
 */
export function MenuCompte() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape, like the search panel beside it.
  useEffect(() => {
    if (!ouvert) return;

    function surClic(e: MouseEvent) {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    }

    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }

    document.addEventListener("mousedown", surClic);
    document.addEventListener("keydown", surTouche);

    return () => {
      document.removeEventListener("mousedown", surClic);
      document.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  async function deconnecter() {
    setOuvert(false);
    await logout();
    router.push("/");
  }

  if (loading || !user) {
    return (
      <>
        <Link
          href="/connexion"
          className="hidden h-10 items-center justify-center rounded-full border-2 border-[var(--sane-green)] px-4 text-[13px] font-bold text-[var(--sane-green)] transition-all duration-200 hover:bg-[var(--sane-green)] hover:!text-white lg:inline-flex xl:px-5"
        >
          Se connecter
        </Link>

        <Link
          href="/creer-compte"
          className="hidden h-10 items-center justify-center rounded-full bg-[var(--sane-orange)] px-4 text-[13px] font-bold text-white !text-white transition-all duration-200 hover:bg-[var(--sane-orange-dark)] hover:!text-white lg:inline-flex xl:px-5"
        >
          S&apos;inscrire
        </Link>
      </>
    );
  }

  const espace = ACCUEIL_PAR_ROLE[user.role];

  return (
    <div ref={zone} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2 rounded-full border-2 border-[var(--sane-green)] pl-2 pr-3 text-[13px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--sane-green)] text-white">
          <UserRound size={14} />
        </span>
        <span className="max-w-[9rem] truncate">{user.nom}</span>
        <ChevronDown size={14} className={ouvert ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {ouvert && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white shadow-lg"
        >
          <div className="border-b border-[var(--sane-border)] px-4 py-3">
            <p className="truncate text-[13px] font-bold text-[var(--sane-text)]">{user.nom}</p>
            <p className="truncate text-[12px] opacity-70">{user.email}</p>
            <p className="mt-1 inline-block rounded-full bg-[var(--sane-green-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--sane-green)]">
              {user.role_label}
            </p>
          </div>

          <Link
            href={espace}
            role="menuitem"
            onClick={() => setOuvert(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-[var(--sane-text)] hover:bg-[var(--sane-green-light)]"
          >
            <LayoutDashboard size={15} /> Mon espace
          </Link>

          <Link
            href="/dashboard/profil"
            role="menuitem"
            onClick={() => setOuvert(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-[var(--sane-text)] hover:bg-[var(--sane-green-light)]"
          >
            <UserRound size={15} /> Mon profil
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={deconnecter}
            className="flex w-full items-center gap-2 border-t border-[var(--sane-border)] px-4 py-2.5 text-left text-[13px] font-semibold text-[var(--sane-red-dark)] hover:bg-[var(--sane-red-light)]"
          >
            <LogOut size={15} /> Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
