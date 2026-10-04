"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, Calendar, MapPin, Search, Play, Mail } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const categoryTabs = [
  { key: "tous", title: "Tous", subtitle: "Les actualités", iconPath: "M4 4h16v12H4zm0 12l4-4 2 2 4-4 6 6" },
  { key: "evenements", title: "Événements", subtitle: "Conférences et rencontres", iconPath: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { key: "communiques", title: "Communiqués", subtitle: "Annonces officielles", iconPath: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
  { key: "partenariats", title: "Partenariats", subtitle: "Collaborations", iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { key: "formations", title: "Formations", subtitle: "Programmes et sessions", iconPath: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3l4 2 4-2" },
  { key: "temoignages", title: "Témoignages", subtitle: "Parcours inspirants", iconPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
];

const articles = [
  {
    image: "/sane_deal.png",
    date: "12 Mars 2024",
    tag: "Événement",
    tagColor: "#E57617",
    title: "Lancement officiel du SANE 2024 à Niamey",
    description: "Le Ministère de l'Emploi annonce la tenue de la prochaine édition du Salon National de l'Emploi au Palais des Congrès de Niamey.",
  },
  {
    image: "/Transformation.png",
    date: "08 Mars 2024",
    tag: "Formation",
    tagColor: "#10632D",
    title: "Le SANE 2024 : un carrefour d'opportunités pour les jeunes",
    description: "Découvrez les objectifs, les temps forts et les innovations de cette nouvelle édition qui réunit entreprises, institutions et chercheurs d'emploi.",
  },
  {
    image: "/sane_company.png",
    date: "05 Mars 2024",
    tag: "Partenariat",
    tagColor: "#E57617",
    title: "Le SANE renforce ses partenariats internationaux",
    description: "De nouvelles collaborations pour soutenir l'emploi, la formation et l'insertion professionnelle des jeunes nigériens.",
  },
  {
    image: "/Leadership.png",
    date: "28 Février 2024",
    tag: "Témoignage",
    tagColor: "#10632D",
    title: "Ils ont trouvé leur opportunité grâce au SANE",
    description: "Découvrez les témoignages inspirants des jeunes qui ont pu bénéficier d'opportunités d'emploi et de formation.",
  },
  {
    image: "/Entrepreneuriat.png",
    date: "20 Février 2024",
    tag: "Formation",
    tagColor: "#E57617",
    title: "Des formations adaptées aux besoins du marché",
    description: "Le SANE met l'accent sur des formations pratiques et certifiantes pour renforcer l'employabilité des jeunes.",
  },
  {
    image: "/Actualités.png",
    date: "15 Février 2024",
    tag: "Communiqué",
    tagColor: "#0a4a22",
    title: "Communiqué officiel du SANE",
    description: "Retrouvez les dernières annonces et informations importantes concernant l'organisation de l'événement.",
  },
];

const popularArticles = [
  { title: "Lancement officiel du SANE 2024 à Niamey", date: "12 Mars 2024", image: "/sane_deal.png" },
  { title: "Des formations pour les jeunes nigériens", date: "05 Mars 2024", image: "/Transformation.png" },
  { title: "Le SANE renforce ses partenariats", date: "28 Février 2024", image: "/sane_company.png" },
  { title: "Témoignages de participants", date: "20 Février 2024", image: "/Leadership.png" },
];

const upcomingEvents = [
  { title: "Conférence sur l'emploi des jeunes", date: "10 Avril 2024", location: "Niamey, Niger" },
  { title: "Atelier de formation digitale", date: "15 Avril 2024", location: "Niamey, Niger" },
  { title: "Rencontres B2B entreprises - talents", date: "20 Avril 2024", location: "Niamey, Niger" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function ActualitesPage() {
  const [activeTab, setActiveTab] = useState("tous");

  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 280 }}>
          <Image
            src="/actualites-hero.png"
            alt="Actualités SANE"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Mobile: strong left overlay so text readable */}
          <div className="absolute inset-0 z-10 lg:hidden" style={{ background: "linear-gradient(to right, rgba(232,243,236,0.98) 0%, rgba(232,243,236,0.95) 55%, rgba(232,243,236,0.6) 80%, rgba(232,243,236,0) 100%)" }} />
          {/* Desktop: subtle left fade */}
          <div className="absolute inset-0 z-10 hidden lg:block" style={{ background: "linear-gradient(to right, rgba(232,243,236,0.97) 0%, rgba(232,243,236,0.92) 25%, rgba(232,243,236,0.65) 42%, rgba(232,243,236,0.2) 55%, rgba(232,243,236,0) 68%)" }} />

          {/* White info card — desktop only */}
          <div className="absolute right-16 top-4 z-20 hidden rounded-2xl bg-white px-4 py-3.5 shadow-lg lg:block">
            <p className="text-[10px] font-bold uppercase leading-[1.9] tracking-wide text-[#1a3a2a]">
              EMPLOI<br />FORMATION<br />OPPORTUNITÉS<br />AVENIR
            </p>
            <div className="mt-2 h-[2.5px] w-7 rounded-full bg-[#E57617]" />
          </div>
          {/* Handwritten tagline — desktop only */}
          <div className="absolute right-16 top-[148px] z-20 hidden text-center lg:block">
            <p className="font-[family-name:var(--font-caveat)] text-[24px] font-semibold italic leading-[1.15] text-[#0f5025]">
              Une information<br />pour un Niger<br />plus fort
            </p>
            <div className="mx-auto mt-2 h-[2.5px] w-10 rounded-full bg-[#E57617]" />
          </div>

          <div className="sane-container relative z-20 flex flex-col justify-center py-8 lg:py-10" style={{ minHeight: 280 }}>
            <nav className="mb-3 flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
              <Link href="/" className="transition-colors hover:text-[var(--sane-green)]">Accueil</Link>
              <ChevronRight size={13} />
              <span className="font-semibold text-[var(--sane-green)]">Actualités</span>
            </nav>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--sane-green)]">SALON NATIONAL DE L&apos;EMPLOI</p>
            <div className="max-w-[500px]">
              <h1 className="mb-2 text-[28px] font-extrabold leading-[1.05] tracking-tight text-[#0f5025] sm:text-[36px] lg:text-[48px]">Actualités du SANE</h1>
              <p className="mb-2 text-[15px] font-semibold leading-snug text-[#0f5025] sm:text-[18px]">Restez informé des dernières nouvelles.</p>
              <p className="mb-5 text-[12px] leading-relaxed text-[var(--sane-text-light)] sm:text-[13px]">
                Découvrez nos actualités, annonces, événements et initiatives autour de l&apos;emploi, de la formation et du développement des compétences au Niger.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/programme" className="inline-flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#c9600f]">
                  Voir le programme <ArrowRight size={12} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--sane-green)] bg-white px-4 py-2 text-[12px] font-semibold text-[var(--sane-green)] transition-all hover:bg-[#f0faf4]">
                  Nous contacter <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 2. CATEGORY TABS BAR ═══════════════════ */}
        <section className="border-b border-[#dce8e1] bg-white py-3 shadow-sm">
          <div className="sane-container">
            {/* Mobile: horizontal scroll row */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:hidden">
              {categoryTabs.map((tab, idx) => {
                const isActive = activeTab === tab.key;
                const iconColor = idx % 2 === 0 ? "#E57617" : "#10632d";
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all ${isActive ? "bg-[#0f5025]" : "bg-white ring-1 ring-[#dce8e1]"}`}
                  >
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={isActive ? "#fff" : iconColor} strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
                    </svg>
                    <span className={`whitespace-nowrap text-[12px] font-bold ${isActive ? "text-white" : "text-[#0f5025]"}`}>{tab.title}</span>
                  </button>
                );
              })}
            </div>
            {/* Desktop: grid */}
            <div className="hidden gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-6">
              {categoryTabs.map((tab, idx) => {
                const isActive = activeTab === tab.key;
                const iconColor = idx % 2 === 0 ? "#E57617" : "#10632d";
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-left transition-all ${isActive ? "bg-[#0f5025] shadow-md" : "bg-white shadow-sm ring-1 ring-[#dce8e1] hover:ring-[#10632d]/40"}`}
                  >
                    <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke={isActive ? "#fff" : iconColor} strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
                    </svg>
                    <div className="min-w-0">
                      <p className={`text-[12px] font-extrabold leading-tight ${isActive ? "text-white" : "text-[#0f5025]"}`}>{tab.title}</p>
                      <p className={`mt-0.5 truncate text-[10px] font-medium ${isActive ? "text-white/70" : "text-[#61756b]"}`}>{tab.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. SEARCH / FILTER BAR ═══════════════════ */}
        <section className="border-b border-[#dce8e1] bg-[#f8fbf9] py-6">
          <div className="sane-container">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Left label */}
              <div className="shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="h-[2.5px] w-6 rounded-full bg-[#E57617]" />
                  <h3 className="text-[17px] font-bold text-[#0f5025]">Recherchez une actualité</h3>
                </div>
                <p className="mt-1 text-[13px] text-[#61756b]">Trouvez rapidement les informations qui vous intéressent.</p>
              </div>

              {/* Right search row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#61756b]" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="h-[44px] w-full min-w-[200px] rounded-xl border border-[#dce8e1] bg-white pl-9 pr-3 text-[13px] text-[#0a2e16] outline-none placeholder:text-[#61756b]/50 focus:border-[#10632d] sm:w-[240px]"
                  />
                </div>
                <select className="h-[44px] rounded-xl border border-[#dce8e1] bg-white px-4 pr-9 text-[13px] text-[#61756b] outline-none focus:border-[#10632d] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2361756B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat">
                  <option>Catégorie</option>
                  <option>Événement</option>
                  <option>Communiqué</option>
                  <option>Formation</option>
                  <option>Partenariat</option>
                  <option>Témoignage</option>
                </select>
                <select className="h-[44px] rounded-xl border border-[#dce8e1] bg-white px-4 pr-9 text-[13px] text-[#61756b] outline-none focus:border-[#10632d] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2361756B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat">
                  <option>Date</option>
                  <option>Plus récent</option>
                  <option>Plus ancien</option>
                </select>
                <button className="h-[44px] whitespace-nowrap rounded-xl bg-[#E57617] px-6 text-[13px] font-bold text-white transition-colors hover:bg-[#c9600f]">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. NEWS GRID + SIDEBAR ═══════════════════ */}
        <section className="bg-white py-10">
          <div className="sane-container">
            {/* Section header */}
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-[2px] w-5 rounded-full bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">Dernières actualités</span>
                </div>
                <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#0f5025]">Nos dernières nouvelles</h2>
              </div>
              <Link href="#" className="hidden items-center gap-1 text-[13px] font-semibold text-[#0f5025] hover:text-[#E57617] sm:flex">
                Voir toutes les actualités <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
              {/* LEFT — 3-col article grid */}
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.slice(0, 6).map((a, i) => (
                    <div key={i} className="group flex flex-col overflow-hidden rounded-xl border border-[#dce8e1] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image src={a.image} alt={a.title} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        {/* Date + tag row */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#61756b]">
                            <Calendar size={11} className="text-[#E57617]" />
                            {a.date}
                          </div>
                          <span className="rounded-md px-2.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: a.tagColor }}>
                            {a.tag}
                          </span>
                        </div>
                        <h3 className="mb-2 text-[14px] font-bold leading-snug text-[#0f5025] line-clamp-2">{a.title}</h3>
                        <p className="mb-4 flex-1 text-[12px] leading-relaxed text-[#61756b] line-clamp-4">{a.description}</p>
                        <Link href="#" className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0f5025] hover:text-[#E57617]">
                          Lire l&apos;article <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold transition-colors ${n === 1 ? "bg-[#0f5025] text-white" : "border border-[#dce8e1] text-[#61756b] hover:border-[#0f5025] hover:text-[#0f5025]"}`}>
                      {n}
                    </button>
                  ))}
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce8e1] text-[#61756b] hover:border-[#0f5025] hover:text-[#0f5025]">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* RIGHT — Sidebar */}
              <div className="flex flex-col gap-6">
                {/* Articles populaires */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-[2px] w-5 rounded-full bg-[#E57617]" />
                    <h3 className="text-[15px] font-extrabold text-[#0f5025]">Articles populaires</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-[#dce8e1]">
                    {popularArticles.map((pa, i) => (
                      <Link key={i} href="#" className="group flex items-center gap-3 py-3">
                        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg">
                          <Image src={pa.image} alt={pa.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold leading-snug text-[#0f5025] line-clamp-2 group-hover:text-[#E57617]">{pa.title}</p>
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#61756b]">
                            <Calendar size={10} className="text-[#E57617]" />
                            {pa.date}
                          </div>
                        </div>
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#dce8e1] text-[#61756b] group-hover:border-[#0f5025] group-hover:text-[#0f5025]">
                          <ArrowRight size={11} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Prochains événements */}
                <div className="rounded-xl border border-[#dce8e1] bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-[2px] w-5 rounded-full bg-[#E57617]" />
                    <h3 className="text-[15px] font-extrabold text-[#0f5025]">Prochains événements</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-[#dce8e1]">
                    {upcomingEvents.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff4ec]">
                          <Calendar size={18} className="text-[#E57617]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold leading-snug text-[#0f5025]">{ev.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#61756b]">
                            <span className="flex items-center gap-1"><Calendar size={10} className="text-[#E57617]" />{ev.date}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} className="text-[#E57617]" />{ev.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-[#dce8e1] pt-3">
                    <Link href="#" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0f5025] hover:text-[#E57617]">
                      Voir tous les événements <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="rounded-xl border border-[#dce8e1] bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff4ec]">
                      <Mail size={17} className="text-[#E57617]" />
                    </div>
                    <h3 className="text-[14px] font-extrabold leading-tight text-[#0f5025]">Abonnez-vous à notre newsletter</h3>
                  </div>
                  <p className="mb-3 text-[12px] leading-relaxed text-[#61756b]">
                    Recevez nos dernières actualités et événements directement dans votre boîte mail.
                  </p>
                  <input
                    type="email"
                    placeholder="Votre adresse email..."
                    className="mb-2.5 h-[38px] w-full rounded-lg border border-[#dce8e1] bg-[#f8fbf9] px-3 text-[12px] text-[#0f5025] outline-none placeholder:text-[#61756b]/50 focus:border-[#0f5025]"
                  />
                  <button className="flex h-[38px] w-full items-center justify-center gap-1.5 rounded-lg bg-[#E57617] text-[12px] font-bold text-white transition-colors hover:bg-[#c9600f]">
                    S&apos;abonner <ArrowRight size={13} />
                  </button>
                </div>
              </div>
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
