"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Search, ChevronDown, Building2 } from "lucide-react";
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
      <section className="bg-[#e8f3ec] py-10 sm:py-12">
        <Container>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
              Recherche d&apos;emploi
            </span>
          </div>
          <h2 className="mb-1 text-[22px] font-extrabold text-[var(--sane-green)] md:text-[28px]">
            Trouvez l&apos;offre qui vous correspond
          </h2>
          <p className="mb-7 text-[13px] text-[var(--sane-text-light)]">
            Recherchez parmi des centaines d&apos;offres d&apos;emploi publiées par nos partenaires.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap">
            <div className="relative min-w-[180px] flex-1">
              <Search size={15} strokeWidth={2.2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
              <input
                type="text"
                placeholder="Intitulé du poste, compétence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[48px] w-full rounded-lg border border-[var(--sane-border)] bg-white pl-10 pr-4 text-[13px] text-[var(--sane-text)] outline-none placeholder:text-[var(--sane-text-light)] focus:border-[var(--sane-green)]"
              />
            </div>
            {[
              { value: secteur, setter: setSecteur, options: secteurOptions },
              { value: lieu, setter: setLieu, options: lieuOptions },
              { value: contrat, setter: setContrat, options: contratOptions },
            ].map(({ value, setter, options }) => (
              <div key={options[0]} className="relative min-w-[140px] flex-1">
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

      {/* Job Listings + Sidebar */}
      <section className="bg-[var(--sane-background)] py-10 sm:py-14">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
                  Offres d&apos;emploi
                </span>
              </div>
              <h2 className="text-[22px] font-extrabold text-[#0f5025] md:text-[28px]">
                Offres récemment publiées
              </h2>
            </div>
            <Link
              href="#"
              className="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#178040] hover:underline sm:flex"
            >
              Voir toutes les offres <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Job List */}
            <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-black/[0.03]">
              {filtered.length > 0 ? (
                filtered.map((j, i) => (
                  <div key={i} className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5 sm:py-5 ${i > 0 ? "border-t border-[var(--sane-border)]" : ""}`}>
                    <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--sane-background)]">
                      <span className="text-center text-[13px] font-extrabold leading-tight" style={{ color: j.color }}>{j.company}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-extrabold text-[var(--sane-green)]">{j.title}</h3>
                      <p className="text-[12px] text-[var(--sane-text-light)]">{j.companyFull}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="flex items-center gap-1 text-[var(--sane-text-light)]">
                          <MapPin size={11} className="text-[var(--sane-orange)]" />{j.location}
                        </span>
                        <span className="rounded-full bg-[var(--sane-green)] px-2 py-0.5 text-[10px] font-semibold text-white">{j.contract}</span>
                        <span className="rounded-full border border-[var(--sane-border)] px-2 py-0.5 text-[10px] text-[var(--sane-text-light)]">{j.category}</span>
                        <span className="flex items-center gap-1 text-[var(--sane-text-light)]">
                          <Calendar size={11} className="text-[var(--sane-orange)]" />{j.date}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="#"
                      className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-[var(--sane-green)] px-4 py-[7px] text-[12px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[#f0faf4]"
                    >
                      Voir l&apos;offre <ArrowRight size={12} />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="py-12 text-center text-[13px] text-[var(--sane-text-light)]">
                  Aucune offre trouvée pour cette recherche.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Map card */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5 shadow-sm">
                <p className="mb-4 font-serif text-[15px] italic text-[#0f5025]">
                  Des opportunités<br />dans tout le Niger
                </p>
                <div className="flex flex-col gap-2">
                  {cities.map((city, i) => (
                    <div key={city} className="flex items-center gap-2 text-[13px] text-[var(--sane-text-light)]">
                      <MapPin size={13} className={i === 0 ? "text-[var(--sane-orange)]" : "text-[var(--sane-green)]"} />
                      <span className={i === 0 ? "font-semibold text-[var(--sane-text)]" : ""}>{city}</span>
                    </div>
                  ))}
                </div>
                <Link href="#" className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#178040] hover:underline">
                  Voir les offres par région <ArrowRight size={12} />
                </Link>
              </div>

              {/* Secteurs */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-[2px] w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[14px] font-extrabold text-[#0f5025]">Secteurs qui recrutent</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {sectors.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[var(--sane-orange)]" />
                        <span className="text-[var(--sane-text-light)]">{s.name}</span>
                      </div>
                      <span className="font-bold text-[var(--sane-text)]">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
