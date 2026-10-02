import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function HeroBanner() {
  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[450px] lg:min-h-[400px]">
      <Image
        src="/hero-about.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#0a4a22]/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#0a4a22]/85 lg:via-[#0a4a22]/50 lg:to-transparent lg:to-[60%]" />

      <Container className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/99 px-4 py-1.5 mt-6 text-[12px] backdrop-blur-sm sm:px-5 sm:py-2 sm:mt-10 sm:text-[13px]">
          <Link href="/" className="font-medium text-[var(--sane-green)] hover:text-[#0a4a22] transition-colors">Accueil</Link>
          <ChevronRight size={16} className="text-[var(--sane-text-light)]" />
          <span className="font-bold text-[var(--sane-orange)]">À propos</span>
        </div>

        <div className="grid min-h-[380px] grid-cols-1 items-center gap-8 pb-8 pt-4 sm:pb-10 sm:pt-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                Salon National de l&apos;Emploi
              </span>
            </div>
            <h1 className="text-[26px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[36px] md:text-[42px] lg:text-[48px]">
              À propos du SANE
            </h1>
            <p className="mt-4 max-w-[500px] text-[14px] font-semibold leading-7 text-white/90 sm:text-[15px]">
              Un engagement national pour l&apos;emploi, les compétences et un Niger plus fort.
            </p>
            <p className="mt-2 max-w-[500px] text-[12px] leading-6 text-white/70 sm:text-[13px]">
              Le Salon National de l&apos;Emploi (SANE) est un espace de rencontre entre
              les talents, les entreprises, les institutions et les opportunités, au service du
              développement socio-économique du Niger.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
              <Link href="/inscription" className="group inline-flex h-[44px] items-center justify-center gap-2.5 rounded-full bg-[var(--sane-orange)] px-7 text-[13px] font-bold text-white shadow-lg shadow-orange-900/20 transition-all hover:bg-[#CF6812] hover:shadow-xl sm:h-[46px] sm:px-8 sm:text-[14px]">
                Participer au SANE
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link href="/programme" className="group inline-flex h-[44px] items-center justify-center gap-2.5 rounded-full bg-white/95 px-7 text-[13px] font-bold text-[var(--sane-green)] shadow-lg transition-all hover:bg-white hover:shadow-xl backdrop-blur-sm sm:h-[46px] sm:px-8 sm:text-[14px]">
                Découvrir le programme
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-5">
              {[
                { value: "+500", label: "Opportunités" },
                { value: "+100", label: "Entreprises" },
                { value: "+1000", label: "Participants" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[18px] font-extrabold text-[var(--sane-orange)]">{s.value}</span>
                  <span className="text-[13px] font-medium text-white/80">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
