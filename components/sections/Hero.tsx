import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  UsersRound,
} from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="grid min-h-[410px] grid-cols-1 lg:grid-cols-2">
        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-10 flex items-center">
          <div className="w-full px-5 py-10 sm:px-10 lg:ml-auto lg:max-w-[680px] lg:px-14 xl:px-16">
            {/* Label */}
            <div className="mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-white">
                Salon National de l&apos;Emploi
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-[600px] text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[38px] md:text-[44px] lg:text-[40px] xl:text-[42px]">
              Connectons les talents aux opportunités
              <span className="text-[#E57617]">.</span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[520px] text-[14px] leading-6 text-white/90 sm:text-[15px]">
              Un espace de rencontre entre les talents, les entreprises
              et les opportunités pour un Niger plus fort.
            </p>

            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="group inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-[#E57617] px-6 text-[13px] font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white sm:h-[44px]"
              >
                Participer au SANE
                <ArrowRight
                  size={15}
                  className="text-white !text-white transition-all duration-200 group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>
              <Link
                href="/emploi"
                className="group inline-flex h-[42px] items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-6 text-[13px] font-bold text-[#10632D] transition-colors hover:bg-transparent hover:!text-white sm:h-[44px]"
              >
                Découvrir les opportunités
              </Link>
            </div>

            {/* Small highlights — grid on mobile, flex row on sm+ */}
            <div className="mt-7 border-t border-white/30 pt-5">
              {/* Mobile: 2+1 grid */}
              <div className="grid grid-cols-2 gap-4 sm:hidden">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <BriefcaseBusiness size={15} strokeWidth={2} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Emploi</p>
                    <p className="text-[9px] leading-[1.3] text-white/75">Opportunités réelles</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E57617]/20">
                    <GraduationCap size={15} strokeWidth={2} className="text-[#E57617]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Formation</p>
                    <p className="text-[9px] leading-[1.3] text-white/75">Compétences pour demain</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <UsersRound size={15} strokeWidth={2} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Réseautage</p>
                    <p className="text-[9px] leading-[1.3] text-white/75">Meilleurs recruteurs</p>
                  </div>
                </div>
              </div>

              {/* sm+: single row with dividers */}
              <div className="hidden max-w-[575px] items-center gap-6 sm:flex md:gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <BriefcaseBusiness size={17} strokeWidth={2} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white">Emploi</p>
                    <p className="text-[10px] leading-[1.3] text-white/75">
                      Des opportunités réelles
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E57617]/20">
                    <GraduationCap size={17} strokeWidth={2} className="text-[#E57617]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white">Formation</p>
                    <p className="text-[10px] leading-[1.3] text-white/75">
                      Des compétences pour demain
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <UsersRound size={17} strokeWidth={2} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white">Réseautage</p>
                    <p className="text-[10px] leading-[1.3] text-white/75">
                      Avec les meilleurs recruteurs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="relative hidden min-h-[410px] overflow-hidden lg:block">
          {/* Soft transition from left content area */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent to-transparent" />

          {/* Floating card */}
          <div className="absolute right-5 top-20 z-10 w-[145px] rounded-xl bg-white px-4 py-4 shadow-lg xl:right-8">
            <p className="text-[11px] font-extrabold uppercase leading-5 text-[#10632D]">
              Emploi
              <br />
              Formation
              <br />
              Opportunités
              <br />
              Avenir
            </p>

            <div className="mt-3 h-[3px] w-8 rounded-full bg-[#E57617]" />
          </div>

          {/* Bottom right script text */}
          <div className="absolute bottom-12 right-7 z-10 text-right">
            <p className="font-serif text-xl italic leading-6 text-white">
              Un Niger
              <br />
              de Talents
            </p>

            <div className="ml-auto mt-2 h-[3px] w-12 bg-[#E57617]" />
          </div>
        </div>
      </div>
    </section>
  );
}
