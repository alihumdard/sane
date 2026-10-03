import { Search, Trash2 } from "lucide-react";
import type { TableApi } from "./useTable";

interface Props {
  searchPlaceholder: string;
  filters: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table?: TableApi<any>;
}

export default function FilterBar({ searchPlaceholder, filters, table }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DDE8E0] bg-white p-3">
        <div className="flex w-full sm:w-[200px] items-center gap-1.5 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-2.5 py-1.5">
          <Search size={13} className="shrink-0 text-[#61756B]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={table ? table.query : undefined}
            onChange={table ? (e) => table.setQuery(e.target.value) : undefined}
            className="w-full bg-transparent text-[11px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none"
          />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {filters.map((f) => {
            const opts = table ? table.options(f) : [];
            return (
              <select
                key={f}
                value={table ? table.filters[f] ?? "" : undefined}
                onChange={table ? (e) => table.setFilter(f, e.target.value) : undefined}
                className="min-w-0 rounded-lg border border-[#DDE8E0] bg-white px-2 py-1.5 text-[11px] text-[#0a2e16] outline-none focus:border-[#10632D] sm:min-w-[120px] sm:flex-1"
              >
                <option value="">{f}</option>
                {opts.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            );
          })}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            className="flex-1 shrink-0 rounded-lg bg-[#10632D] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0a4a22] sm:flex-none"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={table?.reset}
            className="flex-1 shrink-0 rounded-lg border border-[#DDE8E0] bg-white px-3 py-1.5 text-[11px] text-[#61756B] hover:bg-[#F5F9F6] sm:flex-none"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {table && table.selected.length > 0 && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E57617]/30 bg-[#FFF3E8] px-3 py-2">
          <span className="text-[11px] font-semibold text-[#0a2e16]">
            {table.selected.length} sélectionné{table.selected.length > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={() => table.askDelete(table.selected)}
            className="flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#b91c1c]"
          >
            <Trash2 size={12} /> Supprimer la sélection
          </button>
        </div>
      )}
    </div>
  );
}
