import { Container } from "@/components/ui/Container";
import { whyItems } from "./data";

export function WhySection() {
  return (
    <section className="bg-[var(--sane-green)] py-12 sm:py-14">
      <Container>
        <h2 className="mb-8 text-center text-[20px] font-extrabold text-white sm:text-[24px]">
          Pourquoi se former avec le SANE ?
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {whyItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sane-orange)]">
                <Icon size={20} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-[12px] font-semibold leading-5 text-white/90 sm:text-[13px]">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
