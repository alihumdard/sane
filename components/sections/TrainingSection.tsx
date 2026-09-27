import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
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

            <h2 className="text-3xl font-extrabold leading-tight text-[#10632D] md:text-4xl">
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
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {trainings.map((training) => (
            <article
              key={training.title}
              className="flex gap-4 rounded-xl border border-[#DCE8DF] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-[115px] w-[115px] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={training.image}
                  alt={training.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="115px"
                />
              </div>

              {/* CONTENT */}
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-sm font-extrabold leading-5 text-[#10632D]">
                  {training.title}
                </h3>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#718178]">
                    <Clock3
                      size={13}
                      className="shrink-0 text-[#E57617]"
                    />
                    {training.duration}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#718178]">
                    <CalendarDays
                      size={13}
                      className="shrink-0 text-[#E57617]"
                    />
                    {training.seats}
                  </div>
                </div>

                <Link
                  href="/formations"
                  className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-xs font-bold text-[#10632D]"
                >
                  Voir la formation

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
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