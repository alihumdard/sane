import { Search } from "lucide-react";

interface Props {
  searchPlaceholder: string;
  filters: string[];
}

export default function FilterBar({ searchPlaceholder, filters }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DDE8E0] bg-white p-3">
      <div className="flex w-full sm:w-[180px] items-center gap-1.5 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-2.5 py-1.5">
        <Search size={13} className="shrink-0 text-[#61756B]" />
        <input type="text" placeholder={searchPlaceholder} className="w-full bg-transparent text-[11px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none" />
      </div>
      <div className="flex flex-wrap gap-2 flex-1">
        {filters.map(f => (
          <select key={f} className="flex-1 min-w-[100px] rounded-lg border border-[#DDE8E0] bg-white px-2 py-1.5 text-[11px] text-[#0a2e16] outline-none">
            <option>{f}</option>
          </select>
        ))}
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none shrink-0 rounded-lg bg-[#10632D] px-4 py-1.5 text-[11px] font-semibold text-white">Rechercher</button>
        <button className="flex-1 sm:flex-none shrink-0 rounded-lg border border-[#DDE8E0] bg-white px-3 py-1.5 text-[11px] text-[#61756B]">Réinitialiser</button>
      </div>
    </div>
  );
}
