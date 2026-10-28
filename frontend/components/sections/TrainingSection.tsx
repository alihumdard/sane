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

export interface FormationAccueil {
  titre: string;
  slug: string;
  duree: string;
  places: string;
  image: string;
}

/**
 * Three courses from the catalogue, on the home page.
 *
 * They were three written into this file — "Leadership & Management",
 * "Transformation Digitale", "Entrepreneuriat des Jeunes", each "Places
 * limitées" — beside a real catalogue that held none of them, and every
 * "Voir la formation" button went to the list rather than to a course. The
 * offers block above had the same problem and was fixed; this one kept its
 * own copy.
 */
export function TrainingSection({ formations = [] }: { formations?: FormationAccueil[] }) {
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

        <p
          className={`sane-body mt-8 rounded-xl border border-dashed border-[var(--sane-border)] py-10 text-center ${
            formations.length === 0 ? "block" : "hidden"
          }`}
        >
          Le catalogue de formations sera publié prochainement.
        </p>

        {/* TRAINING CARDS */}
        <div
          className={`mt-8 gap-5 sm:grid-cols-2 md:grid-cols-3 ${formations.length > 0 ? "grid" : "hidden"}`}
        >
          {formations.map((training) => (
            <article
              key={training.slug}
              className="group overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white shadow-[0_4px_20px_rgba(16,99,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,99,45,0.12)]"
            >
              {/* IMAGE */}
              <div className="relative h-[190px] w-full overflow-hidden">
                <Image
                  src={training.image}
                  alt={training.titre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: imageFocus(training.image) }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="sane-h3">
                  {training.titre}
                </h3>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
                    <Clock3 size={13} className="text-[var(--sane-orange)]" />
                    {training.duree}
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
                    <Users size={13} className="text-[var(--sane-orange)]" />
                    {training.places}
                  </div>
                </div>

                <Link
                  href={`/formations#${training.slug}`}
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
