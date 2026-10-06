"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

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
                className="border-b border-[#eef3ef] py-3 text-sm font-semibold text-[var(--sane-text)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/connexion"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[var(--sane-green)] px-4 py-3 text-center text-sm font-bold text-[var(--sane-green)]"
              >
                Se connecter
              </Link>

              <Link
                href="/inscription"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-[var(--sane-orange)] px-4 py-3 text-center text-sm font-bold text-white !text-white"
              >
                S&apos;inscrire
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}