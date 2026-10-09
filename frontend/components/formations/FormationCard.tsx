import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { imageFocus } from "@/components/shared";
import type { ApiFormation } from "@/lib/types";
import { tagColors, imagesParCategorie, imageParDefaut } from "./data";

function libellePlaces(f: ApiFormation): string {
  if (f.complete) return "Complet";
  if (f.places_restantes <= 5) return `Plus que ${f.places_restantes} places`;
  return `${f.places_restantes} places disponibles`;
}

export function FormationCard({ formation: f }: { formation: ApiFormation }) {
  const categorie = f.categorie?.nom ?? "";
  const img = f.image ?? imagesParCategorie[categorie] ?? imageParDefaut;

  const facts = [
    { icon: Clock, text: f.duree },
    { icon: Users, text: libellePlaces(f) },
    { icon: MapPin, text: f.lieu },
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--sane-green-light)]">
        <Image
          src={img}
          alt={f.titre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="block object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectPosition: imageFocus(img) }}
        />
        {categorie && (
          <span className={`absolute bottom-2 left-2 rounded-full px-2 py-[2px] text-[10px] font-bold ${tagColors[categorie] ?? "bg-gray-700 text-white"}`}>
            {categorie}
          </span>
        )}
        {f.complete && (
          <span className="absolute right-2 top-2 rounded-full bg-[var(--sane-red-dark)] px-2 py-[2px] text-[10px] font-bold text-white">
            Complet
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="sane-h3 mb-1.5 text-[14px]">{f.titre}</h3>
        <ul className="flex flex-col gap-0.5">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text + f.id} className="sane-small flex items-center gap-1.5 text-[11px]">
              <Icon size={12} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" />
              {text}
            </li>
          ))}
        </ul>
        <div className="sane-small mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded-full bg-[var(--sane-green-light)] px-2 py-0.5 font-semibold text-[var(--sane-green)]">{f.niveau}</span>
          <span className="rounded-full bg-[var(--sane-orange-light)] px-2 py-0.5 font-semibold text-[var(--sane-orange)]">{f.format}</span>
        </div>
        {f.complete ? (
          <span className="mt-auto inline-flex w-fit cursor-not-allowed items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[11px] font-bold text-[var(--sane-text-light)] [&]:mt-2.5">
            Complet
          </span>
        ) : (
          <Link
            href={`/inscription?formation=${f.id}`}
            className="group/btn mt-auto inline-flex w-fit items-center gap-1.5 rounded-lg border border-[var(--sane-green)] px-3 py-1.5 text-[11px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)] [&]:mt-2.5"
          >
            S&apos;inscrire
            <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  );
}
