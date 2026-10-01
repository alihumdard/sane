import { Search } from "lucide-react";

interface Props {
  searchPlaceholder: string;
  filters: string[];
}

export default function FilterBar({ searchPlaceholder, filters }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DDE8E0] bg-white p-3">
      <div className="flex w-[180px] items-center gap-1.5 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-2.5 py-1.5">
        <Search size={13} className="shrink-0 text-[#61756B]" />
        <input type="text" placeholder={searchPlaceholder} className="w-full bg-transparent text-[11px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none" />
      </div>
      {filters.map(f => (
        <select key={f} className="rounded-lg border border-[#DDE8E0] bg-white px-2 py-1.5 text-[11px] text-[#0a2e16] outline-none">
          <option>{f}</option>
        </select>
      ))}
      <button className="shrink-0 rounded-lg bg-[#10632D] px-4 py-1.5 text-[11px] font-semibold text-white">Rechercher</button>
      <button className="shrink-0 rounded-lg border border-[#DDE8E0] bg-white px-3 py-1.5 text-[11px] text-[#61756B]">Réinitialiser</button>
    </div>
  );
}
