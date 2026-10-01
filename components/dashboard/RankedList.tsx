import type { ReactNode } from "react";

interface RankedItem {
  rank: number;
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

interface Props {
  heading: string;
  items: RankedItem[];
  rankColors?: string[];
  showViewAll?: boolean;
  className?: string;
}

const defaultRankColors = ["#E57617", "#10632D", "#2563EB", "#7C3AED", "#DB2777"];

export default function RankedList({ heading, items, rankColors = defaultRankColors, showViewAll = false, className = "" }: Props) {
  return (
    <div className={`rounded-xl border border-[#DDE8E0] bg-white p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
          <span className="text-[11px] font-bold text-[#0a2e16]">{heading}</span>
        </div>
        {showViewAll && <button className="shrink-0 ml-1 text-[9px] font-semibold text-[#E57617]">Voir tout</button>}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {item.icon || (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: `${rankColors[i % rankColors.length]}18`, color: rankColors[i % rankColors.length] }}>
                {item.rank}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{item.title}</p>
              <p className="text-[9px] text-[#61756B]">{item.subtitle}</p>
            </div>
            <svg className="shrink-0" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="#61756B" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}
