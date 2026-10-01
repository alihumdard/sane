import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  value: string;
  label: string;
  link: string;
  bg: string;
  color: string;
}

export default function ParticipantStatsCard({ icon, value, label, link, bg, color }: Props) {
  return (
    <div className="rounded-xl border border-[#DDE8E0] bg-white p-4 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: bg, color }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-[24px] font-extrabold text-[#0a2e16] leading-none">{value}</span>
        <p className="text-[11px] text-[#61756B] mt-0.5">{label}</p>
        <button className="mt-1 flex items-center gap-1 text-[10px] font-semibold" style={{ color }}>
          {link}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}
