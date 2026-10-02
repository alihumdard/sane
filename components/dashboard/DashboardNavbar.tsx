"use client";

import Image from "next/image";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

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
  return (
    <header className="flex items-center gap-2 sm:gap-4 border-b border-[#DDE8E0] bg-white px-3 sm:px-6 py-3">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuClick}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DDE8E0] lg:hidden"
      >
        <Menu size={16} className="text-[#61756B]" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-3 py-2 min-w-0">
        <Search size={14} className="shrink-0 text-[#61756B]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-[12px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none"
        />
      </div>

      {/* Bell */}
      <div className="relative shrink-0">
        <Bell size={20} className="text-[#61756B]" />
        {notificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E57617] text-[8px] font-bold text-white">
            {notificationCount}
          </span>
        )}
      </div>

      {/* Language - hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[#DDE8E0] px-2 py-1.5 shrink-0">
        <span className="text-[12px] font-semibold text-[#0a2e16]">{language}</span>
        <ChevronDown size={12} className="text-[#61756B]" />
      </div>

      {/* User */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#DDE8E0]">
          <Image src={userImage} alt={userName} width={32} height={32} className="object-cover" />
        </div>
        <div className="hidden sm:block">
          <p className="text-[12px] font-bold text-[#0a2e16]">{userName}</p>
          <p className="text-[10px] text-[#61756B]">{userRole}</p>
        </div>
        <ChevronDown size={14} className="hidden sm:block text-[#61756B]" />
      </div>
    </header>
  );
}
