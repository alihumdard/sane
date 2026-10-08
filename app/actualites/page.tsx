"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import {
  ChevronRight,
  ArrowRight,
  Calendar,
  MapPin,
  Search,
  Play,
  Mail,
} from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const categoryTabs = [
  {
    key: "tous",
    title: "Tous",
    subtitle: "Les actualités",
    iconPath: "M4 4h16v12H4zm0 12l4-4 2 2 4-4 6 6",
  },
  {
    key: "evenements",
    title: "Événements",
    subtitle: "Conférences et rencontres",
    iconPath:
      "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  },
  {
    key: "communiques",
    title: "Communiqués",
    subtitle: "Annonces officielles",
    iconPath:
      "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  },
  {
    key: "partenariats",
    title: "Partenariats",
    subtitle: "Collaborations",
    iconPath:
      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    key: "formations",
    title: "Formations",
    subtitle: "Programmes et sessions",
    iconPath: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3l4 2 4-2",
  },
  {
    key: "temoignages",
    title: "Témoignages",
    subtitle: "Parcours inspirants",
    iconPath:
      "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
];

const articles = [
  {
    image: "/sane_deal.png",
    date: "12 Mars 2024",
    tag: "Événement",
    tagColor: "#E57617",
    title: "Lancement officiel du SANEM 2024 à Niamey",
    description:
      "Le Ministère de l'Emploi annonce la tenue de la prochaine édition du Salon National de l'Emploi au Palais des Congrès de Niamey.",
  },
  {
    image: "/actualites-card1.png",
    date: "08 Mars 2024",
    tag: "Formation",
    tagColor: "#10632D",
    title: "Le SANEM 2024 : un carrefour d'opportunités pour les jeunes",
    description:
      "Découvrez les objectifs, les temps forts et les innovations de cette nouvelle édition qui réunit entreprises, institutions et chercheurs d'emploi.",
  },
  {
    image: "/sane_deal.png",
    date: "05 Mars 2024",
    tag: "Partenariat",
    tagColor: "#E57617",
    title: "Le SANEM renforce ses partenariats internationaux",
    description:
      "De nouvelles collaborations pour soutenir l'emploi, la formation et l'insertion professionnelle des jeunes nigériens.",
  },
  {
    image: "/actualites-card1.png",
    date: "28 Février 2024",
    tag: "Témoignage",
    tagColor: "#10632D",
    title: "Ils ont trouvé leur opportunité grâce au SANEM",
    description:
      "Découvrez les témoignages inspirants des jeunes qui ont pu bénéficier d'opportunités d'emploi et de formation.",
  },
  {
    image: "/sane_deal.png",
    date: "20 Février 2024",
    tag: "Formation",
    tagColor: "#E57617",
    title: "Des formations adaptées aux besoins du marché",
    description:
      "Le SANEM met l'accent sur des formations pratiques et certifiantes pour renforcer l'employabilité des jeunes.",
  },
  {
    image: "/actualites-card1.png",
    date: "15 Février 2024",
    tag: "Communiqué",
    tagColor: "#1a5276",
    title: "Communiqué officiel du SANEM",
    description:
      "Retrouvez les dernières annonces et informations importantes concernant l'organisation de l'événement.",
  },
];

const popularArticles = [
  {
    title: "Lancement officiel du SANEM 2024 à Niamey",
    date: "12 Mars 2024",
    image: "/sane-deal3.png",
  },
  {
    title: "Des formations pour les jeunes nigériens",
    date: "05 Mars 2024",
    image: "/sane-deal3.png",
  },
  {
    title: "Le SANEM renforce ses partenariats",
    date: "28 Février 2024",
    image: "/sane-deal3.png",
  },
  {
    title: "Témoignages de participants",
    date: "20 Février 2024",
    image: "/sane-deal3.png",
  },
];

const upcomingEvents = [
  {
    title: "Conférence sur l'emploi des jeunes",
    date: "10 Avril 2024",
    location: "Niamey, Niger",
  },
  {
    title: "Atelier de formation digitale",
    date: "15 Avril 2024",
    location: "Niamey, Niger",
  },
  {
    title: "Rencontres B2B entreprises - talents",
    date: "20 Avril 2024",
    location: "Niamey, Niger",
  },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */
export default function ActualitesPage() {
  const [activeTab, setActiveTab] = useState("tous");

  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <section className="relative overflow-hidden bg-[#0a4a22] sm:min-h-[340px] lg:min-h-[380px]">
          <div className="absolute inset-0 hidden sm:block">
            <Image
              src="/actualites2.png"
              alt="Actualités SANEM"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0 z-10 hidden sm:block sm:bg-gradient-to-b sm:from-[#0a4a22]/85 sm:via-[#0a4a22]/60 sm:to-[#0a4a22]/35 lg:bg-gradient-to-r lg:from-[#0a4a22]/80 lg:via-[#0a4a22]/25 lg:to-transparent lg:to-[60%]" />

          <div className="absolute right-4 top-4 z-20 rounded-lg bg-white/95 px-3 py-2.5 text-[8px] font-extrabold uppercase leading-[1.8] tracking-wide text-[#0a4a22] shadow-lg backdrop-blur-sm sm:right-6 sm:top-8 sm:px-3.5 sm:py-3 sm:text-[10px]">
            EMPLOI
            <br />
            FORMATION
            <br />
            OPPORTUNITÉS
            <br />
            AVENIR
            <div className="mt-1.5 h-[2px] w-6 rounded-full bg-[#E57617]" />
          </div>
          <div className="absolute bottom-[25%] right-4 z-20 hidden text-right sm:bottom-10 sm:right-6 lg:block">
            <p className="font-serif text-[20px] font-bold italic leading-[1.3] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
              Une information
              <br />
              pour un Niger
              <br />
              plus fort
            </p>
            <div className="ml-auto mt-2 h-[2.5px] w-8 rounded-full bg-[#E57617]" />
          </div>

          <div className="sane-container relative z-20 flex flex-col justify-center px-4 py-8 sm:min-h-[340px] sm:py-10 lg:min-h-[380px] lg:py-12">
            <nav className="mb-3 flex items-center gap-1.5 text-[11px] text-white/60 sm:mb-4 sm:text-[12px]">
              <Link href="/" className="hover:text-white transition-colors">
                Accueil
              </Link>
              <ChevronRight size={13} />
              <span className="text-white font-medium">Actualités</span>
            </nav>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">
              SALON NATIONAL DE L'EMPLOI
            </p>
            <div className="max-w-[480px]">
              <h1 className="mb-1 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                Actualités du SANEM
              </h1>
              <p className="mb-2 text-base font-bold text-white/90 sm:text-lg">
                Restez informé des dernières nouvelles.
              </p>
              <p className="mb-4 text-[12px] leading-relaxed text-white/65 max-w-[400px] sm:mb-6 sm:text-[13px]">
                Découvrez nos actualités, annonces, événements et initiatives
                autour de l'emploi, de la formation et du développement des
                compétences au Niger.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/programme"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E57617] px-5 py-2.5 text-[12px] font-semibold text-white transition-all hover:bg-[#c9600f] hover:-translate-y-0.5"
                >
                  Voir le programme <ArrowRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[12px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
                >
                  Nous contacter <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile: visible image strip */}
          <div className="relative h-[180px] sm:hidden">
            <Image
              src="/actualites2.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "70% center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a4a22] via-transparent to-transparent to-[25%]" />
          </div>
        </section>

        {/* ═══════════════════ 2. CATEGORY TABS BAR ═══════════════════ */}
        <section className="bg-white py-4 sm:py-5">
          <div className="sane-container px-4">
            <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-6 sm:gap-3">
              {categoryTabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex min-h-[70px] shrink-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all sm:min-h-[80px] sm:px-4 sm:py-3.5 ${
                      active
                        ? "border-transparent bg-[#0a4a22] text-white shadow-md"
                        : "border-[#DDE8E0] bg-white text-[#17352a] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        active ? "bg-white/15 text-white" : "bg-[#fff4ec] text-[#E57617]"
                      }`}
                    >
                      <svg
                        className="h-[22px] w-[22px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={tab.iconPath}
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold leading-tight">{tab.title}</p>
                      <p
                        className={`mt-0.5 text-[11.5px] leading-snug ${active ? "text-white/70" : "text-[#61756b]"}`}
                      >
                        {tab.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. SEARCH / FILTER BAR ═══════════════════ */}
        <section className="border-b border-[#DDE8E0] bg-[#f0f5f2] py-5 sm:py-7">
          <div className="sane-container px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <div className="shrink-0">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="h-[2px] w-5 bg-[#E57617]" />
                  <span className="text-[17px] font-bold text-[#0a2e16]">Recherchez une actualité</span>
                </div>
                <p className="text-[12px] text-[#61756B]">
                  Trouvez rapidement les informations qui vous intéressent.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]"
                  />
                  <input
                    type="text"
                    placeholder="Rechercher un article, un événement..."
                    className="h-[44px] w-full rounded-full border border-[#DDE8E0] bg-white pl-10 pr-4 text-[13px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none focus:border-[#10632D]"
                  />
                </div>
                <select className="h-[44px] rounded-full border border-[#DDE8E0] bg-white px-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]">
                  <option>Catégorie</option>
                  <option>Événement</option>
                  <option>Communiqué</option>
                  <option>Formation</option>
                  <option>Partenariat</option>
                  <option>Témoignage</option>
                </select>
                <select className="h-[44px] rounded-full border border-[#DDE8E0] bg-white px-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]">
                  <option>Date</option>
                  <option>Plus récent</option>
                  <option>Plus ancien</option>
                </select>
                <button className="h-[44px] rounded-full bg-[#E57617] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#c9600f] whitespace-nowrap">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. NEWS GRID + SIDEBAR ═══════════════════ */}
        <section className="bg-white py-8 sm:py-10 lg:py-14">
          <div className="sane-container px-4">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
                  <span className="h-px w-6 bg-[#E57617]" />
                  DERNIÈRES ACTUALITÉS
                </div>
                <h2 className="text-xl font-bold text-[#0a2e16] sm:text-2xl lg:text-3xl">
                  Nos dernières nouvelles
                </h2>
              </div>
              <Link
                href="#"
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[#10632D] hover:text-[#E57617] sm:text-[14px]"
              >
                Voir toutes les actualités <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
              {/* LEFT — Article Grid + À La Une + Pagination */}
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                  {articles.map((a, i) => (
                    <div
                      key={i}
                      className="group overflow-hidden rounded-2xl border border-[#DDE8E0] bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-[180px] overflow-hidden">
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-3 right-3">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                            style={{ backgroundColor: a.tagColor }}
                          >
                            {a.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#61756B]">
                          <Calendar size={12} className="text-[#E57617]" />
                          {a.date}
                        </div>
                        <h3 className="mb-2 text-[14px] font-bold leading-snug text-[#0a2e16]">
                          {a.title}
                        </h3>
                        <p className="mb-3 text-[12px] leading-relaxed text-[#61756B] line-clamp-3">
                          {a.description}
                        </p>
                        <Link
                          href="#"
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#10632D] hover:text-[#E57617]"
                        >
                          Lire l'article <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* À LA UNE */}
                <div className="mt-10">
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#0a2e16]">
                    <span className="h-px w-4 bg-[#E57617]" />À LA UNE
                  </div>
                  <h2 className="mb-6 text-xl font-bold text-[#0a2e16] lg:text-2xl">
                    Le SANEM, un engagement pour l'avenir du Niger
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2 sm:items-center sm:gap-6">
                    <div className="group relative h-[180px] overflow-hidden rounded-2xl sm:h-[220px]">
                      <Image
                        src="/sane_deal.png"
                        alt="À la une"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#10632D] shadow-lg transition-transform group-hover:scale-110">
                          <Play
                            size={24}
                            className="ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-[12px] text-[#E57617]">
                        <Calendar size={12} />
                        12 Mars 2024
                      </div>
                      <h3 className="mb-3 text-[16px] font-bold text-[#0a2e16]">
                        Le SANEM 2024 : Ensemble pour un Niger plus fort
                      </h3>
                      <p className="mb-4 text-[13px] leading-relaxed text-[#61756B]">
                        Découvrez la vision, les objectifs et les temps forts de
                        cette nouvelle édition du Salon National de l'Emploi,
                        qui place les jeunes, la formation et l'innovation au
                        cœur du développement du Niger.
                      </p>
                      <Link
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full bg-[#E57617] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#c9600f]"
                      >
                        Lire l'article complet
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* PAGINATION */}
                <div className="mt-8 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors ${
                        n === 1
                          ? "bg-[#10632D] text-white"
                          : "border border-[#DDE8E0] text-[#61756B] hover:border-[#10632D] hover:text-[#10632D]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE8E0] text-[#61756B] hover:border-[#10632D] hover:text-[#10632D]">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* RIGHT — Sidebar */}
              <div className="flex flex-col gap-8">
                {/* Articles populaires */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[14px] font-bold text-[#0a2e16]">
                      Articles populaires
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {popularArticles.map((pa, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="group flex items-center gap-3 rounded-xl border border-[#DDE8E0] bg-white p-2.5 transition-shadow hover:shadow-md"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={pa.image}
                            alt={pa.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold leading-snug text-[#0a2e16] group-hover:text-[#10632D]">
                            {pa.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#E57617]">
                            <Calendar size={11} />
                            {pa.date}
                          </div>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#10632D] text-[#10632D] group-hover:bg-[#10632D] group-hover:text-white">
                          <ArrowRight size={14} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Prochains événements */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-[2px] w-4 bg-[#E57617]" />
                    <h3 className="text-[15px] font-bold text-[#0a2e16]">
                      Prochains événements
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {upcomingEvents.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-[#DDE8E0] bg-white p-3"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4ec]">
                          <svg className="h-5 w-5 text-[#E57617]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <rect x="7" y="14" width="3" height="3" rx="0.5" fill="#E57617" stroke="none" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold text-[#0a2e16]">
                            {ev.title}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-[#61756B]">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} className="text-[#E57617]" />
                              {ev.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-[#E57617]" />
                              {ev.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="#"
                    className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#10632D] hover:text-[#E57617]"
                  >
                    Voir tous les événements <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Newsletter */}
                <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                  <div className="mb-2 flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E57617] text-white">
                      <Mail size={18} />
                    </div>
                    <h3 className="text-[14px] font-bold text-[#0a2e16]">
                      Abonnez-vous à notre newsletter
                    </h3>
                  </div>
                  <p className="mb-3 text-[12px] leading-relaxed text-[#61756B]">
                    Recevez nos dernières actualités et événements directement
                    dans votre boîte mail.
                  </p>
                  <input
                    type="email"
                    placeholder="Votre adresse email..."
                    className="mb-2.5 w-full rounded-full border border-[#DDE8E0] bg-white px-4 py-2.5 text-[13px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none focus:border-[#10632D]"
                  />
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E57617] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#c9600f]">
                    S'abonner <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pagination is inside the news section above */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
