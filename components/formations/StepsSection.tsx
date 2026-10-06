import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "./data";

export function StepsSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Comment ça marche ?" title="Un processus simple et rapide" className="mb-10" />

        <ol className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-x-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const green = i % 2 === 0;
            return (
              <Fragment key={step.num}>
                <li>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
                        green ? "bg-[var(--sane-green)]" : "bg-[var(--sane-orange)]"
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className={`text-[32px] font-extrabold leading-none ${green ? "text-[var(--sane-green)]" : "text-[var(--sane-orange)]"}`}>
                      {step.num}
                    </span>
                  </div>
                  <div className="mt-3 lg:pr-2">
                    <h3 className="sane-h3">{step.title}</h3>
                    <p className="sane-small mt-1 max-w-[220px]">{step.desc}</p>
                  </div>
                </li>
                {i < steps.length - 1 && (
                  <li aria-hidden="true" className="hidden items-center pt-3 text-[var(--sane-text-light)]/50 lg:flex">
                    <ArrowRight size={16} />
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
