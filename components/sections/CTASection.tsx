import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CTASection() {
  return (
    <section
      className="relative min-h-[270px] overflow-hidden py-3 md:py-4 md:h-[280px]"
      style={{
        backgroundImage: "url('/SalonNationalbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="relative h-full">
        {/* =========================
            CONTENT (Left/Center)
        ========================== */}
        <div className="relative z-20 flex h-full items-center py-2 md:py-0">
          <div className="w-full px-4 md:pl-64 lg:pl-72 md:pr-16">

            {/* Heading */}
            <h2 className="max-w-[430px] text-[34px] font-extrabold leading-[1.02] tracking-[-0.02em] text-white md:text-[38px]">
              Votre prochaine
              <br />
              opportunité
              <br />
              commence ici.
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-[470px] text-xs leading-relaxed text-white/85 md:text-sm">
              Rejoignez le Salon National de l&apos;Emploi et construisez
              votre avenir professionnel.
            </p>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#E57617] px-5 text-xs font-bold text-white !text-white transition-all hover:bg-[#CF6812] hover:!text-white"
              >
                <span className="text-white !text-white group-hover:!text-white">Participer au SANE</span>
                <ArrowRight
                  size={14}
                  className="text-white !text-white transition-transform group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>

              <Link
                href="/emploi"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/80 bg-transparent px-5 text-xs font-bold text-white !text-white transition-all hover:bg-white/10 hover:!text-white"
              >
                <span className="text-white !text-white group-hover:!text-white">Découvrir les offres</span>
                <ArrowRight
                  size={14}
                  className="text-white !text-white transition-transform group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>
            </div>

          </div>
        </div>

        {/* =========================
            FAR RIGHT DECORATIVE TEXT (Vertically Centered, Dark Green #10632D)
        ========================== */}
        <div className="absolute right-12 top-1/2 z-20 hidden -translate-y-1/2 text-center md:block">
          <p className="font-serif text-[20px] italic leading-[1.2] text-[#10632D]">
            Des talents
            <br />
            pour un Niger
            <br />
            plus fort
          </p>
          <div className="mx-auto mt-2 h-[2.5px] w-10 bg-[#E57617] rounded-full" />
        </div>
      </Container>
    </section>
  );
}