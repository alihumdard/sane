import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { imageFocus } from "@/components/shared";
import { tagColors, type Formation } from "./data";

export function FormationCard({ formation: f }: { formation: Formation }) {
  const facts = [
    { icon: Clock, text: f.duree },
    { icon: Users, text: f.places },
    { icon: MapPin, text: f.lieu },
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sane-green-light)]">
        <Image
          src={f.img}
          alt={f.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectPosition: imageFocus(f.img) }}
        />
        <span className={`absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-[3px] text-[11px] font-bold ${tagColors[f.tag] ?? "bg-gray-700 text-white"}`}>
          {f.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="sane-h3 mb-2.5">{f.title}</h3>
        <ul className="flex flex-col gap-1">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text + f.title} className="sane-small flex items-center gap-2">
              <Icon size={13} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" />
              {text}
            </li>
          ))}
        </ul>
        <div className="sane-small mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-[var(--sane-green-light)] px-2.5 py-0.5 font-semibold text-[var(--sane-green)]">{f.niveau}</span>
          <span className="rounded-full bg-[var(--sane-orange-light)] px-2.5 py-0.5 font-semibold text-[var(--sane-orange)]">{f.format}</span>
        </div>
        <Link
          href="/inscription"
          className="group/btn mt-auto inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--sane-green)] px-4 py-2 text-[length:var(--fs-small)] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)] [&]:mt-4"
        >
          S&apos;inscrire
          <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
