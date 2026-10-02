interface Props {
  current: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  pageSize?: number;
}

export default function Pagination({ current, totalPages, totalItems, itemLabel, pageSize = 10 }: Props) {
  const pages = [];
  for (let i = 1; i <= Math.min(5, totalPages); i++) pages.push(i);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DDE8E0] px-4 py-2.5">
      <span className="text-[10px] text-[#61756B]">
        Affichage de 1 à {pageSize} sur {totalItems.toLocaleString()} {itemLabel}
      </span>
      <div className="flex items-center gap-2">
        <select className="rounded border border-[#DDE8E0] px-1.5 py-0.5 text-[10px] text-[#0a2e16] outline-none">
          <option>{pageSize} par page</option>
        </select>
        <div className="flex items-center gap-1">
          <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">&lsaquo;</button>
          {pages.map(p => (
            <button key={p} className={`h-6 w-6 rounded text-[10px] font-semibold ${p === current ? "bg-[#10632D] text-white" : "text-[#61756B] hover:bg-[#F5F9F6]"}`}>{p}</button>
          ))}
          {totalPages > 5 && (
            <>
              <span className="text-[10px] text-[#61756B]">...</span>
              <button className="h-6 w-6 rounded text-[10px] font-semibold text-[#61756B] hover:bg-[#F5F9F6]">{totalPages}</button>
            </>
          )}
          <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">&rsaquo;</button>
        </div>
      </div>
    </div>
  );
}
