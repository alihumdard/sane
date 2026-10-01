"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

export interface SidebarItem {
  icon: ReactNode;
  label: string;
  active?: boolean;
  chevron?: boolean;
  expanded?: boolean;
  subItems?: string[];
  activeSubIndex?: number;
  badge?: number;
  dividerBefore?: boolean;
}

interface Props {
  items: SidebarItem[];
  hideBottomInfo?: boolean;
}

export default function DashboardSidebar({ items, hideBottomInfo }: Props) {
  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-[#DDE8E0] bg-white">
      {/* Logo */}
      <div className="flex flex-col items-center px-5 pt-5 pb-2">
        <div className="flex items-center gap-1">
          <svg width="36" height="36" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#10632D"/>
            <text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANE</text>
            <path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-[18px] font-extrabold text-[#1e3a5f]">SANE</span>
        </div>
        <span className="text-[7px] font-semibold tracking-[0.15em] text-[#61756B] uppercase">Salon National de l&apos;Emploi</span>
        <svg className="mt-2" width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,0 10,5 5,10 0,5" fill="#E57617"/>
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {items.map((item, i) => (
          <div key={i}>
            {item.dividerBefore && <div className="my-2 border-t border-[#DDE8E0]" />}
            <button className={`flex w-full items-center gap-2.5 py-2 mb-0.5 text-left transition-all ${
              item.active
                ? "text-[#10632D] font-bold pl-3 pr-3 border-l-[3px] border-[#10632D] bg-[#F5F9F6]"
                : "text-[#10632D] hover:bg-[#F5F9F6] rounded-lg px-3"
            }`}>
              <span className="text-[#10632D]">{item.icon}</span>
              <span className="flex-1 text-[12px]">{item.label}</span>
              {item.badge && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E57617] px-1 text-[9px] font-bold text-white">{item.badge}</span>
              )}
              {item.chevron && (item.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            {item.expanded && item.subItems && (
              <div className="ml-4 mb-1 border-l border-[#DDE8E0]">
                {item.subItems.map((sub, si) => {
                  const isActive = si === (item.activeSubIndex ?? 0);
                  return (
                    <button key={si} className={`flex w-full items-center gap-1.5 pl-2 pr-2 py-0.5 text-[10px] text-left ${
                      isActive ? "text-[#10632D] font-semibold" : "text-[#61756B] hover:text-[#0a2e16]"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-[#10632D]" : "bg-[#61756B]/40"}`} />
                      {sub}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom decorative */}
      <div className="shrink-0 px-5 pb-6 pt-4">
        <div className="relative">
          <svg className="absolute right-2 top-0 w-24 opacity-[0.12]" viewBox="0 0 200 150" fill="#10632D">
            <path d="M60,20 Q80,10 120,15 Q160,20 180,50 Q190,80 170,110 Q150,140 110,145 Q70,148 40,130 Q15,110 20,80 Q25,50 50,30 Z"/>
          </svg>
          <p className="relative text-[20px] italic text-[#10632D] leading-snug font-semibold" style={{ fontFamily: "Georgia, serif" }}>
            Des talents<br/>pour un Niger<br/>plus fort
          </p>
          <div className="relative mt-2 h-[3px] w-14 rounded-full bg-[#E57617]" />
        </div>
        {!hideBottomInfo && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f] text-[13px] font-bold text-white">N</div>
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#E57617">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#E57617" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-semibold text-[#61756B]">30°C</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
