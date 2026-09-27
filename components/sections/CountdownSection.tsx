import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";

const countdownItems = [
  {
    value: "24",
    label: "JOURS",
  },
  {
    value: "18",
    label: "HEURES",
  },
  {
    value: "36",
    label: "MINUTES",
  },
  {
    value: "12",
    label: "SECONDES",
  },
];

export function CountdownSection() {
  return (
    <section className="bg-[#006B3C] py-7 md:py-8">
      <Container>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="max-w-[360px]">
            <div className="mb-2 h-[3px] w-8 rounded-full bg-[#E57617]" />

            <h2 className="text-xl font-extrabold leading-tight text-white md:text-2xl">
              Rendez-vous au
              <br />
              Salon National de l&apos;Emploi
            </h2>

            <p className="mt-2 text-sm leading-5 text-white/75">
              Un événement pour l&apos;emploi, la formation et l&apos;avenir
              des talents nigériens.
            </p>
          </div>

          {/* COUNTDOWN */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="flex min-w-[65px] flex-col items-center justify-center rounded-lg bg-[#087A48] px-3 py-3 sm:min-w-[78px]"
              >
                <span className="text-2xl font-extrabold leading-none text-white md:text-3xl">
                  {item.value}
                </span>

                <span className="mt-1 text-[9px] font-bold tracking-wide text-white/70">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/programme"
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-[#E57617] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#CF6812]"
          >
            Voir le programme

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* LOCATION / DATE */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-5 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-7">

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#E57617]" />

            <span>Niamey, Niger</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[#E57617]" />

            <span>Date de l&apos;événement à confirmer</span>
          </div>

        </div>
      </Container>
    </section>
  );
}