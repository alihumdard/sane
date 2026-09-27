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
    <section className="bg-[#10632D] py-7 md:py-8">
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

          {/* MIDDLE: COUNTDOWN + LOCATION/DATE UNDERNEATH */}
          <div className="flex flex-col gap-3">
            {/* COUNTDOWN */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="flex w-full min-w-[56px] flex-col items-center justify-center rounded-lg bg-white/10 px-2 py-3 sm:px-3 sm:min-w-[78px]"
                >
                  <span className="text-xl font-extrabold leading-none text-white sm:text-2xl md:text-3xl">
                    {item.value}
                  </span>

                  <span className="mt-1 text-[8px] font-bold tracking-wide text-white/70 sm:text-[9px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* LOCATION / DATE */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-white/80">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#E57617]" />
                <span>Niamey, Niger</span>
              </div>

              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-[#E57617]" />
                <span>Date de l&apos;événement à confirmer</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/programme"
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-[#E57617] px-5 py-3 text-sm font-bold text-white transition-all hover:!bg-[#CF6812] hover:!text-white"
          >
            <span className="text-white hover:!text-white">Voir le programme</span>

            <ArrowRight
              size={17}
              className="text-white transition-transform group-hover:translate-x-1 group-hover:!text-white"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}