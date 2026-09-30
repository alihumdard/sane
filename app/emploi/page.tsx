"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, MapPin, Calendar, Search, Building2 } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const stats = [
  { icon: "💼", value: "+500", label: "Offres d'emploi" },
  { icon: "🏢", value: "+200", label: "Entreprises" },
  { icon: "👥", value: "+1000", label: "Postes à pourvoir" },
  { icon: "📊", value: "+15", label: "Secteurs d'activité" },
];

const jobs = [
  { company: "Enabel", companyFull: "Enabel Niger", title: "Chargé de Communication", location: "Niamey", contract: "CDI", category: "Communication", date: "12 Mars 2024", color: "#e30613" },
  { company: "giz", companyFull: "GIZ Niger", title: "Développeur Web", location: "Niamey", contract: "CDD", category: "Informatique", date: "10 Mars 2024", color: "#007f3e" },
  { company: "THE WORLD\nBANK", companyFull: "Banque Mondiale", title: "Spécialiste Suivi & Évaluation", location: "Niamey", contract: "CDI", category: "Gestion de projets", date: "08 Mars 2024", color: "#0066b2" },
  { company: "PNUD", companyFull: "PNUD Niger", title: "Assistant Administratif", location: "Niamey", contract: "CDD", category: "Administration", date: "05 Mars 2024", color: "#0068b8" },
  { company: "AFD", companyFull: "AFD Niger", title: "Expert en Formation", location: "Niamey", contract: "Consultant", category: "Formation", date: "02 Mars 2024", color: "#e63946" },
];

const cities = ["Niamey", "Zinder", "Maradi", "Agadez", "Diffa", "Tahoua"];

const sectors = [
  { name: "Administration & Gestion", count: 125 },
  { name: "Communication", count: 80 },
  { name: "Informatique & Digital", count: 95 },
  { name: "Éducation & Formation", count: 70 },
  { name: "Santé", count: 60 },
  { name: "Agriculture & Environnement", count: 55 },
  { name: "Projets & Développement", count: 110 },
  { name: "Autres secteurs", count: 45 },
];

const recruitingPartners = [
  { name: "République du Niger", abbr: "RN", color: "#0a4a22" },
  { name: "Organisation Internationale du Travail", abbr: "OIT", color: "#1a5276" },
  { name: "Enabel", abbr: "EN", color: "#e30613" },
  { name: "GIZ", abbr: "GIZ", color: "#007f3e" },
  { name: "AFD", abbr: "AFD", color: "#e63946" },
];

