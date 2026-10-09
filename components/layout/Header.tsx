"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, X } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sane-border)] bg-white/95 backdrop-blur">
      <div className="sane-container flex h-[72px] items-center justify-between gap-4 lg:gap-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center lg:-ml-4">
          <Image
            src="/new-logo.png"
            alt="SANEM Logo"
            width={100}
            height={34}
            priority
            className="h-10 w-auto"
          />
          <Image
            src="/sane-logo.png"
            alt="ANPE Logo"
            width={48}
            height={48}
            className="h-10 w-10 object-contain lg:h-[72px] lg:w-[72px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 lg:flex xl:gap-3">
          {NAVIGATION.map((item) => {
            const hasDropdown = item.label === "Emploi";
            const isActive = mounted && (
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href))
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-1 py-1.5 text-[12px] font-semibold transition-colors xl:text-[13px] ${
                  isActive
                    ? "text-[var(--sane-green)]"
                    : "text-[var(--sane-text)] hover:text-[var(--sane-green)]"
                }`}
              >
                {item.label}

                {hasDropdown && (
                  <ChevronDown
                    size={13}
                    strokeWidth={2}
                    className="transition-transform group-hover:rotate-180"
                  />
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--sane-orange)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3 -mr-4">
          {/* Search — visible on all screens */}
          <button
            type="button"
            aria-label="Rechercher"
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)]"
          >
            <Search size={18} />
          </button>

          {/* Buttons — desktop only */}
          <Link
            href="/connexion"
            className="hidden h-10 items-center justify-center rounded-full border-2 border-[var(--sane-green)] px-4 text-[13px] font-bold text-[var(--sane-green)] transition-all duration-200 hover:bg-[var(--sane-green)] hover:!text-white lg:inline-flex xl:px-5"
          >
            Se connecter
          </Link>

          <Link
            href="/inscription"
            className="hidden h-10 items-center justify-center rounded-full bg-[var(--sane-orange)] px-4 text-[13px] font-bold text-white !text-white transition-all duration-200 hover:bg-[var(--sane-orange-dark)] hover:!text-white lg:inline-flex xl:px-5"
          >
            S&apos;inscrire
          </Link>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-[72px] z-40 border-b border-[var(--sane-border)] bg-white px-4 py-4 shadow-lg">
          <div className="sane-container flex items-center gap-3">
            <Search size={20} className="shrink-0 text-[var(--sane-c-71857a)]" />

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un emploi, une formation..."
              className="w-full bg-transparent text-sm text-[var(--sane-text)] outline-none placeholder:text-[var(--sane-c-8a9a91)]"
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--sane-c-71857a)] transition-colors hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
