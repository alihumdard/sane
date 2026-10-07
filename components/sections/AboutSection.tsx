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
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-14">

          {/* ================= IMAGE GALLERY ================= */}
          <div className="relative w-full">

            {/* SANEM Collage Image */}
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/sanem_collage.png"
                alt="SANEM Collage"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Right Stacked Images — hidden now replaced by collage */}
            <div className="hidden">

              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/sane_company.png"
                  alt="SANEM Company"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/sane-cv2.png"
                  alt="SANEM CV"
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
                <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />

                <span className="text-xs font-bold uppercase tracking-wide text-[var(--sane-green)]">
                  À PROPOS
                </span>
              </div>

              {/* Heading */}
              <h2 className="sane-h2">
                Le SANEM, un engagement
                <br />
                pour l&apos;avenir professionnel
              </h2>

              {/* Description */}
              <p className="sane-body mt-3 md:mt-4">
                Le Salon National de l&apos;Emploi du Niger (SANEM) est un espace de rencontre
                entre les talents, les entreprises et les opportunités
                professionnelles.
              </p>

              <p className="sane-body mt-2 md:mt-3">
                Le SANEM vise à favoriser l&apos;insertion professionnelle,
                renforcer les compétences et promouvoir l&apos;emploi au Niger à
                travers des rencontres, des formations et un accompagnement
                personnalisé.
              </p>

              {/* CTA */}
              <Link
                href="/a-propos"
                className="group mt-5 inline-flex items-center gap-3 rounded-lg bg-[var(--sane-green)] px-5 py-3 text-sm font-bold text-white !text-white transition-all duration-300 hover:bg-[#0B5124] hover:!text-white"
              >
                <span className="text-white !text-white hover:!text-white">En savoir plus</span>

                <ArrowRight
                  size={17}
                  className="text-white !text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:!text-white"
                />
              </Link>

            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 pt-2 sm:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`
                      border-[var(--sane-border)]
                      text-center
                      sm:border-l
                      sm:pl-4
                      sm:text-left
                      ${index === 0 ? "sm:border-l-0 sm:pl-0" : ""}
                    `}
                  >
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className="text-[var(--sane-orange)]"
                      />

                      <span className="text-lg font-extrabold text-[var(--sane-green)]">
                        {stat.value}
                      </span>
                    </div>

                    <p className="sane-small mt-1">
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