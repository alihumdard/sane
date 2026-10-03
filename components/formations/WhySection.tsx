import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { whyItems } from "./data";

export function WhySection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 lg:py-14">
      <Image
        src="/why-bg2.png"
        alt=""
        fill
        className="object-cover object-[0%_15%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22]/20 from-[20%] to-[#0a4a22]/50" />
      <div className="absolute inset-x-0 bottom-0 h-[50px] bg-gradient-to-t from-[#0a4a22] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[30px] bg-gradient-to-b from-[#0a4a22]/60 to-transparent" />

      <Container className="relative z-10">
        <h2 className="mb-6 text-center text-[20px] font-extrabold italic text-white drop-shadow-sm sm:text-[24px] lg:pl-[32%] lg:text-left lg:text-[26px]">
          Pourquoi se former avec le SANE ?
        </h2>

        <div className="flex items-center lg:pl-[30%]">
          <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {whyItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                  <Icon size={24} strokeWidth={2} className="text-[var(--sane-orange)]" />
                </div>
                <p className="text-[11px] font-bold leading-[1.35] text-white sm:text-[12px]">{label}</p>
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
