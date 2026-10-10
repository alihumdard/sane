import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Building2, GraduationCap, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const impactStats: Stat[] = [
  { icon: BriefcaseBusiness, value: "+500", label: "Opportunités" },
  { icon: Building2, value: "+100", label: "Entreprises" },
  { icon: UsersRound, value: "+1000", label: "Participants" },
  { icon: GraduationCap, value: "+20", label: "Formations" },
];

export function ImpactSection() {
  return (
    <section className="relative bg-white py-10 sm:py-12 md:py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/vision-bg.webp')" }}
      />
      <Container className="relative z-10">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="sane-eyebrow-bar" />
              <span className="sane-eyebrow">Notre Impact</span>
            </div>

            <h2 className="sane-h2">
              Un catalyseur d&apos;opportunités pour tous
            </h2>

            <p className="sane-body mt-3">
              Depuis sa création, le SANEM s&apos;impose comme un acteur clé de l&apos;écosystème
              de l&apos;emploi et de la formation au Niger. Grâce à une mobilisation nationale,
              il contribue chaque année à créer des passerelles concrètes entre les jeunes
              talents et le monde professionnel.
            </p>
            <p className="sane-body mt-3">
              En réunissant entreprises, institutions publiques et acteurs de la
              formation, le SANEM favorise un dialogue direct entre l&apos;offre et la
              demande d&apos;emploi, tout en valorisant les compétences locales et
              l&apos;innovation entrepreneuriale.
            </p>

            <Link
              href="/programme"
              className="group mt-4 inline-flex h-[38px] items-center gap-2 rounded-full bg-[var(--sane-green)] px-6 text-[12px] font-semibold !text-white transition-colors hover:bg-white hover:!text-[var(--sane-green)] hover:border-[var(--sane-green)] border border-transparent sm:h-[40px] sm:px-7 sm:text-[13px]"
            >
              En savoir plus
              <ArrowRight size={15} className="text-white transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--sane-green)]" />
            </Link>
          </div>

          <div className="relative">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/sane-deal3.webp"
                alt="Impact SANEM"
                fill
                className="object-cover object-[center_25%]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 right-4 text-right sm:bottom-5 sm:right-5">
                <p className="font-serif text-[15px] italic leading-[1.3] text-white drop-shadow sm:text-[17px]">
                  Des talents
                  <br />
                  pour un Niger
                  <br />
                  plus fort
                </p>
                <div className="ml-auto mt-1.5 h-[3px] w-10 bg-[var(--sane-orange)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {impactStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2.5">
                  <Icon size={22} strokeWidth={1.5} className="shrink-0 text-[var(--sane-orange)]" />
                  <AnimatedCounter value={stat.value} className="text-[length:var(--fs-h3)] font-extrabold text-[var(--sane-green)] sm:text-[22px]" />
                </div>
                <p className="sane-small mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
