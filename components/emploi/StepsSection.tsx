import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { steps } from "./data";

export function EmploiStepsSection() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
            Comment postuler ?
          </span>
        </div>
        <h2 className="mb-6 text-[20px] font-extrabold leading-[1.15] tracking-tight text-[#0f5025] sm:mb-8 sm:text-[23px] md:text-[29px]">
          Un processus simple en 4 étapes
        </h2>

        <div className="grid grid-cols-1 gap-y-7 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-x-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;
            return (
              <Fragment key={step.num}>
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full ${
                      isEven ? "bg-[var(--sane-green)]" : "bg-[var(--sane-orange)]"
                    }`}
                  >
                    <Icon size={23} strokeWidth={1.9} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[17px] font-bold leading-none text-[var(--sane-green)]/35">
                      {step.num}
                    </span>
                    <h3 className="mt-1.5 text-[15px] font-extrabold leading-snug tracking-tight text-[#0f5025]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] font-normal leading-[1.5] text-[var(--sane-text-light)] lg:max-w-[210px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden items-center pt-[18px] text-[var(--sane-text-light)]/40 lg:flex">
                    <ArrowRight size={18} strokeWidth={1.5} />
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
