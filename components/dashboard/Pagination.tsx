interface Props {
  current?: number;
  totalPages?: number;
  totalItems?: number;
  itemLabel: string;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function Pagination({
  current = 1,
  totalPages = 1,
  totalItems = 0,
  itemLabel,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const interactive = !!onPageChange;
  const from = totalItems === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = interactive ? Math.min(current * pageSize, totalItems) : Math.min(pageSize, totalItems);

  // show a window of up to 5 pages around the current one
  const start = Math.max(1, Math.min(current - 2, totalPages - 4));
  const pages: number[] = [];
  for (let i = start; i <= Math.min(totalPages, start + 4); i++) pages.push(i);

  const go = (p: number) => onPageChange?.(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--sane-border)] px-4 py-2.5">
      <span className="text-[10px] text-[var(--sane-text-light)]">
        Affichage de {from} à {to} sur {totalItems.toLocaleString()} {itemLabel}
      </span>
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded border border-[var(--sane-border)] px-1.5 py-0.5 text-[10px] text-[var(--sane-green-deep)] outline-none"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} par page</option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={current <= 1}
            onClick={() => go(current - 1)}
            className="rounded px-1.5 py-0.5 text-[12px] text-[var(--sane-text-light)] hover:bg-[var(--sane-background)] disabled:opacity-40"
          >
            &lsaquo;
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              className={`h-6 w-6 rounded text-[10px] font-semibold ${p === current ? "bg-[var(--sane-green)] text-white" : "text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"}`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={current >= totalPages}
            onClick={() => go(current + 1)}
            className="rounded px-1.5 py-0.5 text-[12px] text-[var(--sane-text-light)] hover:bg-[var(--sane-background)] disabled:opacity-40"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
