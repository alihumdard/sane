interface DateItem {
  day: string;
  month: string;
  title: string;
  subtitle: string;
}

interface Props {
  heading: string;
  items: DateItem[];
  showViewAll?: boolean;
  className?: string;
}

export default function DateBadgeList({ heading, items, showViewAll = false, className = "" }: Props) {
  return (
    <div className={`rounded-xl border border-[var(--sane-border)] bg-white p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="h-[3px] w-4 shrink-0 rounded-full bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-bold text-[var(--sane-green-deep)]">{heading}</span>
        </div>
        {showViewAll && <button className="shrink-0 ml-1 text-[9px] font-semibold text-[var(--sane-orange)]">Voir tout</button>}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex h-9 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--sane-orange-light)]">
              <span className="text-[12px] font-extrabold text-[var(--sane-orange)] leading-none">{item.day}</span>
              <span className="text-[7px] font-semibold text-[var(--sane-orange)]">{item.month}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-[var(--sane-green-deep)] leading-tight truncate">{item.title}</p>
              <span className="text-[9px] text-[var(--sane-text-light)]">{item.subtitle}</span>
            </div>
            <svg className="shrink-0 mt-1" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="#61756B" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}
