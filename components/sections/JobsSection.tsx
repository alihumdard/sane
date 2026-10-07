"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Select } from "@/components/ui/Select";

const jobs = [
  {
    title: "Responsable Commercial",
    company: "Entreprise ABC",
    location: "Niamey",
    type: "CDI",
    typeColor: "bg-[var(--sane-orange)]/10 text-[var(--sane-orange)]",
  },
  {
    title: "Développeur Web",
    company: "Tech Solutions",
    location: "Niamey",
    type: "CDD",
    typeColor: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  },
  {
    title: "Chargé de Communication",
    company: "ONG Internationale",
    location: "Niamey",
    type: "CDD",
    typeColor: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  },
  {
    title: "Assistant Administratif",
    company: "Société de Services",
    location: "Niamey",
    type: "Stage",
    typeColor: "bg-[#FFF7ED] text-[#B45309]",
  },
];

const sectorOptions = [
  { value: "technologie", label: "Technologie" },
  { value: "commerce", label: "Commerce" },
  { value: "communication", label: "Communication" },
  { value: "administration", label: "Administration" },
];

const locationOptions = [
  { value: "niamey", label: "Niamey" },
  { value: "maradi", label: "Maradi" },
  { value: "zinder", label: "Zinder" },
  { value: "tahoua", label: "Tahoua" },
];

export function JobsSection() {
  return (
    <section className="bg-[var(--sane-background)] py-14 md:py-16">
      <Container>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[3px] w-6 rounded-full bg-[var(--sane-orange)]" />
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--sane-green)]">
                Offres d&apos;emploi
              </span>
            </div>

            <h2 className="sane-h2">
              Trouvez une opportunité
            </h2>
          </div>

          <Link
            href="/emploi"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--sane-green)]"
          >
            Voir toutes les offres
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
          <div className="flex h-12 items-center gap-3 rounded-lg border border-[var(--sane-border)] bg-white px-4 sm:col-span-2 lg:col-span-1">
            <Search size={17} className="shrink-0 text-[#71857A]" />
            <input
              type="text"
              placeholder="Intitulé du poste, compétence..."
              className="w-full bg-transparent text-sm text-[var(--sane-text)] outline-none placeholder:text-[#8A9A91]"
            />
          </div>

          <Select
            options={sectorOptions}
            placeholder="Secteur"
            icon={BriefcaseBusiness}
          />

          <Select
            options={locationOptions}
            placeholder="Localisation"
            icon={MapPin}
          />

          <button
            type="button"
            className="h-12 w-full rounded-lg bg-[var(--sane-orange)] px-7 text-sm font-bold text-white transition hover:bg-[var(--sane-orange-dark)] sm:col-span-2 lg:col-span-1 lg:w-auto"
          >
            Rechercher
          </button>
        </div>

        {/* JOBS */}
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-[var(--sane-text)]">
            Offres récemment publiées
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {jobs.map((job) => (
              <article
                key={job.title}
                className="rounded-xl border border-[var(--sane-border)] bg-white p-5 shadow-[0_5px_20px_rgba(16,99,45,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(16,99,45,0.09)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4ED] text-[var(--sane-green)]">
                  <BriefcaseBusiness size={19} />
                </div>

                <h3 className="sane-h3 mt-4">
                  {job.title}
                </h3>

                <p className="mt-1 text-xs text-[#718178]">
                  {job.company}
                </p>

                <div className="mt-3 flex items-center justify-between gap-1.5 text-xs text-[#718178]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[var(--sane-orange)]" />
                    {job.location}
                  </div>

                  <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${job.typeColor}`}>
                    {job.type}
                  </span>
                </div>

                <Link
                  href="/emploi"
                  className="group mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--sane-green)]/30 px-3.5 py-2 text-xs font-bold text-[var(--sane-green)] transition hover:border-[var(--sane-green)] hover:bg-[var(--sane-green)] hover:!text-white"
                >
                  <span className="group-hover:!text-white">Voir l&apos;offre</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1 group-hover:!text-white"
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>

      </Container>
    </section>
  );
}
