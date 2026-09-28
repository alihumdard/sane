import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const trainings = [
  {
    title: "Leadership & Management",
    duration: "2 jours",
    seats: "Places limitées",
    image: "/Leadership.png",
  },
  {
    title: "Transformation Digitale",
    duration: "1 jour",
    seats: "Places limitées",
    image: "/Transformation.png",
  },
  {
    title: "Entrepreneuriat des Jeunes",
    duration: "2 jours",
    seats: "Places limitées",
    image: "/Entrepreneuriat.png",
  },
];

export function TrainingSection() {
  return (
    <section className="bg-white py-14 md:py-16">
      <Container>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[3px] w-6 rounded-full bg-[#E57617]" />
              <span className="text-xs font-bold uppercase tracking-wide text-[#10632D]">
                Formations
              </span>
            </div>

            <h2 className="text-2xl font-extrabold leading-tight text-[#10632D] md:text-4xl">
              Développez vos compétences
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#61756B]">
              Participez à des formations conçues pour renforcer vos
              compétences et préparer votre avenir professionnel.
            </p>
          </div>

          <Link
            href="/formations"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#10632D]"
          >
            Voir toutes les formations
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* TRAINING CARDS */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {trainings.map((training) => (
            <article
              key={training.title}
              className="group overflow-hidden rounded-xl border border-[#DCE8DF] bg-white shadow-[0_4px_20px_rgba(16,99,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,99,45,0.12)]"
            >
              {/* IMAGE */}
              <div className="relative h-[190px] w-full overflow-hidden">
                <Image
                  src={training.image}
                  alt={training.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-[15px] font-bold text-[#17352A]">
                  {training.title}
                </h3>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#718178]">
                    <Clock3 size={13} className="text-[#E57617]" />
                    {training.duration}
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-[#718178]">
                    <Users size={13} className="text-[#E57617]" />
                    {training.seats}
                  </div>
                </div>

                <Link
                  href="/formations"
                  className="group/btn mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#10632D]/30 px-4 py-2 text-xs font-bold text-[#10632D] transition-all hover:border-[#10632D] hover:bg-[#10632D] hover:!text-white"
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
