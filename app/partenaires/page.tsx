"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const stats = [
  { value: "+50", label: "Partenaires" },
  { value: "+20", label: "Institutions publiques" },
  { value: "+25", label: "Entreprises privées" },
  { value: "+10", label: "Organisations internationales" },
];

const partners = [
  { name: "République du Niger", abbr: "RN", color: "#0a4a22" },
  { name: "OIT", abbr: "OIT", color: "#1a5276" },
  { name: "Banque Mondiale", abbr: "BM", color: "#0066cc" },
  { name: "AFD", abbr: "AFD", color: "#e63946" },
  { name: "UNESCO", abbr: "UN", color: "#005c8a" },
  { name: "PNUD", abbr: "PNUD", color: "#0068b8" },
  { name: "USAID", abbr: "US", color: "#002868" },
  { name: "GIZ", abbr: "GIZ", color: "#007f3e" },
  { name: "Enabel", abbr: "EN", color: "#e30613" },
  { name: "The World Bank", abbr: "WB", color: "#0066b2" },
  { name: "Orange", abbr: "OR", color: "#ff6600" },
  { name: "TotalEnergies", abbr: "TE", color: "#e4022a" },
  { name: "Moov Africa", abbr: "MA", color: "#00a0dc" },
  { name: "Ecobank", abbr: "EB", color: "#005a30" },
  { name: "OFANO", abbr: "OF", color: "#10632D" },
];

const partnerTypes = [
  {
    icon: "🏛️",
    title: "Institutions publiques",
    description: "",
    items: ["Ministères et agences nationales", "Collectivités locales", "Programmes gouvernementaux"],
    color: "#10632D",
  },
  {
    icon: "🏢",
    title: "Entreprises privées",
    description: "",
    items: ["Grandes entreprises", "PME et startups", "Secteurs stratégiques", "Recrutement et insertion"],
    color: "#E57617",
  },
  {
    icon: "🌍",
    title: "Organisations internationales",
    description: "",
    items: ["Coopération au développement", "Programmes d'emploi et formation", "Appui technique et financier", "Partage d'expertise"],
    color: "#10632D",
  },
  {
    icon: "🤝",
    title: "Société civile & Associations",
    description: "",
    items: ["ONG et réseaux professionnels", "Appui aux jeunes et aux femmes", "Inclusion sociale", "Initiatives locales"],
    color: "#E57617",
  },
];

const impactStats = [
  { value: "+1 000", label: "Opportunités créées" },
  { value: "+20", label: "Programmes conjoints" },
  { value: "+30", label: "Projets financés" },
  { value: "+100", label: "Experts mobilisés" },
];

