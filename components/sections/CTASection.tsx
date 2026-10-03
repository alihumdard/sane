import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CTASection() {
  return (
    <section
      className="relative min-h-[270px] overflow-hidden py-3 md:h-[280px] md:py-4"
      style={{
        backgroundImage: "url('/SalonNationalbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="relative h-full">
        <div className="relative z-20 flex h-full items-center py-2 md:py-0">
          <div className="w-full px-0 md:pl-64 md:pr-16 lg:pl-72">
            <h2 className="max-w-[430px] text-[26px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px] md:text-[38px]">
              Votre prochaine
              <br />
              opportunité
              <br />
              commence ici.
            </h2>

            <p className="mt-3 max-w-[470px] text-xs leading-relaxed text-white/85 md:text-sm">
              Rejoignez le Salon National de l&apos;Emploi et construisez
              votre avenir professionnel.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[var(--sane-orange)] px-5 text-xs font-bold text-white transition-colors hover:bg-[#CF6812]"
              >
                Participer au SANE
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/emploi"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-white bg-white/10 px-5 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Découvrir les offres
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute right-12 top-1/2 z-20 hidden -translate-y-1/2 text-center md:block">
          <p className="font-serif text-xl italic leading-[1.2] text-[var(--sane-green)]">
            Des talents
            <br />
            pour un Niger
            <br />
            plus fort
          </p>
          <div className="mx-auto mt-2 h-[2.5px] w-10 rounded-full bg-[var(--sane-orange)]" />
        </div>
      </Container>
    </section>
  );
}
