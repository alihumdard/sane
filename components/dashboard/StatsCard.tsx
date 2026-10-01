import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  value: string;
  label: string;
  trend: string;
  bg: string;
  color: string;
}

export default function StatsCard({ icon, value, label, trend, bg, color }: Props) {
  return (
    <div className="rounded-xl border border-[#DDE8E0] bg-white p-3 flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: bg, color }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <span className="text-[20px] font-extrabold text-[#0a2e16] leading-none">{value}</span>
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-0.5 text-[9px] font-semibold text-[#10632D]">
              <svg width="7" height="7" viewBox="0 0 10 10" fill="#10632D"><path d="M5 1 L9 9 L1 9 Z"/></svg>
              {trend}
            </span>
            <span className="text-[8px] text-[#61756B]/70 whitespace-nowrap">vs. mois dernier</span>
          </div>
        </div>
        <p className="text-[10px] text-[#61756B] leading-tight mt-0.5">{label}</p>
      </div>
    </div>
  );
}
