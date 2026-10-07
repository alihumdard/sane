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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--sane-green-light)]">
        <Image
          src={f.img}
          alt={f.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="block object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectPosition: imageFocus(f.img) }}
        />
        <span className={`absolute bottom-2 left-2 rounded-full px-2 py-[2px] text-[10px] font-bold ${tagColors[f.tag] ?? "bg-gray-700 text-white"}`}>
          {f.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="sane-h3 mb-1.5 text-[14px]">{f.title}</h3>
        <ul className="flex flex-col gap-0.5">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text + f.title} className="sane-small flex items-center gap-1.5 text-[11px]">
              <Icon size={12} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" />
              {text}
            </li>
          ))}
        </ul>
        <div className="sane-small mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded-full bg-[var(--sane-green-light)] px-2 py-0.5 font-semibold text-[var(--sane-green)]">{f.niveau}</span>
          <span className="rounded-full bg-[var(--sane-orange-light)] px-2 py-0.5 font-semibold text-[var(--sane-orange)]">{f.format}</span>
        </div>
        <Link
          href="/inscription"
          className="group/btn mt-auto inline-flex w-fit items-center gap-1.5 rounded-lg border border-[var(--sane-green)] px-3 py-1.5 text-[11px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)] [&]:mt-2.5"
        >
          S&apos;inscrire
          <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
