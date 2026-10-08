import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, GraduationCap, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";

const highlights = [
  { icon: BriefcaseBusiness, title: "Emploi", short: "Opportunités réelles", long: "Des opportunités réelles", accent: false },
  { icon: GraduationCap, title: "Formation", short: "Compétences pour demain", long: "Des compétences pour demain", accent: true },
  { icon: UsersRound, title: "Réseautage", short: "Meilleurs recruteurs", long: "Avec les meilleurs recruteurs", accent: false },
];

export function Hero() {
  return (
    <section className="relative min-h-[460px] overflow-hidden bg-[#01676e] sm:min-h-0">
      {/* Background image — same source/quality at every breakpoint, only position shifts on mobile to keep both faces in frame */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          quality={95}
          sizes="(max-width: 639px) 250vw, 100vw"
          className="object-cover object-[71%_40%] sm:object-[75%_center]"
        />
      </div>
      {/* Readability gradient — only behind the text block, not over the people */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-gradient-to-b from-[#01676e]/70 to-transparent sm:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-b from-[#01676e]/80 via-[#01676e]/55 to-[#01676e]/30 sm:block lg:hidden" />

      <Container className="relative">
        <div className="grid grid-cols-1 lg:min-h-[410px] lg:grid-cols-2 overflow-hidden">
          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-10 flex items-center">
            <div className="w-full pb-4 pt-3 sm:py-10 lg:max-w-[600px] lg:pr-8">
              {/* Label */}
              <div className="mb-2 sm:mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-white">
                  Salon National de l&apos;Emploi du Niger (SANEM)
                </span>
              </div>

              {/* Heading */}
              <h1 className="sane-h1 on-dark max-w-[600px] text-[26px] sm:text-[32px] lg:text-[length:var(--fs-h1)]">
                Connectons les talents aux opportunités
                <span className="text-[var(--sane-orange)]">.</span>
              </h1>

              {/* Description */}
              <p className="sane-body on-dark mt-2 max-w-[520px] sm:mt-4">
                Un espace de rencontre entre les talents, les entreprises et les opportunités pour un Niger plus fort.
              </p>

              {/* Buttons */}
              <div className="mt-3 flex flex-wrap gap-3 sm:mt-5">
                <Link
                  href="/inscription"
                  className="group inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-[var(--sane-orange)] px-6 text-[13px] font-bold !text-white transition-colors hover:bg-[var(--sane-orange-dark)] sm:h-[44px]"
                >
                  Participer au SANEM
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/emploi"
                  className="group inline-flex h-[42px] items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-6 text-[13px] font-bold text-[var(--sane-green)] transition-colors hover:bg-transparent hover:!text-white sm:h-[44px] whitespace-nowrap"
                >
                  Découvrir les opportunités
                </Link>
              </div>

              {/* Highlights */}
              <ul className="mt-4 grid grid-cols-1 gap-2 border-t border-white/30 pt-3 xs:grid-cols-2 sm:mt-7 sm:gap-3 sm:pt-5 sm:flex sm:max-w-[600px] sm:items-center sm:gap-6 md:gap-8">
                {highlights.map(({ icon: Icon, title, short, long, accent }, i) => (
                  <li key={title} className="flex items-center gap-2.5 sm:gap-3">
                    {i > 0 && <span className="hidden h-8 w-px bg-white/20 sm:-ml-3 sm:mr-3 sm:block md:-ml-4 md:mr-4" />}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${
                        accent ? "bg-[var(--sane-orange)]/20" : "bg-white/15"
                      }`}
                    >
                      <Icon size={16} strokeWidth={2} className={accent ? "text-[var(--sane-orange)]" : "text-white"} />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-white sm:text-[12px]">{title}</p>
                      <p className="sane-small on-dark">
                        <span className="sm:hidden">{short}</span>
                        <span className="hidden sm:inline">{long}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= RIGHT (desktop decoration) ================= */}
          <div className="relative hidden min-h-[410px] lg:block">
            <div className="absolute right-0 top-20 z-10 w-[145px] rounded-xl bg-white px-4 py-4 shadow-lg">
              <p className="text-[11px] font-extrabold uppercase leading-5 text-[var(--sane-green)]">
                Emploi
                <br />
                Formation
                <br />
                Opportunités
                <br />
                Avenir
              </p>
              <div className="mt-3 h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />
            </div>

            <div className="absolute bottom-12 right-2 z-10 text-right">
              <p className="font-serif text-xl italic leading-6 text-white">
                Un Niger
                <br />
                de Talents
              </p>
              <div className="ml-auto mt-2 h-[3px] w-12 bg-[var(--sane-orange)]" />
            </div>
          </div>
        </div>
      </Container>

    </section>
  );
}
