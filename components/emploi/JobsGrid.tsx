"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Search, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { jobs, cities, sectors, secteurOptions, lieuOptions, contratOptions } from "./data";

export function JobsGrid() {
  const [search, setSearch] = useState("");
  const [secteur, setSecteur] = useState("");
  const [lieu, setLieu] = useState("");
  const [contrat, setContrat] = useState("");

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
    const matchSecteur = !secteur || secteur === "Secteur d'activité" || j.category === secteur;
    const matchLieu = !lieu || lieu === "Lieu" || j.location === lieu;
    const matchContrat = !contrat || contrat === "Type de contrat" || j.contract === contrat;
    return matchSearch && matchSecteur && matchLieu && matchContrat;
  });

  return (
    <>
      {/* Search / filters */}
      <section className="bg-[var(--sane-green-light)] py-8 sm:py-10 md:py-12">
        <Container>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
              Recherche d&apos;emploi
            </span>
          </div>
          <h2 className="sane-h2 mb-1.5">
            Trouvez l&apos;offre qui vous correspond
          </h2>
          <p className="sane-body mb-6">
            Recherchez parmi des centaines d&apos;offres d&apos;emploi publiées par nos partenaires.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap">
            <div className="relative min-w-[180px] flex-1">
              <Search size={16} strokeWidth={2.2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
              <input
                type="text"
                placeholder="Intitulé du poste, compétence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[52px] w-full rounded-xl bg-white pl-11 pr-4 text-[14px] text-[var(--sane-text)] shadow-sm outline-none ring-1 ring-black/[0.04] transition-shadow placeholder:text-[var(--sane-text-light)] focus:ring-2 focus:ring-[var(--sane-green)]"
              />
            </div>
            {[
              { value: secteur, setter: setSecteur, options: secteurOptions },
              { value: lieu, setter: setLieu, options: lieuOptions },
              { value: contrat, setter: setContrat, options: contratOptions },
            ].map(({ value, setter, options }) => (
              <div key={options[0]} className="relative min-w-[150px] flex-1">
                <Search size={16} strokeWidth={2.2} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
                <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="h-[52px] w-full appearance-none rounded-xl bg-white pl-11 pr-10 text-[14px] text-[var(--sane-text-light)] shadow-sm outline-none ring-1 ring-black/[0.04] transition-shadow focus:ring-2 focus:ring-[var(--sane-green)]"
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <button className="h-[52px] w-full shrink-0 rounded-xl bg-[var(--sane-orange)] px-9 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-[var(--sane-orange-dark)] sm:w-auto">
              Rechercher
            </button>
          </div>
        </Container>
      </section>

      {/* Job Listings + Sidebar */}
      <section className="bg-[var(--sane-background)] pb-8 pt-10 sm:pb-10 sm:pt-12 md:pb-12 md:pt-16">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8 sm:gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
                  Offres d&apos;emploi
                </span>
              </div>
              <h2 className="sane-h2">
                Offres récemment publiées
              </h2>
            </div>
            <Link
              href="#"
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold text-[#178040] hover:underline sm:text-[14px]"
            >
              Voir toutes les offres <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[1fr_265px] xl:grid-cols-[1fr_280px]">
            {/* Job List */}
            <div className="flex flex-col gap-2.5">
              {filtered.length > 0 ? (
                filtered.map((j, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2.5 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:py-3.5 sm:pl-4 sm:pr-4"
                  >
                    <div className="flex h-[44px] w-[76px] shrink-0 items-center justify-start overflow-hidden sm:justify-center sm:border-r sm:border-[var(--sane-border)] sm:pr-4">
                      <span
                        className="max-w-full text-center text-[13px] font-extrabold leading-tight tracking-tight"
                        style={{ color: j.color }}
                      >
                        {j.company}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="sane-h3">{j.title}</h3>
                      <p className="sane-body mt-[3px]">{j.companyFull}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px]">
                        <span className="flex shrink-0 items-center gap-1 text-[var(--sane-text-light)] sm:w-[76px]">
                          <MapPin size={13} className="shrink-0 text-[var(--sane-orange)]" />{j.location}
                        </span>
                        <span className="shrink-0 rounded-full bg-[var(--sane-orange-light)] px-2 py-[3px] text-center text-[11px] font-bold text-[var(--sane-orange)] sm:w-[66px]">
                          {j.contract}
                        </span>
                        <span className="shrink-0 truncate rounded-full bg-[#eef4f1] px-2.5 py-[3px] text-center text-[11px] font-medium text-[var(--sane-text-light)] sm:w-[138px]">
                          {j.category}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 text-[var(--sane-text-light)] sm:ml-24">
                          <Calendar size={13} className="shrink-0 text-[var(--sane-orange)]" />{j.date}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="#"
                      className="group inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[var(--sane-green)] px-4 py-2 text-[13px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)] sm:w-fit"
                    >
                      Voir l&apos;offre
                      <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="sane-body rounded-xl bg-white py-12 text-center shadow-sm ring-1 ring-black/[0.04]">
                  Aucune offre trouvée pour cette recherche.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-3">
              {/* Map card */}
              <div className="relative overflow-hidden rounded-xl border border-[var(--sane-border)] bg-[#f7fbf9] p-4 shadow-sm">
                {/* Niger map — right side, natural proportions */}
                <svg
                  viewBox="0 0 200 140"
                  preserveAspectRatio="xMidYMid meet"
                  className="pointer-events-none absolute right-0 top-3 h-auto w-[62%]"
                  aria-hidden
                >
                  <path
                    d="M8 92 L14 62 L30 50 L34 34 L58 30 L74 20 L96 16 L118 10 L140 14 L152 26 L168 30 L186 44 L192 62 L178 76 L172 96 L156 104 L140 100 L120 108 L104 122 L84 126 L66 118 L50 120 L34 112 L18 106 Z"
                    className="fill-[var(--sane-green)]/[0.17]"
                  />
                  <g transform="translate(100, 68)">
                    <path
                      d="M0 16 C0 16 -9 5 -9 -2 A9 9 0 1 1 9 -2 C9 5 0 16 0 16 Z"
                      className="fill-[var(--sane-orange)]"
                    />
                    <circle cx="0" cy="-2" r="3.2" className="fill-white" />
                  </g>
                </svg>

                <div className="relative">
                  <p className="font-[family-name:var(--font-caveat)] text-[19px] font-bold leading-[1.15] text-[var(--sane-green-dark)]">
                    Des opportunités<br />dans tout le Niger
                  </p>
                  <div className="mt-1 h-[2px] w-11 rounded-full bg-[var(--sane-orange)]" />
                </div>

                <div className="relative mt-3.5 flex w-fit flex-col gap-0.5">
                  {cities.map((city, i) => (
                    <div
                      key={city}
                      className={`flex items-center gap-1.5 rounded-full py-[3px] pl-1.5 pr-2.5 text-[12px] ${
                        i === 0 ? "w-fit bg-[var(--sane-orange-light)]" : ""
                      }`}
                    >
                      <MapPin size={12} className="shrink-0 text-[var(--sane-orange)]" />
                      <span className={i === 0 ? "font-bold text-[var(--sane-green)]" : "text-[var(--sane-text-light)]"}>
                        {city}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="#"
                  className="group relative mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--sane-green)] bg-white/80 px-3.5 py-[7px] text-[11px] font-bold text-[var(--sane-green)] backdrop-blur-sm transition-colors hover:bg-[var(--sane-green-light)]"
                >
                  Voir les offres par région
                  <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Secteurs */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4 shadow-sm">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="h-[2px] w-4 bg-[var(--sane-orange)]" />
                  <h3 className="sane-h3">Secteurs qui recrutent</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {sectors.map((s) => {
                    const SectorIcon = s.icon;
                    return (
                      <div key={s.name} className="flex items-center gap-2.5 text-[12px]">
                        <SectorIcon size={15} strokeWidth={1.9} className="shrink-0 text-[var(--sane-green)]" />
                        <span className="min-w-0 flex-1 truncate text-[var(--sane-text-light)]">{s.name}</span>
                        <span className="shrink-0 rounded-md bg-[#f1f5f3] px-2 py-[3px] text-[11px] font-bold text-[var(--sane-text)]">
                          {s.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
