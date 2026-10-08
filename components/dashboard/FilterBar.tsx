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
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--sane-border)] bg-white p-3">
        <div className="flex w-full sm:w-[200px] items-center gap-1.5 rounded-lg border border-[var(--sane-border)] bg-[var(--sane-background)] px-2.5 py-1.5">
          <Search size={13} className="shrink-0 text-[var(--sane-text-light)]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={table ? table.query : undefined}
            onChange={table ? (e) => table.setQuery(e.target.value) : undefined}
            className="w-full bg-transparent text-[11px] text-[var(--sane-green-deep)] placeholder:text-[var(--sane-text-light)]/60 outline-none"
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
                className="min-w-0 rounded-lg border border-[var(--sane-border)] bg-white px-2 py-1.5 text-[11px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] sm:min-w-[120px] sm:flex-1"
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
            className="flex-1 shrink-0 rounded-lg bg-[var(--sane-green)] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-[var(--sane-green-dark)] sm:flex-none"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={table?.reset}
            className="flex-1 shrink-0 rounded-lg border border-[var(--sane-border)] bg-white px-3 py-1.5 text-[11px] text-[var(--sane-text-light)] hover:bg-[var(--sane-background)] sm:flex-none"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {table && table.selected.length > 0 && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--sane-orange)]/30 bg-[var(--sane-orange-light)] px-3 py-2">
          <span className="text-[11px] font-semibold text-[var(--sane-green-deep)]">
            {table.selected.length} sélectionné{table.selected.length > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={() => table.askDelete(table.selected)}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--sane-red)] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[var(--sane-red-dark)]"
          >
            <Trash2 size={12} /> Supprimer la sélection
          </button>
        </div>
      )}
    </div>
  );
}
