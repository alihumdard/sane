import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Target,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export interface ChiffresAccueil {
  offres: number;
  entreprises: number;
  inscriptions: number;
  formations: number;
}

/**
 * The "À propos" block on the home page.
 *
 * Its four counters read "+500 Opportunités", "+100 Entreprises", "+1000
 * Participants" and "+20 Formations" — written into this file, counted
 * nowhere, and animated on scroll so they read as live readings. They are
 * now the same counts the rest of the site shows, and the row stays away
 * until they arrive rather than animating up to a number nobody measured.
 */
export function AboutSection({ chiffres }: { chiffres: ChiffresAccueil | null }) {
  const stats = chiffres
    ? [
        { icon: BriefcaseBusiness, value: String(chiffres.offres), label: "Offres publiées" },
        { icon: Building2, value: String(chiffres.entreprises), label: "Entreprises" },
        { icon: UsersRound, value: String(chiffres.inscriptions), label: "Inscrits" },
        { icon: GraduationCap, value: String(chiffres.formations), label: "Formations" },
      ]
    : [];

  return (
    <section className="bg-white py-14 md:py-16">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-14">

          {/* ================= IMAGE GALLERY ================= */}
          <div className="relative w-full">

            {/* SANEM Collage Image */}
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/sanem_collage.webp"
                alt="SANEM Collage"
                fill
                className="object-cover object-[40%_center]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="relative">

            {/* Unified Content Wrapper */}
            <div>

              <SectionHeading
                eyebrow="À propos"
                icon={Target}
                title={<>Le SANEM, un engagement<br />pour l&apos;avenir professionnel</>}
              />

              <p className="sane-body mt-3 max-w-xl md:mt-4">
                Le Salon National de l&apos;Emploi du Niger (SANEM) est un espace de rencontre
                entre les talents, les entreprises et les opportunités
                professionnelles.
              </p>

              <p className="sane-body mt-2 max-w-xl md:mt-3">
                Le SANEM vise à favoriser l&apos;insertion professionnelle,
                renforcer les compétences et promouvoir l&apos;emploi au Niger à
                travers des rencontres, des formations et un accompagnement
                personnalisé.
              </p>

              {/* CTA */}
              <Link
                href="/a-propos"
                className="group mt-5 inline-flex items-center gap-3 rounded-lg bg-[var(--sane-green)] px-5 py-3 text-sm font-bold !text-white transition-all duration-300 hover:bg-[var(--sane-c-0b5124)]"
              >
                En savoir plus
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

            {/* Stats */}
            <div
              className={`mt-8 grid-cols-2 gap-x-4 gap-y-6 pt-2 sm:grid-cols-4 ${
                stats.length > 0 ? "grid" : "hidden"
              }`}
            >
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

                      <AnimatedCounter value={stat.value} className="text-lg font-extrabold text-[var(--sane-green)]" />
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