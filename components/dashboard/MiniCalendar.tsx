import { Calendar, ChevronRight } from "lucide-react";

interface Props {
  month: string;
  year: number;
  weeks: number[][];
  highlightDays?: number[];
  today?: number;
}

export default function MiniCalendar({ month, year, weeks, highlightDays = [], today }: Props) {
  return (
    <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-[#10632D]" />
          <span className="text-[12px] font-bold text-[#0a2e16]">Mon calendrier</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[#61756B]"><ChevronRight size={12} className="rotate-180" /></button>
          <span className="text-[11px] font-semibold text-[#0a2e16]">{month} {year}</span>
          <button className="text-[#61756B]"><ChevronRight size={12} /></button>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
              <th key={d} className="py-1 text-[9px] font-semibold text-[#61756B] text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                const isPrevMonth = wi === 0 && day >= 26;
                const isCurrentMonth = !isPrevMonth;
                const isHighlight = isCurrentMonth && highlightDays.includes(day);
                const isToday = isCurrentMonth && day === today;
                return (
                  <td key={di} className="text-center py-0.5">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                      isToday ? "bg-[#E57617] text-white font-bold" :
                      isHighlight ? "bg-[#E8F5ED] text-[#10632D] font-semibold" :
                      isPrevMonth ? "text-[#DDE8E0]" :
                      "text-[#0a2e16]"
                    }`}>
                      {day}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
