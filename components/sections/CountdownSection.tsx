import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";

const countdownItems = [
  { value: "24", label: "JOURS" },
  { value: "18", label: "HEURES" },
  { value: "36", label: "MINUTES" },
  { value: "12", label: "SECONDES" },
];

export function CountdownSection() {
  return (
    <section className="bg-[#10632D] py-10 md:py-12">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">

          {/* LEFT — text */}
          <div className="shrink-0 lg:max-w-[300px]">
            <div className="mb-2 h-[3px] w-8 rounded-full bg-[#E57617]" />

            <h2 className="text-lg font-extrabold leading-tight text-white md:text-xl">
              Rendez-vous au
              <br />
              Salon National de l&apos;Emploi
            </h2>

            <p className="mt-2 text-[13px] leading-5 text-white/70">
              Un événement pour l&apos;emploi, la formation et
              l&apos;avenir des talents nigériens.
            </p>
          </div>

          {/* MIDDLE — countdown + meta */}
          <div className="flex flex-1 flex-col gap-2.5">
            {/* Countdown boxes */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center rounded-lg bg-white/10 px-2 py-2.5 sm:px-3 sm:py-3"
                >
                  <span className="text-xl font-extrabold leading-none text-white sm:text-2xl md:text-[28px]">
                    {item.value}
                  </span>
                  <span className="mt-1 text-[7px] font-bold uppercase tracking-wider text-white/60 sm:text-[8px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Location / Date */}
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/75">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[#E57617]" />
                <span>Niamey, Niger</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-[#E57617]" />
                <span>Date de l&apos;événement à confirmer</span>
              </div>
            </div>
          </div>

          {/* RIGHT — CTA */}
          <Link
            href="/programme"
            className="group inline-flex shrink-0 items-center justify-center gap-2.5 self-start rounded-full bg-[#E57617] px-6 py-3 text-[13px] font-bold text-white !text-white transition-all hover:bg-[#CF6812] hover:!text-white lg:self-center"
          >
            Voir le programme
            <ArrowRight
              size={16}
              className="text-white transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
