import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqCategories, faqData } from "./data";

interface Props {
  active: string;
  onSelect: (key: string) => void;
}

/** Category cards: picking one highlights it and jumps to its questions. */
export function CategoryGrid({ active, onSelect }: Props) {
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
          {faqCategories.map(({ key, icon: Icon, title, subtitle }) => {
            const on = active === key;
            const count = faqData[key]?.length ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                aria-pressed={on}
                className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                  on
                    ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white shadow-lg"
                    : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)]/30 hover:shadow-md"
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${on ? "bg-white/20" : "bg-[var(--sane-background)] text-[var(--sane-green)]"}`}>
                  <Icon size={20} />
                </span>
                <span>
                  <span className={`block text-[length:var(--fs-body)] font-bold ${on ? "text-white" : ""}`}>{title}</span>
                  <span className={`block text-[length:var(--fs-small)] ${on ? "text-white/70" : "text-[var(--sane-text-light)]"}`}>{subtitle}</span>
                </span>
                <span className="mt-auto flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-semibold ${on ? "text-white/80" : "text-[var(--sane-orange)]"}`}>
                    {count} questions
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
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
