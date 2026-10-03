import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function EmploiHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#f3f9f5] via-[#eaf5ee] to-transparent sm:min-h-[400px] lg:min-h-[420px]">
      {/* Background image — full width on mobile, right 85% on desktop */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[85%]">
        <Image
          src="/emploi-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-[65%_bottom] sm:object-[center_bottom]"
          sizes="(min-width: 1024px) 85vw, 100vw"
        />
      </div>
      {/* Readability fade — vertical on mobile, horizontal from the left on desktop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3f9f5] via-[#f3f9f5]/90 via-[70%] to-[#f3f9f5]/40 sm:bg-gradient-to-r sm:from-[#f3f9f5] sm:via-[#f3f9f5] sm:via-[25%] sm:to-[#f3f9f5]/0 sm:to-[40%]" />

      {/* Floating card — top right, relative to section */}
      <div className="absolute right-4 top-10 z-20 hidden w-[130px] rounded-xl bg-white/95 px-4 py-3.5 shadow-lg ring-1 ring-[var(--sane-border)] backdrop-blur-sm lg:block xl:right-6">
        <p className="whitespace-pre-line text-[9px] font-extrabold uppercase leading-[1.7] tracking-wide text-[var(--sane-green)]">
          {"EMPLOI\nFORMATION\nOPPORTUNITÉS\nAVENIR"}
        </p>
        <div className="mt-2 h-[2.5px] w-6 rounded-full bg-[var(--sane-orange)]" />
      </div>

      {/* Tagline — right side, relative to section */}
      <div className="absolute right-4 top-[168px] z-20 hidden w-[130px] text-center lg:block xl:right-6">
        <p className="font-[family-name:var(--font-caveat)] text-[22px] font-bold leading-[1] tracking-normal text-[#0f5025] drop-shadow-sm xl:text-[24px]">
          Un Niger<br />de Talents
        </p>
        <div className="mx-auto mt-1.5 h-[2px] w-8 rounded-full bg-[var(--sane-orange)]" />
      </div>

      <Container className="relative z-10">
        {/* Breadcrumb */}
        <div className="mt-4 flex items-center gap-1.5 text-[12px] sm:mt-6 sm:text-[13px]">
          <Link href="/" className="font-medium text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)]">Accueil</Link>
          <ChevronRight size={14} className="text-[var(--sane-text-light)]" />
          <span className="font-medium text-[var(--sane-text-light)]">Emploi</span>
        </div>

        <div className="relative pb-[150px] pt-2 sm:pb-8 sm:pt-3 lg:grid lg:grid-cols-[45%_55%] lg:items-center lg:gap-4">

          {/* Content */}
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--sane-green)] sm:text-[11px]">
                Salon National de l&apos;Emploi
              </span>
            </div>

            <h1 className="max-w-[420px] text-[26px] font-extrabold leading-[1.08] tracking-tight text-[var(--sane-green)] sm:text-[32px] md:text-[38px] lg:text-[42px]">
              Trouvez une opportunité d&apos;emploi
            </h1>

            <p className="mt-2 max-w-[400px] text-[13px] font-semibold leading-7 text-[var(--sane-green)] sm:text-[14px]">
              Des offres d&apos;emploi réelles pour les talents nigériens.
            </p>

            <p className="mt-1.5 max-w-[420px] text-[12px] leading-[1.6] text-[var(--sane-text-light)] sm:text-[13px]">
              Connectez-vous aux entreprises, institutions et organisations qui recrutent au Niger. Parcourez les offres et postulez en quelques clics.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                href="/programme"
                className="group inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-full bg-[var(--sane-orange)] px-6 text-[12px] font-bold text-white shadow-md transition-all hover:bg-[#CF6812] sm:h-[40px] sm:w-fit sm:text-[13px]"
              >
                Voir le programme
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/inscription"
                className="group inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-full border border-[var(--sane-green)] bg-white px-6 text-[12px] font-bold text-[var(--sane-green)] transition-all hover:bg-[#f0faf4] sm:h-[40px] sm:w-fit sm:text-[13px]"
              >
                Créer mon profil
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
