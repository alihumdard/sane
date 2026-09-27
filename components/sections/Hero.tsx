import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F3F8F4]">
      <div className="grid min-h-[410px] grid-cols-1 lg:grid-cols-2">

        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-10 flex items-center">
          <div className="w-full px-6 py-12 sm:px-10 lg:ml-auto lg:max-w-[680px] lg:px-14 xl:px-16">

            {/* Label */}
            <div className="mb-4 flex items-center gap-2">
              <span className="h-[3px] w-7 rounded-full bg-[#E57617]" />

              <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#10632D]">
                Salon National de l&apos;Emploi
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-[600px] text-[42px] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#10632D] sm:text-[48px] lg:text-[52px]">
              Connectons les talents aux
              <br />
              opportunités
              <span className="text-[#E57617]">.</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[520px] text-[15px] leading-6 text-[#61756B]">
              Un espace de rencontre entre les talents, les entreprises et les
              opportunités professionnelles.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E57617] px-5 text-xs font-bold text-white transition hover:bg-[#CF6812]"
              >
                Participer au SANE

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/emploi"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-[#10632D] bg-white px-5 text-xs font-bold text-[#10632D] transition hover:bg-[#10632D] hover:text-white"
              >
                Découvrir les opportunités

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Small highlights */}
            <div className="mt-7 grid max-w-[575px] grid-cols-3 border-t border-[#D4E1D8] pt-5">

              <div className="pr-4">
                <p className="text-xs font-extrabold text-[#10632D]">
                  Emploi
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#718178]">
                  Des opportunités réelles
                </p>
              </div>

              <div className="border-l border-[#D4E1D8] px-4">
                <p className="text-xs font-extrabold text-[#10632D]">
                  Formation
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#718178]">
                  Des compétences pour demain
                </p>
              </div>

              <div className="border-l border-[#D4E1D8] pl-4">
                <p className="text-xs font-extrabold text-[#10632D]">
                  Réseautage
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#718178]">
                  Avec les meilleurs recruteurs
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="relative min-h-[330px] overflow-hidden lg:min-h-[410px]">

          {/* Dummy image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=90')",
            }}
          />

          {/* Image soft overlay */}
          <div className="absolute inset-0 bg-[#10632D]/10" />

          {/* Left curved transition */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F3F8F4] via-[#F3F8F4]/70 to-transparent" />

          {/* Orange curved border */}
          <div className="absolute -left-14 -top-20 h-[500px] w-[180px] rounded-full border-2 border-[#E57617]/30" />

          {/* Floating card */}
          <div className="absolute right-5 top-12 z-10 w-[145px] rounded-xl bg-white px-4 py-4 shadow-lg sm:right-8">

            <div className="h-[3px] w-8 rounded-full bg-[#E57617]" />

            <p className="mt-3 text-[11px] font-extrabold uppercase leading-5 text-[#10632D]">
              Emploi,
              <br />
              formation,
              <br />
              opportunités,
              <br />
              avenir
            </p>

          </div>

          {/* Bottom right text */}
          <div className="absolute bottom-9 right-7 z-10">
            <p className="font-serif text-xl italic leading-6 text-white drop-shadow-md">
              Un vivier
              <br />
              de talents
            </p>

            <div className="ml-auto mt-2 h-[3px] w-12 bg-[#E57617]" />
          </div>

        </div>
      </div>
    </section>
  );
}