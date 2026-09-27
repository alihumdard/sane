import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const jobs = [
  {
    title: "Responsable Commercial",
    company: "Entreprise ABC",
    location: "Niamey",
    type: "CDI",
  },
  {
    title: "Développeur Web",
    company: "Tech Solutions",
    location: "Niamey",
    type: "CDD",
  },
  {
    title: "Chargé de Communication",
    company: "ONG Internationale",
    location: "Niamey",
    type: "CDD",
  },
  {
    title: "Assistant Administratif",
    company: "Société de Services",
    location: "Niamey",
    type: "Stage",
  },
];

export function JobsSection() {
  return (
    <section className="bg-[#F3F8F4] py-14 md:py-16">
      <Container>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[3px] w-6 rounded-full bg-[#E57617]" />

              <span className="text-xs font-bold uppercase tracking-wide text-[#10632D]">
                Offres d&apos;emploi
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-[#10632D] md:text-4xl">
              Trouvez une opportunité
            </h2>
          </div>

          <Link
            href="/emploi"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#10632D]"
          >
            Voir toutes les offres

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mt-7 grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">

          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#D5E3D9] bg-white px-4">
            <Search size={17} className="text-[#71857A]" />

            <input
              type="text"
              placeholder="Intitulé du poste, compétence..."
              className="w-full bg-transparent text-sm text-[#17352A] outline-none placeholder:text-[#8A9A91]"
            />
          </div>

          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#D5E3D9] bg-white px-4">
            <BriefcaseBusiness size={17} className="text-[#71857A]" />

            <select className="w-full bg-transparent text-sm text-[#61756B] outline-none">
              <option>Secteur</option>
              <option>Technologie</option>
              <option>Commerce</option>
              <option>Communication</option>
              <option>Administration</option>
            </select>
          </div>

          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#D5E3D9] bg-white px-4">
            <MapPin size={17} className="text-[#71857A]" />

            <select className="w-full bg-transparent text-sm text-[#61756B] outline-none">
              <option>Localisation</option>
              <option>Niamey</option>
              <option>Maradi</option>
              <option>Zinder</option>
              <option>Tahoua</option>
            </select>
          </div>

          <button
            type="button"
            className="h-12 rounded-lg bg-[#E57617] px-7 text-sm font-bold text-white transition hover:bg-[#CF6812]"
          >
            Rechercher
          </button>
        </div>

        {/* JOBS */}
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-[#17352A]">
            Offres récemment publiées
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {jobs.map((job) => (
              <article
                key={job.title}
                className="rounded-xl border border-[#DCE8DF] bg-white p-5 shadow-[0_5px_20px_rgba(16,99,45,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(16,99,45,0.09)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4ED] text-[#10632D]">
                    <BriefcaseBusiness size={19} />
                  </div>
                </div>

                <h3 className="mt-5 text-base font-extrabold text-[#17352A]">
                  {job.title}
                </h3>

                <p className="mt-1 text-xs text-[#718178]">
                  {job.company}
                </p>

                <div className="mt-4 flex items-center justify-between gap-1.5 text-xs text-[#718178]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#E57617]" />
                    {job.location}
                  </div>

                  <span className="rounded-md bg-[#EEF6F0] px-2.5 py-1 text-[10px] font-bold text-[#10632D]">
                    {job.type}
                  </span>
                </div>

                <Link
                  href="/emploi"
                  className="group mt-5 inline-flex items-center gap-2 rounded-md border border-[#10632D] px-3 py-2 text-xs font-bold text-[#10632D] transition hover:bg-[#10632D] hover:!text-white"
                >
                  <span className="text-[#10632D] group-hover:!text-white">Voir l&apos;offre</span>

                  <ArrowRight
                    size={14}
                    className="text-[#10632D] transition-transform group-hover:translate-x-1 group-hover:!text-white"
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