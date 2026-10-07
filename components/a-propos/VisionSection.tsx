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
          <div className="relative h-[340px] overflow-hidden rounded-xl sm:h-[385px] md:h-[430px]">
            <Image src="/À propos cards.png" alt="SANEM événement" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>

          <div className="pt-2 lg:pt-12">
            <div className="flex items-center gap-2">
              <span className="sane-eyebrow-bar" />
              <span className="sane-eyebrow">Qui sommes-nous ?</span>
            </div>
            <h2 className="sane-h2 mt-2">
              Le SANEM, plus qu&apos;un événement,
              <br className="hidden sm:block" />
              une vision pour l&apos;avenir
            </h2>
            <p className="sane-body mt-3">
              Le Salon National de l&apos;Emploi est une initiative nationale qui vise
              à favoriser l&apos;insertion professionnelle, à renforcer les compétences
              et à promouvoir l&apos;entrepreneuriat au Niger. Il réunit chaque année
              des entreprises, des institutions, des experts et des jeunes talents
              autour d&apos;un objectif commun : bâtir un Niger plus fort.
            </p>
            <div className="mt-5 flex items-end justify-between">
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
