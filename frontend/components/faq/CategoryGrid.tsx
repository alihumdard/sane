import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqEntry } from "@/components/shared";
import { habillageCategorie } from "./data";

interface Props {
  active: string;
  onSelect: (key: string) => void;
  /** The categories the records actually carry, in order. */
  categories: string[];
  comptes: Record<string, FaqEntry[]>;
}

/** Category cards: picking one highlights it and jumps to its questions. */
export function CategoryGrid({ active, onSelect, categories, comptes }: Props) {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Parcourir par thématique"
          title="Trouvez rapidement votre réponse"
          description="Sélectionnez une catégorie pour voir les questions associées."
          className="mb-8"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cle) => {
            const { key, icon: Icon, title, subtitle } = habillageCategorie(cle);
            const on = active === key;
            const count = comptes[cle]?.length ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                aria-pressed={on}
                className={`flex flex-col gap-2 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 sm:p-4 ${
                  on
                    ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white shadow-lg"
                    : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)]/30 hover:shadow-md"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${on ? "bg-white/20" : "bg-[var(--sane-background)] text-[var(--sane-green)]"}`}>
                  <Icon size={18} className="sm:hidden" />
                  <Icon size={20} className="hidden sm:block" />
                </span>
                <span>
                  <span className={`block text-[13px] font-bold sm:text-[length:var(--fs-body)] ${on ? "text-white" : ""}`}>{title}</span>
                  <span className={`hidden text-[length:var(--fs-small)] sm:block ${on ? "text-white/70" : "text-[var(--sane-text-light)]"}`}>{subtitle}</span>
                </span>
                <span className="mt-auto flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-semibold sm:text-[11px] ${on ? "text-white/80" : "text-[var(--sane-orange)]"}`}>
                    {count} questions
                  </span>
                  <span
                    className={`hidden h-6 w-6 items-center justify-center rounded-full sm:flex ${
                      on ? "bg-white/20 text-white" : "border border-[var(--sane-border)] text-[var(--sane-text-light)]"
                    }`}
                  >
                    <ArrowRight size={12} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
