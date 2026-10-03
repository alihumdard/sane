import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { steps } from "./data";

export function EmploiStepsSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <Container>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
            Comment postuler ?
          </span>
        </div>
        <h2 className="mb-10 text-[24px] font-extrabold text-[#0f5025] md:text-[32px]">
          Un processus simple en 4 étapes
        </h2>

        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-x-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;
            return (
              <Fragment key={step.num}>
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isEven ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"}`}>
                      <Icon size={18} strokeWidth={2} className="text-white" />
                    </div>
                    <span className={`text-[32px] font-extrabold leading-none ${isEven ? "text-[var(--sane-orange)]" : "text-[var(--sane-green)]"}`}>
                      {step.num}
                    </span>
                  </div>
                  <div className="mt-3 lg:pr-2">
                    <h3 className="text-[13px] font-extrabold italic text-[var(--sane-green)]">{step.title}</h3>
                    <p className="mt-1 max-w-[180px] text-[12px] leading-[1.5] text-[var(--sane-text-light)]">{step.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden items-center pt-3 text-[var(--sane-text-light)]/50 lg:flex">
                    <ArrowRight size={16} />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
