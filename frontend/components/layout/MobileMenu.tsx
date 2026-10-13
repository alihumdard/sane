"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { NAVIGATION } from "@/lib/constants";
import { ACCUEIL_PAR_ROLE, useAuth } from "@/lib/auth";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--sane-border)] text-[var(--sane-green)]"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[72px] border-b border-[var(--sane-border)] bg-white px-5 py-5 shadow-lg">
          <nav className="flex flex-col">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--sane-c-eef3ef)] py-3 text-sm font-semibold text-[var(--sane-text)]"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="mt-4">
                <p className="truncate text-sm font-bold text-[var(--sane-text)]">{user.nom}</p>
                <p className="mb-3 truncate text-[12px] opacity-70">{user.role_label}</p>

                <Link
                  href={ACCUEIL_PAR_ROLE[user.role]}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-[var(--sane-green)] px-4 py-3 text-center text-sm font-bold text-[var(--sane-green)]"
                >
                  Mon espace
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    setOpen(false);
                    await logout();
                    router.push("/");
                  }}
                  className="mt-3 w-full rounded-lg border border-[var(--sane-border)] px-4 py-3 text-center text-sm font-bold text-[var(--sane-red-dark)]"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[var(--sane-green)] px-4 py-3 text-center text-sm font-bold text-[var(--sane-green)]"
                >
                  Se connecter
                </Link>

                <Link
                  href="/creer-compte"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-[var(--sane-orange)] px-4 py-3 text-center text-sm font-bold text-white !text-white"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}