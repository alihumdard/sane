import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/ui/Container";

const stats = [
  {
    icon: BriefcaseBusiness,
    value: "+500",
    label: "Opportunités",
  },
  {
    icon: Building2,
    value: "+100",
    label: "Entreprises",
  },
  {
    icon: UsersRound,
    value: "+1000",
    label: "Participants",
  },
  {
    icon: GraduationCap,
    value: "+20",
    label: "Formations",
  },
];

export function AboutSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[42%_58%] lg:gap-14">

          {/* ================= IMAGE GALLERY ================= */}
          <div className="grid grid-cols-[1.35fr_0.85fr] gap-3">

            {/* Main Image */}
            <div className="relative h-[390px] overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85"
                alt="Professionnels en réunion"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 70vw, 42vw"
              />

              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10632D]/35 via-transparent to-transparent" />

              {/* SANE Badge */}
              <div className="absolute left-4 top-4 rounded-full border-2 border-[#E57617] bg-white px-4 py-2 shadow-md">
                <span className="text-lg font-black tracking-tight text-[#10632D]">
                  SANE
                </span>
              </div>

              {/* Bottom Label */}
              <div className="absolute bottom-5 left-4 rounded-lg bg-white/95 px-4 py-3 shadow-md">
                <p className="text-xs font-bold text-[#10632D]">
                  Salon National de l&apos;Emploi
                </p>
              </div>
            </div>

            {/* Right Images */}
            <div className="grid h-[390px] grid-rows-2 gap-3">

              {/* Small Image 1 */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=85"
                  alt="Talents et professionnels"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 30vw, 20vw"
                />

                <div className="absolute inset-0 bg-[#10632D]/10" />
              </div>

              {/* Small Image 2 */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=85"
                  alt="Professionnels en collaboration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 30vw, 20vw"
                />

                <div className="absolute inset-0 bg-[#E57617]/10" />
              </div>

            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div>

            {/* Label */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[3px] w-7 rounded-full bg-[#E57617]" />

              <span className="text-xs font-bold uppercase tracking-wide text-[#10632D]">
                À propos
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-[650px] text-3xl font-extrabold leading-tight tracking-tight text-[#10632D] md:text-4xl">
              Le SANE, un engagement
              <br />
              pour l&apos;avenir professionnel
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-[620px] text-base leading-7 text-[#61756B]">
              Le Salon National de l&apos;Emploi est un espace de rencontre
              entre les talents, les entreprises et les opportunités
              professionnelles.
            </p>

            <p className="mt-3 max-w-[620px] text-base leading-7 text-[#61756B]">
              Le SANE vise à favoriser l&apos;insertion professionnelle,
              renforcer les compétences et promouvoir l&apos;emploi au Niger à
              travers des rencontres, des formations et un accompagnement
              personnalisé.
            </p>

            {/* CTA */}
            <Link
              href="/a-propos"
              className="group mt-6 inline-flex items-center gap-3 rounded-lg bg-[#10632D] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#0B5124]"
            >
              En savoir plus

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Stats */}
            <div className="mt-9 grid grid-cols-2 gap-y-6 border-t border-[#DDE8E0] pt-6 sm:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`
                      border-[#DDE8E0]
                      sm:border-l
                      sm:pl-4
                      ${index === 0 ? "sm:border-l-0 sm:pl-0" : ""}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        size={15}
                        strokeWidth={2}
                        className="text-[#E57617]"
                      />

                      <span className="text-lg font-extrabold text-[#10632D]">
                        {stat.value}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[#61756B]">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}