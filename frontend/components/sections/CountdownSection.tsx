import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CountdownTimer } from "./CountdownTimer";

export function CountdownSection() {
  return (
    <section className="bg-[var(--sane-green)] py-10 md:py-12">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8 lg:gap-10">

          {/* LEFT — text */}
          <div className="shrink-0 md:max-w-[260px] lg:max-w-[300px]">
            <div className="mb-2 h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />

            <h2 className="sane-h3 on-dark">
              Rendez-vous au
              <br />
              Salon National de l&apos;Emploi du Niger (SANEM)
            </h2>

            <p className="sane-body on-dark mt-2">
              Un événement pour l&apos;emploi, la formation et
              l&apos;avenir des talents nigériens.
            </p>
          </div>

          {/* MIDDLE — countdown + meta */}
          <div className="flex flex-1 flex-col gap-2.5">
            <CountdownTimer />

            <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/75">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[var(--sane-orange)]" />
                <span>Niamey, Niger</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-[var(--sane-orange)]" />
                <span>12 Décembre 2026</span>
              </div>
            </div>
          </div>

          {/* RIGHT — CTA */}
          <Link
            href="/programme"
            className="group inline-flex shrink-0 items-center justify-center gap-2.5 self-start rounded-full bg-[var(--sane-orange)] px-6 py-3 text-[13px] font-bold text-white !text-white transition-all hover:bg-[var(--sane-orange-dark)] hover:!text-white md:self-center whitespace-nowrap"
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
