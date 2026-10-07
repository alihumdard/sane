import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bus, Car, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { primaryBtn } from "@/components/ui/styles";
import { MAPS_EMBED, MAPS_LINK } from "./data";

const perks = [
  { icon: MapPin, text: "Palais des Congrès de Niamey, Niger" },
  { icon: Car, text: "Accès facile et parking disponible" },
  { icon: Bus, text: "Accessible en transport public" },
];

export function LocationSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Notre localisation" title="Retrouvez-nous au Palais des Congrès" className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative h-[220px] overflow-hidden rounded-2xl sm:h-[260px] lg:h-[320px]">
            <Image src="/sane_deal.png" alt="Palais des Congrès de Niamey" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <p className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 text-[11px] font-bold uppercase text-[var(--sane-text)] backdrop-blur-sm">
              Palais des Congrès
              <br />
              de Niamey
            </p>
          </div>

          <div>
            <h3 className="text-[18px] font-bold text-[#0a2e16] sm:text-[20px]">Lieu de l&apos;événement</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#61756B] sm:text-[14px]">
              Le Salon National de l&apos;Emploi (SANEM) se tient au Palais des Congrès de Niamey, un lieu moderne et accessible,
              situé au cœur de la capitale. Rejoignez-nous pour découvrir des opportunités et rencontrer les acteurs clés de
              l&apos;emploi au Niger.
            </p>

            <ul className="mt-5 flex flex-col gap-3">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0 text-[var(--sane-orange)]" />
                  <span className="text-[13px] text-[#0a2e16]">{text}</span>
                </li>
              ))}
            </ul>

            <Link href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={`${primaryBtn} mt-6`}>
              Voir sur la carte <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>

      {/* Map strip */}
      <div className="relative mt-10">
        <iframe
          title="Carte — Palais des Congrès de Niamey"
          src={MAPS_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[180px] w-full sm:h-[200px]"
        />
        <div className="absolute bottom-3 left-4 top-3 z-10 flex w-[260px] flex-col justify-center rounded-xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm max-sm:static max-sm:w-full max-sm:rounded-none max-sm:shadow-none max-sm:border-t max-sm:border-[var(--sane-border)] sm:left-8 lg:left-16">
          <div className="mb-1.5 flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-[var(--sane-orange)]" />
            <h3 className="text-[14px] font-bold text-[#0a2e16]">Palais des Congrès de Niamey</h3>
          </div>
          <p className="mb-3 pl-6 text-[12px] text-[#61756B]">Niamey, Niger</p>
          <Link
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sane-orange)] px-5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--sane-orange-dark)]"
          >
            Ouvrir dans Google Maps <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
