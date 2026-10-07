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
    <section className="bg-[var(--sane-background)] pt-0 pb-10 sm:pb-12 md:pb-16">
      <Container>
        <SectionHeading eyebrow="Notre localisation" title="Retrouvez-nous un Palais des Congrès" className="mb-6" />

        <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="relative h-[200px] overflow-hidden rounded-2xl sm:h-[240px] lg:h-[280px]">
            <Image src="/contact-bulding.png" alt="Palais des Congrès de Niamey" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>

          <div>
            <h3 className="text-[18px] font-extrabold text-[var(--sane-green)] sm:text-[22px]">Lieu de l&apos;événement</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#61756B]">
              Le Salon National de l&apos;Emploi (SANEM) se tient au Palais des Congrès de Niamey, un lieu moderne et accessible,
              situé au cœur de la capitale. Rejoignez-nous pour découvrir des opportunités et rencontrer les acteurs clés de
              l&apos;emploi au Niger.
            </p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Icon size={15} className="shrink-0 text-[var(--sane-orange)]" />
                  <span className="text-[13px] text-[#0a2e16]">{text}</span>
                </li>
              ))}
            </ul>

            <Link href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={`${primaryBtn} mt-5`}>
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
          className="block h-[260px] w-full sm:h-[300px]"
        />
        <div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 w-[280px] rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm max-sm:static max-sm:translate-y-0 max-sm:w-full max-sm:rounded-t-none max-sm:shadow-none lg:left-10">
          <div className="mb-1 flex items-center gap-2">
            <MapPin size={18} className="shrink-0 text-[var(--sane-orange)]" />
            <h3 className="text-[15px] font-bold text-[#0a2e16]">Palais des Congrès de Niamey</h3>
          </div>
          <p className="mb-3 pl-[26px] text-[13px] text-[#61756B]">Niamey, Niger</p>
          <Link
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--sane-orange)] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--sane-orange-dark)]"
          >
            Ouvrir dans Google Maps <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
