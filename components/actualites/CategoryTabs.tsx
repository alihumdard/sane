import { Container } from "@/components/ui/Container";
import { categoryTabs } from "./data";

interface Props {
  active: string;
  onChange: (key: string) => void;
}

/** Dark bar with the news categories. */
export function CategoryTabs({ active, onChange }: Props) {
  return (
    <section className="bg-[var(--sane-green-deep)]" aria-label="Catégories">
      <Container>
        <div className="flex overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {categoryTabs.map((tab) => {
            const on = active === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                aria-pressed={on}
                className={`flex shrink-0 items-center gap-2.5 px-4 py-3 text-left transition-colors sm:px-5 lg:min-w-0 lg:shrink lg:px-3 xl:px-4 ${
                  on ? "bg-[var(--sane-orange)] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    on ? "bg-white text-[var(--sane-orange)]" : "bg-[var(--sane-orange)] text-white"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[length:var(--fs-small)] font-bold">{tab.title}</span>
                  <span className={`block text-[11px] ${on ? "text-white/80" : "text-white/50"}`}>{tab.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
