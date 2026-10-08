import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Car, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

const venueFeatures: { icon: LucideIcon; label: string }[] = [
  { icon: MapPin, label: "Niamey, Niger" },
  { icon: CalendarDays, label: "Date à confirmer" },
  { icon: Car, label: "Accès facile et parking disponible" },
];

export function VenueSection() {
  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-12 md:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/vision-bg.png')" }}
      />
      <Container className="relative z-10">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-8 lg:gap-12">

          {/* Image — fills container, building centred */}
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-[var(--sane-border)]">
            <Image
              src="/programme-bd.png"
              alt="Palais des Congrès de Niamey"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
            />
          </div>

          {/* Text content */}
          <div className="flex gap-4 overflow-hidden lg:gap-6">
            <div className="flex-1">
              <span className="mb-3 block h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />

              <h2 className="sane-h2">
                Lieu de l&apos;événement
              </h2>

              <p className="mt-2 text-[13px] font-bold text-[var(--sane-orange)] sm:text-[14px]">
                Palais des Congrès de Niamey
              </p>

              <p className="sane-body mt-3">
                Le SANEM se tiendra au Palais des Congrès de Niamey, un lieu emblématique et accessible,
                offrant un cadre idéal pour accueillir tous les participants.
              </p>

              <ul className="mt-4 flex flex-col gap-3">
                {venueFeatures.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50">
                      <Icon size={15} strokeWidth={2} className="text-[var(--sane-orange)]" />
                    </span>
                    <span className="text-[12.5px] leading-snug text-[var(--sane-text-light)] sm:text-[13px]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className="group mt-5 inline-flex h-[40px] items-center gap-2 rounded-lg border border-[var(--sane-green)] bg-white px-5 text-[12.5px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-background)] sm:h-[42px] sm:text-[13px]"
              >
                Voir sur la carte
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Niamey location pin — visible on lg+ */}
            <div className="hidden shrink-0 flex-col items-center gap-2 pt-16 lg:flex">
              <svg
                width="42"
                height="42"
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="21" cy="21" r="20" stroke="#dce8e1" strokeWidth="1.5" fill="white" />
                <path
                  d="M21 9C16.03 9 12 13.03 12 18c0 6.56 9 15 9 15s9-8.44 9-15c0-4.97-4.03-9-9-9Z"
                  fill="var(--sane-orange)"
                />
                <circle cx="21" cy="18" r="2.8" fill="white" />
              </svg>
              <span className="text-[12px] font-bold italic text-[var(--sane-text)]">Niamey</span>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