const steps = [
  { num: "01", title: "Créez votre profil", desc: "Inscrivez-vous et complétez votre profil.", iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { num: "02", title: "Recherchez des offres", desc: "Trouvez les opportunités selon vos compétences.", iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { num: "03", title: "Postulez en ligne", desc: "Envoyez votre candidature en quelques clics.", iconPath: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { num: "04", title: "Suivez votre candidature", desc: "Recevez des notifications et suivez l'état de votre dossier.", iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function EmploiPage() {
  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <section className="relative min-h-[400px] overflow-hidden bg-[#0a4a22]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/90 to-[#0a4a22]/30 z-10" />
          <div className="absolute right-0 top-0 h-full w-[55%]">
            <Image src="/sane_deal.png" alt="Emploi SANE" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/30 to-transparent" />
          </div>

          <div className="absolute right-5 top-10 z-20 hidden rounded-md bg-[#E57617] px-2.5 py-2 text-[9px] font-bold leading-snug text-white lg:block">
            EMPLOI<br />FORMATION<br />OPPORTUNITÉS<br />AVENIR
            <div className="mt-1 h-[2px] w-5 bg-white/60 rounded-full" />
          </div>
          <div className="absolute right-5 bottom-8 z-20 hidden text-right lg:block">
            <p className="font-serif text-[15px] italic leading-snug text-[#E57617]">Un Niger<br />de Talents</p>
          </div>

          <div className="sane-container relative z-20 flex min-h-[400px] flex-col justify-center py-12">
            <nav className="mb-4 flex items-center gap-1.5 text-[12px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={13} />
              <span className="text-white font-medium">Emploi</span>
            </nav>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">SALON NATIONAL DE L'EMPLOI</p>
            <div className="max-w-[480px]">
              <h1 className="mb-3 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                Trouvez une<br />opportunité d'emploi
              </h1>
              <p className="mb-6 text-[13px] leading-relaxed text-white/65 max-w-[400px]">
                Des offres d'emploi réelles pour les talents nigériens. Connectez-vous aux entreprises, institutions et organisations qui recrutent au Niger.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/programme" className="inline-flex items-center gap-2 rounded-full bg-[#E57617] px-5 py-2.5 text-[12px] font-semibold text-white transition-all hover:bg-[#c9600f]">
                  Voir le programme <ArrowRight size={14} />
                </Link>
                <Link href="#" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[12px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Créer mon profil <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 2. STATS BAR ═══════════════════ */}
        <section className="bg-white border-b border-[#DDE8E0]">
          <div className="sane-container">
            <div className="grid grid-cols-2 divide-x divide-[#DDE8E0] lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-7 px-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F9F6] text-xl">
                    {s.icon}
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-[#0a2e16]">{s.value}</span>
                    <span className="text-[12px] text-[#61756B]">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. SEARCH / FILTER ═══════════════════ */}
        <section className="bg-white border-b border-[#DDE8E0] py-6">
          <div className="sane-container">
            <div className="mb-1 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
              <span className="h-px w-6 bg-[#E57617]" />
              RECHERCHE D'EMPLOI
            </div>
            <h2 className="mb-1 text-xl font-bold text-[#0a2e16] lg:text-2xl">Trouvez l'offre qui vous correspond</h2>
            <p className="mb-4 text-[12px] text-[#61756B]">Recherchez parmi des centaines d'offres d'emploi publiées par nos partenaires.</p>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <input type="text" placeholder="Intitulé du poste, compétence..." className="w-full rounded-full border border-[#DDE8E0] bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none focus:border-[#10632D]" />
              </div>
              {["Secteur d'activité", "Lieu (Niamey, Zinder...)", "Type de contrat"].map((ph, i) => (
                <select key={i} className="hidden rounded-full border border-[#DDE8E0] bg-white px-4 py-2.5 text-[13px] text-[#61756B] outline-none focus:border-[#10632D] sm:block appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2361756B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10">
                  <option>{ph}</option>
                </select>
              ))}
              <button className="rounded-full bg-[#E57617] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#c9600f] whitespace-nowrap">
                Rechercher
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. JOB LISTINGS + SIDEBAR ═══════════════════ */}
        <section className="bg-white py-12">
          <div className="sane-container">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#0a2e16]">
                  <span className="h-px w-4 bg-[#E57617]" />
                  OFFRES D'EMPLOI RÉCEMMENT PUBLIÉES
                </div>
              </div>
              <Link href="#" className="hidden items-center gap-1.5 text-[13px] font-semibold text-[#10632D] hover:text-[#E57617] sm:flex">
                Voir toutes les offres <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              {/* LEFT — Job List */}
              <div className="flex flex-col">
                {jobs.map((j, i) => (
                  <div key={i} className={`flex items-center gap-5 py-5 ${i > 0 ? "border-t border-[#DDE8E0]" : ""}`}>
                    {/* Company logo */}
                    <div className="flex h-16 w-20 shrink-0 items-center justify-center">
                      <span className="text-[14px] font-extrabold leading-tight text-center whitespace-pre-line" style={{ color: j.color }}>{j.company}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-[14px] font-bold text-[#0a2e16]">{j.title}</h3>
                      <p className="text-[12px] text-[#61756B]">{j.companyFull}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-[#61756B]">
                          <MapPin size={11} className="text-[#E57617]" />{j.location}
                        </span>
                        <span className="rounded-full bg-[#0a2e16] px-2 py-0.5 text-[10px] font-semibold text-white">{j.contract}</span>
                        <span className="rounded-full border border-[#DDE8E0] px-2 py-0.5 text-[10px] text-[#61756B]">{j.category}</span>
                        <span className="flex items-center gap-1 text-[#61756B]">
                          <Calendar size={11} className="text-[#E57617]" />{j.date}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href="#" className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#10632D] px-4 py-2 text-[12px] font-semibold text-[#10632D] transition-all hover:bg-[#10632D] hover:text-white sm:flex">
                      Voir l'offre <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>

              {/* RIGHT — Sidebar */}
              <div className="flex flex-col gap-8">
                {/* Map card */}
                <div className="rounded-xl border border-[#DDE8E0] bg-[#F5F9F6] p-5">
                  <p className="mb-4 font-serif text-[15px] italic text-[#0a2e16]">
                    Des opportunités<br />dans tout le Niger
                  </p>
                  <div className="flex flex-col gap-2">
                    {cities.map((city, i) => (
                      <div key={i} className="flex items-center gap-2 text-[13px] text-[#61756B]">
                        <MapPin size={13} className={i === 0 ? "text-[#E57617]" : "text-[#10632D]"} />
                        <span className={i === 0 ? "font-semibold text-[#0a2e16]" : ""}>{city}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="#" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#DDE8E0] px-4 py-2 text-[12px] font-semibold text-[#0a2e16] hover:border-[#10632D] hover:text-[#10632D]">
                    Voir les offres par région <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Secteurs qui recrutent */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[14px] font-bold text-[#0a2e16]">Secteurs qui recrutent</h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {sectors.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-2">
                          <Building2 size={13} className="text-[#E57617]" />
                          <span className="text-[#61756B]">{s.name}</span>
                        </div>
                        <span className="font-bold text-[#0a2e16]">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 5. PARTNER LOGOS ═══════════════════ */}
        <section className="bg-[#F5F9F6] py-10">
          <div className="sane-container">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#0a2e16]">
              <span className="h-px w-4 bg-[#E57617]" />
              NOS PARTENAIRES QUI RECRUTENT
            </div>
            <h2 className="mb-6 text-xl font-bold text-[#0a2e16] lg:text-2xl">Ils nous font confiance</h2>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {recruitingPartners.map((p, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#DDE8E0] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md">
                  <span className="text-[18px] font-extrabold" style={{ color: p.color }}>{p.abbr}</span>
                  <span className="text-center text-[11px] text-[#61756B] leading-tight">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 6. COMMENT POSTULER (4 STEPS) ═══════════════════ */}
        <section className="bg-white py-14">
          <div className="sane-container">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
              <span className="h-px w-6 bg-[#E57617]" />
              COMMENT POSTULER ?
            </div>
            <h2 className="mb-10 text-2xl font-bold text-[#0a2e16] lg:text-3xl">Un processus simple en 4 étapes</h2>

            <div className="flex items-start justify-between">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start">
                  {/* Step */}
                  <div className="flex w-[180px] flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E57617] text-white">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={step.iconPath} />
                        </svg>
                      </div>
                      <span className="absolute -top-1 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#10632D] text-[11px] font-bold text-white shadow-sm">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="mb-1 text-[14px] font-bold text-[#0a2e16]">{step.title}</h3>
                    <p className="text-[12px] leading-relaxed text-[#61756B]">{step.desc}</p>
                  </div>

                  {/* Arrow between steps */}
                  {i < 3 && (
                    <div className="mt-7 flex items-center px-2 text-[#E57617]">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 7. CTA ═══════════════════ */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
