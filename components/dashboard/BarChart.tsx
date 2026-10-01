import type { ReactNode } from "react";

interface BarItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  icon?: ReactNode;
  bars: BarItem[];
  maxValue?: number;
}

export default function BarChart({ title, icon, bars, maxValue }: Props) {
  const max = maxValue ?? Math.max(...bars.map(b => b.value));
  const yLabels = [];
  for (let i = max; i >= 0; i -= 2) yLabels.push(i);

  return (
    <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon || <svg width="14" height="14" viewBox="0 0 24 24" fill="#10632D"><path d="M3 3v18h18M9 17V9m4 8V5m4 12v-4"/></svg>}
          <span className="text-[12px] font-bold text-[#0a2e16]">{title}</span>
        </div>
        <select className="rounded border border-[#DDE8E0] px-1.5 py-0.5 text-[9px] text-[#61756B] outline-none">
          <option>Ce mois</option>
        </select>
      </div>
      <div className="flex gap-1 pt-1">
        <div className="flex flex-col justify-between pb-4 pt-0">
          {yLabels.map(v => (
            <span key={v} className="text-[8px] text-[#61756B] leading-none text-right w-3">{v}</span>
          ))}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="relative flex-1 flex items-end justify-around" style={{ height: 100 }}>
            {yLabels.map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-dashed border-[#DDE8E0]/60" style={{ bottom: `${(i / (yLabels.length - 1)) * 100}%` }} />
            ))}
            {bars.map((b, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color: b.color }}>{b.value}</span>
                <div className="w-12 rounded-t-md" style={{ height: `${(b.value / max) * 90}px`, backgroundColor: b.color }} />
              </div>
            ))}
          </div>
          <div className="flex justify-around pt-1">
            {bars.map((b, i) => (
              <span key={i} className="text-[8px] text-[#61756B] text-center">{b.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
