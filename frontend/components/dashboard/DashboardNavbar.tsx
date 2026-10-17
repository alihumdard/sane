"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { useAuth } from "@/lib/auth";

interface Props {
  searchPlaceholder?: string;
  /** @deprecated the bell now fetches its own count from /notifications. */
  notificationCount?: number;
  userName?: string;
  userRole?: string;
  userImage?: string;
  language?: string;
  onMenuClick?: () => void;
}

export default function DashboardNavbar({
  searchPlaceholder = "Rechercher...",
  userName = "Admin",
  userRole = "Administrateur",
  userImage = "https://randomuser.me/api/portraits/men/32.jpg",
  language = "FR",
  onMenuClick,
}: Props) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { logout } = useAuth();
  const isAdmin = pathname.startsWith("/dashboard/admin");
  const [menu, setMenu] = useState<"user" | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /**
   * Revokes the token server-side before navigating. A plain link to
   * /connexion would leave the session live: the token would still be in
   * localStorage and still valid, so the next visitor on a shared machine
   * would be signed in again on load.
   */
  async function seDeconnecter() {
    setMenu(null);

    try {
      await logout();
    } finally {
      router.replace("/connexion");
    }
  }

  return (
    <header ref={ref} className="relative z-30 flex items-center gap-2 sm:gap-4 border-b border-[var(--sane-border)] bg-white px-3 sm:px-6 py-3">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuClick}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--sane-border)] lg:hidden"
      >
        <Menu size={16} className="text-[var(--sane-text-light)]" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--sane-border)] bg-[var(--sane-background)] px-3 py-2 min-w-0">
        <Search size={14} className="shrink-0 text-[var(--sane-text-light)]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-[12px] text-[var(--sane-green-deep)] placeholder:text-[var(--sane-text-light)]/60 outline-none"
        />
      </div>

      <NotificationBell />

      {/* Language - hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[var(--sane-border)] px-2 py-1.5 shrink-0">
        <span className="text-[12px] font-semibold text-[var(--sane-green-deep)]">{language}</span>
        <ChevronDown size={12} className="text-[var(--sane-text-light)]" />
      </div>

      {/* User */}
      <div className="relative shrink-0">
        <button type="button" onClick={() => setMenu(menu === "user" ? null : "user")} className="flex items-center gap-1.5">
          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--sane-border)]">
            <Image src={userImage} alt={userName} width={32} height={32} className="object-cover" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-bold text-[var(--sane-green-deep)]">{userName}</p>
            <p className="text-[10px] text-[var(--sane-text-light)]">{userRole}</p>
          </div>
          <ChevronDown size={14} className="hidden sm:block text-[var(--sane-text-light)]" />
        </button>
        {menu === "user" && (
          <div className="absolute right-0 top-10 z-40 w-[200px] rounded-xl border border-[var(--sane-border)] bg-white py-1 shadow-xl">
            <div className="border-b border-[var(--sane-border)] px-3 py-2">
              <p className="text-[12px] font-bold text-[var(--sane-green-deep)]">{userName}</p>
              <p className="text-[10px] text-[var(--sane-text-light)]">{userRole}</p>
            </div>
            {isAdmin && (
              <Link href="/dashboard/admin/parametres" onClick={() => setMenu(null)} className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--sane-green-deep)] hover:bg-[var(--sane-background)]">
                <Settings size={13} /> Paramètres
              </Link>
            )}
            <Link href="/" onClick={() => setMenu(null)} className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--sane-green-deep)] hover:bg-[var(--sane-background)]">
              <User size={13} /> Voir le site
            </Link>
            <button
              type="button"
              onClick={seDeconnecter}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-semibold text-[var(--sane-red)] hover:bg-[var(--sane-c-fef2f2)]"
            >
              <LogOut size={13} /> Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
