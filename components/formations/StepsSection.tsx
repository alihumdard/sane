import { Container } from "@/components/ui/Container";
import { steps } from "./data";

export function StepsSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <Container>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-orange)]">
            Comment ça marche ?
          </span>
        </div>
        <h2 className="mb-10 text-[22px] font-extrabold text-[var(--sane-text)] md:text-[28px]">
          Un processus simple et rapide
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex flex-col gap-4">
                {i < steps.length - 1 && (
                  <div className="absolute left-[52px] top-6 hidden h-[2px] w-[calc(100%-20px)] bg-[var(--sane-border)] lg:block" />
                )}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green)]">
                    <Icon size={20} strokeWidth={2} className="text-white" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sane-orange)] text-[9px] font-extrabold text-white">
                      {step.num}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-extrabold text-[var(--sane-text)]">{step.title}</h3>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--sane-text-light)]">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
