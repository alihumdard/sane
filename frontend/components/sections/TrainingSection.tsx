import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  GraduationCap,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { imageFocus } from "@/components/shared/imageFocus";

const trainings = [
  {
    title: "Leadership & Management",
    duration: "2 jours",
    seats: "Places limitées",
    image: "/Leadership2.webp",
  },
  {
    title: "Transformation Digitale",
    duration: "1 jour",
    seats: "Places limitées",
    image: "/Transformation3.webp",
  },
  {
    title: "Entrepreneuriat des Jeunes",
    duration: "2 jours",
    seats: "Places limitées",
    image: "/Entrepreneuriat.webp",
  },
];

export function TrainingSection() {
  return (
    <section className="bg-white py-14 md:py-16">
      <Container>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Formations"
            icon={GraduationCap}
            title="Développez vos compétences"
            description="Participez à des formations conçues pour renforcer vos compétences et préparer votre avenir professionnel."
          />

          <Link
            href="/formations"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--sane-green)]"
          >
            Voir toutes les formations
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* TRAINING CARDS */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {trainings.map((training) => (
            <article
              key={training.title}
              className="group overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white shadow-[0_4px_20px_rgba(16,99,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,99,45,0.12)]"
            >
              {/* IMAGE */}
              <div className="relative h-[190px] w-full overflow-hidden">
                <Image
                  src={training.image}
                  alt={training.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: imageFocus(training.image) }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="sane-h3">
                  {training.title}
                </h3>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
                    <Clock3 size={13} className="text-[var(--sane-orange)]" />
                    {training.duration}
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
                    <Users size={13} className="text-[var(--sane-orange)]" />
                    {training.seats}
                  </div>
                </div>

                <Link
                  href="/formations"
                  className="group/btn mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--sane-green)]/30 px-4 py-2 text-xs font-bold text-[var(--sane-green)] transition-all hover:border-[var(--sane-green)] hover:bg-[var(--sane-green)] hover:!text-white"
                >
                  <span className="group-hover/btn:!text-white">Voir la formation</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:!text-white"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </Container>
    </section>
  );
}
