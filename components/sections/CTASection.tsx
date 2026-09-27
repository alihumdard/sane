import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CTASection() {
  return (
    <section className="bg-[#10632D]">
      <Container>
        <div className="relative h-[250px] overflow-hidden md:h-[270px]">

          {/* =========================
              CITY / BACKGROUND
          ========================== */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1800&q=90"
              alt="Ville"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />

            {/* Main green overlay */}
            <div className="absolute inset-0 bg-[#10632D]/55" />

            {/* Left dark-green blend */}
            <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[#10632D] via-[#10632D]/95 to-[#10632D]/45" />

            {/* Bottom blend */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#10632D]/45 to-transparent" />
          </div>

          {/* =========================
              WOMAN
          ========================== */}
          <div className="absolute bottom-0 left-0 z-10 h-[250px] w-[210px] md:h-[270px] md:w-[235px]">

            <Image
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=90"
              alt="Professionnelle"
              fill
              priority
              className="object-cover object-top"
              sizes="235px"
            />

            {/* Dark green tint over woman */}
            <div className="absolute inset-0 bg-[#10632D]/15" />

            {/* Blend woman into banner */}
            <div className="absolute inset-y-0 right-0 w-[80px] bg-gradient-to-r from-transparent to-[#10632D]" />

            {/* Bottom blend */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#10632D]/70 to-transparent" />
          </div>

          {/* =========================
              CONTENT
          ========================== */}
          <div className="relative z-20 flex h-full items-center">

            <div className="ml-[190px] w-[520px] px-4 md:ml-[235px] md:px-5">

              {/* Label */}
              <div className="mb-2 flex items-center gap-2">
                <span className="h-[3px] w-7 bg-[#E57617]" />

                <span className="text-[9px] font-extrabold uppercase tracking-wide text-white md:text-[10px]">
                  Salon National de l&apos;Emploi
                </span>
              </div>

              {/* Heading */}
              <h2 className="max-w-[500px] text-[27px] font-extrabold leading-[1.02] tracking-[-0.02em] text-white md:text-[34px]">
                Votre prochaine opportunité
                <br />
                commence ici.
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-[480px] text-[10px] leading-4 text-white/85 md:text-xs md:leading-5">
                Rejoignez le Salon National de l&apos;Emploi et construisez
                votre avenir professionnel.
              </p>

              {/* Buttons */}
              <div className="mt-4 flex gap-2.5">

                <Link
                  href="/inscription"
                  className="group inline-flex h-9 items-center gap-2 rounded-md bg-[#E57617] px-4 text-[9px] font-bold text-white transition hover:bg-[#CF6812] md:h-10 md:px-5 md:text-[10px]"
                >
                  Participer au SANE

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/emploi"
                  className="group inline-flex h-9 items-center gap-2 rounded-md border border-white/70 bg-transparent px-4 text-[9px] font-bold text-white transition hover:bg-white hover:text-[#10632D] md:h-10 md:px-5 md:text-[10px]"
                >
                  Découvrir les offres

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </div>
            </div>
          </div>

          {/* =========================
              RIGHT TEXT
          ========================== */}
          <div className="absolute bottom-6 right-5 z-20 hidden text-right md:block">

            <p className="font-serif text-[15px] italic leading-[1.15] text-white md:text-[17px]">
              Des talents
              <br />
              pour un Niger
              <br />
              plus fort
            </p>

            <div className="ml-auto mt-2 h-[2px] w-9 bg-[#E57617]" />
          </div>

        </div>
      </Container>
    </section>
  );
}