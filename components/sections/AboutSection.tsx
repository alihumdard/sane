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
    <section className="bg-white py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ================= IMAGE GALLERY ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.35fr_0.85fr] gap-3 items-center">

            {/* Main Large Left Image (/sane_deal.png) */}
            <div className="relative h-[280px] overflow-hidden rounded-xl sm:h-[420px]">
              <Image
                src="/sane_deal.png"
                alt="SANE Deal"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>

            {/* Right Stacked Images (/sane_company.png & /sane_cv.png) */}
            <div className="grid h-[280px] grid-rows-2 gap-3 sm:h-[420px]">

              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/sane_company.png"
                  alt="SANE Company"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/sane_cv.png"
                  alt="SANE CV"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="relative">

            {/* Unified Content Wrapper */}
            <div>

              {/* Label */}
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[#E57617]" />

                <span className="text-xs font-bold uppercase tracking-wide text-[#10632D]">
                  À PROPOS
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-extrabold leading-[1.12] tracking-tight text-[#10632D] md:text-4xl">
                Le SANE, un engagement
                <br />
                pour l&apos;avenir professionnel
              </h2>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-[#61756B] md:mt-4 md:text-base md:leading-7">
                Le Salon National de l&apos;Emploi est un espace de rencontre
                entre les talents, les entreprises et les opportunités
                professionnelles.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#61756B] md:mt-3 md:text-base md:leading-7">
                Le SANE vise à favoriser l&apos;insertion professionnelle,
                renforcer les compétences et promouvoir l&apos;emploi au Niger à
                travers des rencontres, des formations et un accompagnement
                personnalisé.
              </p>

              {/* CTA */}
              <Link
                href="/a-propos"
                className="group mt-5 inline-flex items-center gap-3 rounded-lg bg-[#10632D] px-5 py-3 text-sm font-bold text-white !text-white transition-all duration-300 hover:bg-[#0B5124] hover:!text-white"
              >
                <span className="text-white !text-white hover:!text-white">En savoir plus</span>

                <ArrowRight
                  size={17}
                  className="text-white !text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>

            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-y-6 pt-2 sm:grid-cols-4">
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
                        size={16}
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