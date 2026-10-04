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
          <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[300px] lg:h-[360px]">
            <Image src="/sane_deal.png" alt="Palais des Congrès de Niamey" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <p className="sane-small absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 font-bold uppercase !text-[var(--sane-text)] backdrop-blur-sm">
              Palais des Congrès
              <br />
              de Niamey
            </p>
          </div>

          <div>
            <h3 className="sane-h3 mb-3">Lieu de l&apos;événement</h3>
            <p className="sane-body mb-6">
              Le Salon National de l&apos;Emploi (SANE) se tient au Palais des Congrès de Niamey, un lieu moderne et accessible,
              situé au cœur de la capitale. Rejoignez-nous pour découvrir des opportunités et rencontrer les acteurs clés de
              l&apos;emploi au Niger.
            </p>

            <ul className="mb-6 flex flex-col gap-3.5">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0 text-[var(--sane-orange)]" />
                  <span className="sane-body">{text}</span>
                </li>
              ))}
            </ul>

            <Link href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
              Ouvrir dans Google Maps <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--sane-border)]">
          <iframe
            title="Carte — Palais des Congrès de Niamey"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[280px] w-full sm:h-[340px]"
          />
        </div>
      </Container>
    </section>
  );
}
