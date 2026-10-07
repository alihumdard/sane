import { Container } from "@/components/ui/Container";
import { categoryTabs } from "./data";

interface Props {
  active: string;
  onChange: (key: string) => void;
}

/** White section with category cards below the hero. */
export function CategoryTabs({ active, onChange }: Props) {
  return (
    <section className="bg-white py-5" aria-label="Catégories">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categoryTabs.map((tab) => {
            const on = active === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                aria-pressed={on}
                className={`flex min-h-[80px] items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                  on
                    ? "border-[#0a4a22] bg-[#0a4a22] text-white shadow-md"
                    : "border-[#DDE8E0] bg-white text-[#0a2e16] hover:border-[#0a4a22]/30 hover:shadow-sm"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    on ? "bg-white/15 text-white" : "bg-[#fff4ec] text-[#E57617]"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className={`block text-[13px] font-bold ${on ? "text-white" : "text-[#0a2e16]"}`}>{tab.title}</span>
                  <span className={`block text-[11px] ${on ? "text-white/70" : "text-[#61756B]"}`}>{tab.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
