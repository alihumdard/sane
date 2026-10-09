import Link from "next/link";
import { getImageProps } from "next/image";
import { ArrowRight, BriefcaseBusiness, GraduationCap, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";

const highlights = [
  { icon: BriefcaseBusiness, title: "Emploi", short: "Opportunités réelles", long: "Des opportunités réelles", accent: false },
  { icon: GraduationCap, title: "Formation", short: "Compétences pour demain", long: "Des compétences pour demain", accent: true },
  { icon: UsersRound, title: "Réseautage", short: "Meilleurs recruteurs", long: "Avec les meilleurs recruteurs", accent: false },
];

export function Hero() {
  // Art direction: a dedicated portrait artwork on phones, the wide banner from sm up.
  const common = { alt: "", fill: true, priority: true };
  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: "/MobileEmploymentFairHeroBackground.webp", sizes: "100vw", quality: 85 });
  const { props: desktop } = getImageProps({ ...common, src: "/hero-bg.webp", sizes: "100vw", quality: 90 });

  return (
    <section className="relative overflow-hidden bg-[var(--sane-c-01676e)]">
      {/* Background art: portrait artwork on phones (anchored to the bottom so all 3 people stay visible), wide banner from sm up */}
      <picture className="absolute inset-x-0 -bottom-[15vw] aspect-[940/1672] sm:bottom-0 sm:inset-0 sm:aspect-auto">
        <source media="(max-width: 639px)" srcSet={mobile} />
        <img {...desktop} alt="" className="object-cover sm:object-[75%_center]" />
      </picture>
      {/* Readability gradient — top band behind heading/CTAs, faces stay clear, bottom band behind feature list */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[470px] bg-gradient-to-b from-[var(--sane-c-01676e)]/90 via-[var(--sane-c-01676e)]/80 via-[70%] to-transparent sm:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-b from-[var(--sane-c-01676e)]/80 via-[var(--sane-c-01676e)]/55 to-[var(--sane-c-01676e)]/30 sm:block lg:hidden" />

      <Container className="relative">
        <div className="grid grid-cols-1 lg:min-h-[410px] lg:grid-cols-2 overflow-hidden">
          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-10 flex items-center">
            <div className="w-full pb-[69vw] pt-6 sm:py-10 lg:max-w-[600px] lg:pr-8">
              {/* Label */}
              <div className="mb-1.5 sm:mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-white sm:text-[11px]">
                  Salon National de l&apos;Emploi du Niger (SANEM)
                </span>
              </div>

              {/* Heading */}
              <h1 className="sane-h1 on-dark max-w-[600px] text-[22px] leading-[1.2] sm:text-[32px] sm:leading-normal lg:text-[length:var(--fs-h1)]">
                Connectons les talents aux opportunités
                <span className="text-[var(--sane-orange)]">.</span>
              </h1>

              {/* Description */}
              <p className="sane-body on-dark mt-1.5 max-w-[520px] text-[13px] sm:mt-4 sm:text-[14px]">
                Un espace de rencontre entre les talents, les entreprises et les opportunités pour un Niger plus fort.
              </p>

              {/* Buttons */}
              <div className="mt-2.5 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
                <Link
                  href="/inscription"
                  className="group inline-flex h-[34px] items-center justify-center gap-2 rounded-full bg-[var(--sane-orange)] px-4 text-[12px] font-bold !text-white transition-colors hover:bg-[var(--sane-orange-dark)] sm:h-[44px] sm:px-6 sm:text-[13px]"
                >
                  Participer au SANEM
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/emploi"
                  className="group inline-flex h-[34px] items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-4 text-[12px] font-bold text-[var(--sane-green)] transition-colors hover:bg-transparent hover:!text-white sm:h-[44px] sm:px-6 sm:text-[13px] whitespace-nowrap"
                >
                  Découvrir les opportunités
                </Link>
              </div>

              {/* Highlights */}
              <ul className="mt-3 grid grid-cols-1 gap-1.5 border-t border-white/30 pt-2.5 xs:grid-cols-2 sm:mt-7 sm:gap-3 sm:pt-5 sm:flex sm:max-w-[600px] sm:items-center sm:gap-6 md:gap-8">
                {highlights.map(({ icon: Icon, title, short, long, accent }, i) => (
                  <li key={title} className="flex items-center gap-2 sm:gap-3">
                    {i > 0 && <span className="hidden h-8 w-px bg-white/20 sm:-ml-3 sm:mr-3 sm:block md:-ml-4 md:mr-4" />}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${
                        accent ? "bg-[var(--sane-orange)]/20" : "bg-white/15"
                      }`}
                    >
                      <Icon size={14} strokeWidth={2} className={`sm:h-4 sm:w-4 ${accent ? "text-[var(--sane-orange)]" : "text-white"}`} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-white sm:text-[12px]">{title}</p>
                      <p className="sane-small on-dark !text-[10px] sm:!text-[length:var(--fs-small)]">
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
            <div className="absolute -right-4 top-4 z-10 w-[130px] rounded-xl bg-white/95 px-4 py-3.5 shadow-lg ring-1 ring-[var(--sane-border)] backdrop-blur-sm xl:-right-2">
              <p className="whitespace-pre-line text-[9px] font-extrabold uppercase leading-[1.7] tracking-wide text-[var(--sane-green)]">
                {"EMPLOI\nFORMATION\nOPPORTUNITÉS\nAVENIR"}
              </p>
              <div className="mt-2 h-[2.5px] w-6 rounded-full bg-[var(--sane-orange)]" />
            </div>

            <div className="absolute -right-4 top-[150px] z-10 w-[130px] text-center xl:-right-2">
              <p className="font-[family-name:var(--font-caveat)] text-[22px] font-bold leading-[1] tracking-normal text-[var(--sane-green-dark)] drop-shadow-sm xl:text-[24px]">
                Un Niger<br />de Talents
              </p>
              <div className="mx-auto mt-1.5 h-[2px] w-8 rounded-full bg-[var(--sane-orange)]" />
            </div>
          </div>
        </div>
      </Container>

    </section>
  );
}
