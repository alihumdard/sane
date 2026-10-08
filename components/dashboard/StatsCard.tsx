import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  value: string;
  label: string;
  trend: string;
  trendLabel?: string;
  bg: string;
  color: string;
}

export default function StatsCard({ icon, value, label, trend, trendLabel, bg, color }: Props) {
  return (
    <div className="rounded-xl border border-[var(--sane-border)] bg-white p-3 flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: bg, color }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <span className="text-[20px] font-extrabold text-[var(--sane-green-deep)] leading-none">{value}</span>
          <div className="hidden flex-col items-end min-[360px]:flex">
            <span className="flex items-center gap-0.5 text-[9px] font-semibold text-[var(--sane-green)]">
              <svg width="7" height="7" viewBox="0 0 10 10" fill="var(--sane-green)"><path d="M5 1 L9 9 L1 9 Z"/></svg>
              {trend}
            </span>
            <span className="hidden text-[8px] text-[var(--sane-text-light)]/70 whitespace-nowrap sm:inline">{trendLabel || "vs. mois dernier"}</span>
          </div>
        </div>
        <p className="text-[10px] text-[var(--sane-text-light)] leading-tight mt-0.5">{label}</p>
      </div>
    </div>
  );
}
