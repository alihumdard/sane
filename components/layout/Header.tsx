"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronDown } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce8e1] bg-white/95 backdrop-blur">
      <div className="sane-container flex h-[72px] items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-32">
              <Image
                src="/logo.png"
                alt="SANE Logo"
                fill
                priority
                className="object-contain object-left"
                sizes="130px"
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAVIGATION.map((item) => {
            const hasDropdown = item.label === "Emploi";
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-1 py-1.5 text-[12px] font-semibold transition-colors ${
                  isActive
                    ? "text-[#10632D]"
                    : "text-[#17352A] hover:text-[#10632D]"
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
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E57617]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label="Rechercher"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#10632D] transition-colors hover:bg-[#eaf5ee]"
          >
            <Search size={18} />
          </button>

          <Link
            href="/connexion"
            className="rounded-lg border border-[#10632D] px-4 py-2.5 text-xs font-bold text-[#10632D] transition-all duration-200 hover:bg-[#10632D] hover:!text-white"
          >
            Se connecter
          </Link>

          <Link
            href="/inscription"
            className="rounded-lg bg-[#E57617] px-4 py-2.5 text-xs font-bold text-white !text-white transition-all duration-200 hover:bg-[#cf6812] hover:!text-white"
          >
            S&apos;inscrire
          </Link>
        </div>

        {/* Mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
