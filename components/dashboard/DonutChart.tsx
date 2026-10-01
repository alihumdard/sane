interface Segment {
  label: string;
  value: number;
  pct: number;
  color: string;
}

interface Props {
  title: string;
  segments: Segment[];
  centerValue: string;
  centerLabel: string;
  showValues?: boolean;
}

function buildConic(segs: { pct: number; color: string }[]) {
  let acc = 0;
  return segs.map(s => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
}

export default function DonutChart({ title, segments, centerValue, centerLabel, showValues = true }: Props) {
  return (
    <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
        <span className="text-[11px] font-bold text-[#0a2e16]">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <div className="h-[85px] w-[85px] rounded-full" style={{ background: `conic-gradient(${buildConic(segments)})` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[57px] w-[57px] flex-col items-center justify-center rounded-full bg-white">
              <span className="text-[14px] font-extrabold text-[#0a2e16] leading-none">{centerValue}</span>
              <span className="text-[7px] text-[#61756B]">{centerLabel}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[3px] flex-1 min-w-0">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 min-w-0">
                <span className="h-1.5 w-1.5 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="text-[9px] text-[#61756B] truncate">{s.label}</span>
              </div>
              <span className="text-[9px] font-semibold text-[#0a2e16] shrink-0 ml-1">
                {showValues ? `${s.value} (${s.pct}%)` : `${s.pct}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
