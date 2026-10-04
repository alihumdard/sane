import { AccordionList, type FaqEntry } from "@/components/shared";
import { faqCategories, faqData } from "./data";

interface Props {
  categoryKey: string;
  highlighted: boolean;
  /** questions to show (defaults to the whole category) */
  items?: FaqEntry[];
  /** open every answer (used for search results) */
  openAll?: boolean;
}

/** One category: icon + title + its accordion. */
export function FaqCategoryBlock({ categoryKey, highlighted, items, openAll = false }: Props) {
  const cat = faqCategories.find((c) => c.key === categoryKey);
  if (!cat) return null;
  const Icon = cat.icon;

  return (
    <div id={`faq-${cat.key}`} className="scroll-mt-24">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors ${
            highlighted ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"
          }`}
        >
          <Icon size={20} />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-4 bg-[var(--sane-orange)]" />
            <h3 className="sane-eyebrow !text-[var(--sane-text)]">{cat.title}</h3>
          </div>
          <p className="sane-small">{cat.subtitle}</p>
        </div>
      </div>
      <AccordionList items={items ?? faqData[cat.key] ?? []} defaultOpen={openAll} />
    </div>
  );
}
