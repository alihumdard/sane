import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  UsersRound,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F3F8F4]">
      <div className="grid min-h-[410px] grid-cols-1 lg:grid-cols-2">
        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-10 flex items-center">
          <div className="w-full px-6 py-12 sm:px-10 lg:ml-auto lg:max-w-[680px] lg:px-14 xl:px-16">
            {/* Label */}
            <div className="mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#10632D]">
                Salon National de l&apos;Emploi
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-[600px] text-[36px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#10632D] sm:text-[48px] lg:text-[52px]">
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
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E57617] px-5 text-xs font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white"
              >
                Participer au SANE
                <ArrowRight
                  size={15}
                  className="text-white !text-white transition-all duration-200 group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>
              <Link
                href="/emploi"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-[#10632D] bg-white px-5 text-xs font-bold text-[#10632D] transition-colors hover:bg-[#10632D] hover:!text-white"
              >
                Découvrir les opportunités
                <ArrowRight
                  size={15}
                  className="text-[#10632D] transition-all group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>
            </div>

            {/* Small highlights */}
            <div className="mt-7 grid max-w-[575px] grid-cols-3 border-t border-[#D4E1D8] pt-5">
              <div className="pr-4">
                <div className="mb-1.5 text-[#E57617]">
                  <BriefcaseBusiness size={18} strokeWidth={2} />
                </div>
                <p className="text-xs font-extrabold text-[#10632D]">Emploi</p>

                <p className="mt-1 text-[10px] leading-4 text-[#718178]">
                  Des opportunités réelles
                </p>
              </div>

              <div className="border-l border-[#D4E1D8] px-4">
                <div className="mb-1.5 text-[#E57617]">
                  <GraduationCap size={18} strokeWidth={2} />
                </div>
                <p className="text-xs font-extrabold text-[#10632D]">
                  Formation
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#718178]">
                  Des compétences pour demain
                </p>
              </div>

              <div className="border-l border-[#D4E1D8] pl-4">
                <div className="mb-1.5 text-[#E57617]">
                  <UsersRound size={18} strokeWidth={2} />
                </div>
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
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center lg:bg-right"
            style={{
              backgroundImage: "url('/homebg.png')",
            }}
          />

          {/* Soft circular/organic transition */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F3F8F4] via-[#F3F8F4]/75 to-transparent" />

          {/* Floating card */}
          <div className="absolute right-5 top-20 z-10 w-[145px] rounded-xl bg-white px-4 py-4 shadow-lg sm:right-8">
            <p className="text-[11px] font-extrabold uppercase leading-5 text-[#10632D]">
              Emploi,
              <br />
              formation,
              <br />
              opportunités,
              <br />
              avenir
            </p>

            <div className="mt-3 h-[3px] w-8 rounded-full bg-[#E57617]" />
          </div>

          {/* Bottom right text */}
          <div className="absolute right-7 top-[235px] z-10 text-right">
            <p className="font-serif text-xl italic font-normal leading-6 text-[#10632D]">
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
