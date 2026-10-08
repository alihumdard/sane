import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { whyItems } from "./data";

export function WhySection() {
  return (
    <section className="relative min-h-[480px] overflow-hidden sm:min-h-0 sm:py-16 lg:py-14">
      <Image
        src="/why-bg2.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--sane-green-dark)]/60 via-[var(--sane-green-dark)]/40 to-[var(--sane-green-dark)]/10 sm:bg-none sm:bg-gradient-to-r sm:from-[var(--sane-green-dark)]/20 sm:from-[20%] sm:to-[var(--sane-green-dark)]/50" />
      <div className="absolute inset-x-0 bottom-0 h-[50px] bg-gradient-to-t from-[var(--sane-green-dark)] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[30px] bg-gradient-to-b from-[var(--sane-green-dark)]/60 to-transparent sm:block hidden" />

      <Container className="relative z-10 pt-10 pb-4 sm:pt-0 sm:pb-0">
        <h2 className="sane-h2 on-dark mb-8 text-center italic drop-shadow-sm lg:pl-[32%] lg:text-left">
          Pourquoi se former avec le SANEM ?
        </h2>

        <div className="flex flex-col items-center gap-6 sm:flex-row lg:pl-[30%]">
          <div className="grid w-full flex-1 grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4 sm:gap-8">
            {whyItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex min-w-0 flex-col gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                  <Icon size={24} strokeWidth={2} className="text-[var(--sane-orange)]" />
                </div>
                <p className="text-[12px] font-bold leading-[1.4] text-white">{label}</p>
              </div>
            ))}
          </div>

          <div className="hidden shrink-0 pl-8 lg:block">
            <p className="text-right font-serif text-[16px] italic leading-[1.3] text-white drop-shadow-sm xl:text-[18px]">
              Des talents<br />
              pour un Niger<br />
              plus fort
            </p>
            <div className="ml-auto mt-1.5 h-[3px] w-10 rounded-full bg-[var(--sane-orange)]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
