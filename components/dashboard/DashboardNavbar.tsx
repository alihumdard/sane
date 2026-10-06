"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";

const SAMPLE_NOTIFICATIONS = [
  { title: "Nouvelle candidature reçue", time: "Il y a 5 min" },
  { title: "Inscription confirmée au SANEM 2024", time: "Il y a 1 h" },
  { title: "Un entretien a été planifié", time: "Hier" },
  { title: "Nouveau message de l'équipe SANEM", time: "Hier" },
  { title: "Rappel : complétez votre profil", time: "Il y a 2 jours" },
];

interface Props {
  searchPlaceholder?: string;
  notificationCount?: number;
  userName?: string;
  userRole?: string;
  userImage?: string;
  language?: string;
  onMenuClick?: () => void;
}

export default function DashboardNavbar({
  searchPlaceholder = "Rechercher...",
  notificationCount = 0,
  userName = "Admin",
  userRole = "Administrateur",
  userImage = "https://randomuser.me/api/portraits/men/32.jpg",
  language = "FR",
  onMenuClick,
}: Props) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/dashboard/admin");
  const [count, setCount] = useState(notificationCount);
  const [menu, setMenu] = useState<"bell" | "user" | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

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

      {/* Bell */}
      <div className="relative shrink-0">
        <button type="button" aria-label="Notifications" onClick={() => setMenu(menu === "bell" ? null : "bell")} className="relative block">
          <Bell size={20} className="text-[var(--sane-text-light)]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--sane-orange)] text-[8px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
        {menu === "bell" && (
          <div className="absolute right-0 top-9 z-40 w-[290px] rounded-xl border border-[var(--sane-border)] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--sane-border)] px-3 py-2.5">
              <span className="text-[12px] font-bold text-[var(--sane-green-deep)]">Notifications</span>
              {count > 0 && (
                <button type="button" onClick={() => setCount(0)} className="text-[10px] font-semibold text-[var(--sane-orange)] hover:underline">
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <ul className="max-h-[260px] overflow-y-auto">
              {SAMPLE_NOTIFICATIONS.map((n, i) => (
                <li key={i} className={`flex gap-2 border-b border-[var(--sane-border)]/60 px-3 py-2.5 last:border-0 ${i < count ? "bg-[var(--sane-background)]" : ""}`}>
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i < count ? "bg-[var(--sane-orange)]" : "bg-transparent"}`} />
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--sane-green-deep)]">{n.title}</p>
                    <p className="text-[10px] text-[var(--sane-text-light)]">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
            <Link href="/connexion" className="flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2]">
              <LogOut size={13} /> Se déconnecter
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
