import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { steps } from "./data";

export function EmploiStepsSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
            Comment postuler ?
          </span>
        </div>
        <h2 className="sane-h2 mb-6 sm:mb-8">
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
                    <h3 className="sane-h3 mt-1.5">
                      {step.title}
                    </h3>
                    <p className="sane-body mt-1.5 font-normal lg:max-w-[210px]">
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
