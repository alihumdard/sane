import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-12 md:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/vision-bg.png')" }}
      />
      <Container className="relative z-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="flex flex-col gap-2">
            <div className="relative h-[200px] overflow-hidden rounded-xl sm:h-[230px] md:h-[260px] lg:h-[260px]">
              <Image
                src="/sane_company.png"
                alt="SANE événement"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative h-[130px] overflow-hidden rounded-xl sm:h-[145px] md:h-[160px] lg:h-[160px]">
                <Image
                  src="/sane_deal.png"
                  alt="Niger"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 22vw"
                />
              </div>
              <div className="relative h-[130px] overflow-hidden rounded-xl sm:h-[145px] md:h-[160px] lg:h-[160px]">
                <Image
                  src="/sane_cv.png"
                  alt="SANE rencontre"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 22vw"
                />
              </div>
            </div>
          </div>

          <div className="pt-12 lg:pt-12">
            <div className="flex items-center gap-1.5">
              <span className="h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--sane-green)] sm:text-[11px]">
                Qui sommes-nous ?
              </span>
            </div>
            <h2 className="mt-1 text-[22px] font-bold leading-[1.18] tracking-tight text-[var(--sane-text)] sm:text-[26px] md:text-[30px] lg:text-[34px]">
              Le SANE, plus qu&apos;un événement,
              <br className="hidden sm:block" />
              une vision pour l&apos;avenir
            </h2>
            <p className="mt-2 text-[13px] leading-[1.6] text-[var(--sane-text)] opacity-65 sm:text-[14px] md:text-[15px]">
              Le Salon National de l&apos;Emploi est une initiative nationale qui vise
              à favoriser l&apos;insertion professionnelle, à renforcer les compétences
              et à promouvoir l&apos;entrepreneuriat au Niger. Il réunit chaque année
              des entreprises, des institutions, des experts et des jeunes talents
              autour d&apos;un objectif commun : bâtir un Niger plus fort.
            </p>
            <div className="mt-2 flex items-end justify-between">
              <Link
                href="/programme"
                className="group inline-flex h-[36px] items-center gap-2 rounded-full bg-[var(--sane-green)] px-5 text-[12px] font-semibold !text-white transition-colors hover:bg-white hover:!text-[var(--sane-green)] hover:border-[var(--sane-green)] border border-transparent sm:h-[38px] sm:px-6 sm:text-[13px]"
              >
                Notre histoire
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <div className="hidden lg:block -rotate-3 translate-x-4 -translate-y-1">
                <p className="font-serif text-[16px] italic leading-[1.25] text-[var(--sane-green)] xl:text-[20px]">
                  Ensemble
                  <br />
                  pour l&apos;emploi
                  <br />
                  de demain
                </p>
                <div className="mt-0.5 ml-auto h-[2px] w-14 rounded-full bg-[var(--sane-orange)]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
