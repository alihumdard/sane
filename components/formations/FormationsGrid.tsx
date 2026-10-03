"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Users, MapPin, Search, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formations, domaines, niveaux, formats, tagColors } from "./data";

export function FormationsGrid() {
  const [search, setSearch] = useState("");
  const [domaine, setDomaine] = useState("");
  const [niveau, setNiveau] = useState("");
  const [format, setFormat] = useState("");

  const filtered = formations.filter((f) => {
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchDomaine = !domaine || domaine === "Domaine de formation" || f.tag === domaine;
    return matchSearch && matchDomaine;
  });

  return (
    <>
      {/* Search / filters */}
      <section className="bg-[#e8f3ec] py-10 sm:py-12">
        <Container>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
              Trouvez votre formation
            </span>
          </div>
          <h2 className="mb-1 text-[22px] font-extrabold text-[var(--sane-green)] md:text-[28px]">
            Recherchez la formation qui vous correspond
          </h2>
          <p className="mb-7 text-[13px] text-[var(--sane-text-light)]">
            Explorez nos formations et développez les compétences dont vous avez besoin.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} strokeWidth={2.2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
              <input
                type="text"
                placeholder="Mot-clé, formation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[48px] w-full rounded-lg border border-[var(--sane-border)] bg-white pl-10 pr-4 text-[13px] text-[var(--sane-text)] outline-none placeholder:text-[var(--sane-text-light)] focus:border-[var(--sane-green)]"
              />
            </div>
            {[
              { value: domaine, setter: setDomaine, options: domaines },
              { value: niveau, setter: setNiveau, options: niveaux },
              { value: format, setter: setFormat, options: formats },
            ].map(({ value, setter, options }) => (
              <div key={options[0]} className="relative flex-1 min-w-[140px]">
                <Search size={15} strokeWidth={2.2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
                <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="h-[48px] w-full appearance-none rounded-lg border border-[var(--sane-border)] bg-white pl-10 pr-9 text-[13px] text-[var(--sane-text-light)] outline-none focus:border-[var(--sane-green)]"
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <button className="h-[48px] shrink-0 rounded-xl bg-[var(--sane-orange)] px-8 text-[14px] font-bold text-white transition-colors hover:bg-[#CF6812]">
              Rechercher
            </button>
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="relative overflow-hidden bg-[var(--sane-background)] py-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 top-0 h-full w-[300px] opacity-[0.04]">
          <Image src="/formation-bg.png" alt="" fill className="object-cover object-right" sizes="300px" />
        </div>
        <Container className="relative z-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
                  Nos Formations
                </span>
              </div>
              <h2 className="text-[22px] font-extrabold text-[#0f5025] md:text-[28px]">
                Des formations pour tous les profils
              </h2>
            </div>
            <Link
              href="#"
              className="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#178040] hover:underline sm:flex"
            >
              Voir toutes les formations <ArrowRight size={14} />
            </Link>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((f) => (
                <div
                  key={f.title}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03] transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#eef4f0]">
                    <Image
                      src={f.img}
                      alt={f.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <span className={`absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-[3px] text-[10px] font-bold ${tagColors[f.tag] ?? "bg-gray-700 text-white"}`}>
                      {f.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-2.5 text-[14px] font-extrabold leading-snug text-[var(--sane-green)]">{f.title}</h3>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11.5px] text-[var(--sane-text-light)]">
                        <Clock size={12} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" /> {f.duree}
                      </div>
                      <div className="flex items-center gap-2 text-[11.5px] text-[var(--sane-text-light)]">
                        <Users size={12} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" /> {f.places}
                      </div>
                      <div className="flex items-center gap-2 text-[11.5px] text-[var(--sane-text-light)]">
                        <MapPin size={12} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" /> {f.lieu}
                      </div>
                    </div>
                    <div className="mt-auto pt-3">
                      <Link
                        href="#"
                        className="group/btn inline-flex items-center gap-2 rounded-lg border border-[var(--sane-green)] px-4 py-[7px] text-[12px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[#f0faf4]"
                      >
                        Voir la formation
                        <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-[13px] text-[var(--sane-text-light)]">
              Aucune formation trouvée pour cette recherche.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
