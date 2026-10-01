import type { ReactNode } from "react";

interface QuickStat {
  icon: ReactNode;
  value: string;
  label: string;
  trend: string;
  color: string;
}

interface Props {
  heading: string;
  subtitle?: string;
  items: QuickStat[];
  className?: string;
}

export default function QuickStatsList({ heading, subtitle, items, className = "" }: Props) {
  return (
    <div className={`rounded-xl border border-[#DDE8E0] bg-white p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a2e16"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <span className="text-[11px] font-bold text-[#0a2e16]">{heading}</span>
        </div>
        {subtitle && <span className="text-[9px] text-[#61756B]">{subtitle}</span>}
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-extrabold text-[#0a2e16] leading-none">{s.value}</span>
                <span className="text-[9px] font-semibold" style={{ color: s.trend.startsWith("+") ? "#10632D" : "#DC2626" }}>{s.trend}</span>
              </div>
              <p className="text-[9px] text-[#61756B]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