const testimonials = [
  {
    quote: "Le SANE est un partenaire clé dans la promotion de l'emploi des jeunes au Niger. Cette initiative crée un véritable pont entre les talents et les opportunités.",
    name: "M. Harouna Moussa",
    role: "Ministère de l'Emploi",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    orgIcon: "🇳🇪",
  },
  {
    quote: "Notre collaboration avec le SANE nous permet de renforcer nos actions de formation et d'insertion professionnelle des jeunes, en particulier des femmes.",
    name: "Mme Aissatou Diallo",
    role: "PNUD Niger",
    photo: "https://randomuser.me/api/portraits/women/29.jpg",
    orgIcon: "🌐",
  },
  {
    quote: "Le SANE incarne une vision ambitieuse pour l'avenir du Niger. Nous sommes fiers de soutenir cette plateforme qui favorise le dialogue entre les acteurs de l'emploi.",
    name: "M. Pierre Dubois",
    role: "AFD Niger",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",
    orgIcon: "🏦",
  },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function PartenairesPage() {
  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <section className="relative min-h-[520px] overflow-hidden bg-[#0a4a22]">
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/95 to-[#0a4a22]/40 z-10" />

          {/* right image */}
          <div className="absolute right-0 top-0 h-full w-1/2">
            <Image
              src="/Partenaires.png"
              alt="Partenaires SANE"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/40 to-transparent" />
          </div>

          {/* content */}
          <div className="sane-container relative z-20 flex min-h-[520px] flex-col justify-center py-16">
            {/* breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-[13px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-white">Partenaires</span>
            </nav>

            <div className="max-w-[600px]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[13px] text-white/80 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E57617]" />
                Réseau de partenaires
              </div>

              <h1 className="mb-5 text-4xl font-bold leading-tight text-white lg:text-5xl">
                Nos <span className="text-[#E57617]">Partenaires</span>
              </h1>

              <p className="mb-8 text-[15px] leading-relaxed text-white/75 max-w-[500px]">
                Le SANE réunit institutions publiques, entreprises privées, organisations internationales et société civile autour d'un objectif commun : promouvoir l'emploi au Niger.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#devenir-partenaire"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E57617] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#c9600f] hover:-translate-y-0.5"
                >
                  Devenir partenaire
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="#partenaires"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
                >
                  Voir tous les partenaires
                </Link>
              </div>

              {/* floating card */}
              <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E57617]/20">
                  <span className="text-xl">🤝</span>
                </div>
                <div>
                  <p className="text-[12px] text-white/60">Notre réseau</p>
                  <p className="text-[14px] font-semibold text-white">+50 partenaires actifs</p>
                </div>
              </div>

              <p className="mt-5 text-[13px] italic text-white/50">
                "Ensemble pour l'emploi de demain"
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 2. STATS BAR ═══════════════════ */}
        <section className="bg-white border-b border-[#DDE8E0]">
          <div className="sane-container">
            <div className="grid grid-cols-2 divide-x divide-[#DDE8E0] lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-1 py-8 px-4 text-center">
                  <span className="text-3xl font-bold text-[#10632D] lg:text-4xl">{s.value}</span>
                  <span className="text-[13px] text-[#61756B]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. LOGOS GRID ═══════════════════ */}
        <section id="partenaires" className="bg-white py-16">
          <div className="sane-container">
            {/* header row */}
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              {/* left */}
              <div className="max-w-[440px]">
                <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#10632D]">
                  <span className="h-px w-6 bg-[#10632D]" />
                  NOS PARTENAIRES
                </div>
                <h2 className="mb-4 text-3xl font-bold text-[#0a2e16] lg:text-4xl">
                  Ils nous font confiance
                </h2>
                <p className="text-[14px] leading-relaxed text-[#61756B]">
                  Le SANE remercie l'ensemble de ses partenaires pour leur engagement à soutenir l'emploi, la formation et le développement des compétences au Niger.
                </p>
              </div>

              {/* right */}
              <div className="flex flex-col items-end gap-3 sm:items-end">
                <Link
                  href="#devenir-partenaire"
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#10632D] transition-colors hover:text-[#E57617]"
                >
                  Devenir partenaire
                  <ArrowRight size={15} />
                </Link>
                <p className="max-w-[180px] text-right text-[13px] italic leading-snug text-[#61756B]">
                  Des partenariats pour un Niger plus fort
                </p>
              </div>
            </div>

            {/* logos grid — tight, no gaps */}
            <div className="border border-[#DDE8E0] grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 [&>*]:border-r [&>*]:border-b [&>*]:border-[#DDE8E0]">
              {partners.map((p, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center justify-center gap-3 bg-white p-6 transition-all hover:bg-[#F5F9F6]"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-white text-[13px] font-bold shadow-sm"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.abbr}
                  </div>
                  <span className="text-center text-[12px] font-medium text-[#0a2e16] leading-tight">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. TYPES DE PARTENAIRES ═══════════════════ */}
        <section className="bg-white py-16">
          <div className="sane-container">
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
                <span className="h-px w-6 bg-[#E57617]" />
                NOS TYPES DE PARTENAIRES
              </div>
              <h2 className="text-3xl font-bold text-[#0a2e16] lg:text-4xl">
                Des collaborations au service de l'emploi
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {partnerTypes.map((pt, i) => (
                <div key={i} className="group flex flex-col rounded-2xl border border-[#DDE8E0] bg-[#F5F9F6] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                  {/* icon square */}
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: pt.color }}
                  >
                    <span className="text-xl">{pt.icon}</span>
                  </div>

                  <h3 className="mb-4 text-[15px] font-bold text-[#0a2e16]">{pt.title}</h3>

                  <ul className="flex flex-col gap-2.5 flex-1">
                    {pt.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-[13px] text-[#61756B]">
                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10632D]" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* arrow button */}
                  <div className="mt-6 flex justify-end">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#10632D] text-[#10632D] transition-all group-hover:bg-[#10632D] group-hover:text-white">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 5. IMPACT SECTION ═══════════════════ */}
        <section className="bg-[#0f3d1a] py-14">
          <div className="sane-container">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
              {/* left text */}
              <div className="lg:max-w-[340px] lg:shrink-0">
                <h2 className="mb-4 text-2xl font-bold leading-snug text-white lg:text-3xl">
                  L'impact de nos partenaires
                </h2>
                <p className="mb-7 text-[14px] leading-relaxed text-white/65">
                  Grâce à nos partenaires, nous multiplions les opportunités et contribuons à un écosystème de l'emploi plus inclusif et durable au Niger.
                </p>
                <Link
                  href="#devenir-partenaire"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E57617] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#c9600f] hover:-translate-y-0.5"
                >
                  Rejoindre nos partenaires
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* right stats — horizontal row */}
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:flex-1">
                {[
                  { icon: "🏗️", value: "+1000", label: "Opportunités créées" },
                  { icon: "👥", value: "+20",   label: "Programmes soutenus" },
                  { icon: "📋", value: "+30",   label: "Projets réalisés" },
                  { icon: "🌐", value: "+100",  label: "Experts mobilisés" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center">
                    {/* white line icon placeholder */}
                    <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-xl">
                      {s.icon}
                    </div>
                    <span className="text-3xl font-bold text-white lg:text-4xl">{s.value}</span>
                    <span className="text-[13px] text-white/60">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 6. TÉMOIGNAGES ═══════════════════ */}
        <section className="bg-[#F5F9F6] py-16">
          <div className="sane-container">
            {/* header row */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <div className="mb-2 h-0.5 w-8 bg-[#E57617]" />
                <h2 className="text-2xl font-bold text-[#0a2e16] lg:text-3xl">
                  Témoignages de nos partenaires
                </h2>
              </div>
              <Link
                href="#"
                className="hidden items-center gap-1.5 text-[14px] font-semibold text-[#10632D] transition-colors hover:text-[#E57617] sm:flex"
              >
                Voir tous les témoignages
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-[#DDE8E0] bg-white overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  {/* top: photo + quote side by side */}
                  <div className="flex gap-4 p-5">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={t.photo}
                        alt={t.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="text-[13px] leading-relaxed text-[#61756B] italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  {/* bottom: org logo + name + role */}
                  <div className="mt-auto flex items-center gap-3 border-t border-[#DDE8E0] px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] text-lg">
                      {t.orgIcon}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0a2e16]">{t.name}</p>
                      <p className="text-[12px] text-[#61756B]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 7. CTA BANNER ═══════════════════ */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
