"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Calendar, MapPin, Users, Mic,
  Download, Clock, Tag, ChevronRight, FileText
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/sections/CTASection";

const quickStats = [
  { icon: Calendar, label: "Date", value: "À confirmer" },
  { icon: MapPin, label: "Lieu", value: "Niamey, Niger" },
  { icon: Users, label: "Participants", value: "+1000 attendus" },
  { icon: Mic, label: "Sessions", value: "Conférences, Formations, Réseautage, Recrutement" },
];

const tabs = ["Programme", "Conférences", "Formations", "Panels", "Recrutement", "Networking"];

const tagColors: Record<string, string> = {
  "Accueil": "bg-[#eaf5ee] text-[#10632D]",
  "Cérémonie": "bg-[#fff3e8] text-[#E57617]",
  "Conférence": "bg-[#e8f0ff] text-[#2B6CB0]",
  "Panel": "bg-[#f3e8ff] text-[#6B46C1]",
  "Networking": "bg-[#e8fff3] text-[#0F766E]",
  "Formation": "bg-[#fef3c7] text-[#92400E]",
  "Recrutement": "bg-[#fee2e2] text-[#B91C1C]",
};

const schedule = [
  {
    time: "08:00 – 09:00",
    title: "Accueil & Inscriptions",
    desc: "Accueil des participants, remise des badges et documents",
    tag: "Accueil",
    location: "Hall principal",
    img: "/sane_deal.png",
    date: "24 octobre",
  },
  {
    time: "09:00 – 09:30",
    title: "Cérémonie d'ouverture",
    desc: "Allocutions officielles et présentation des aspects du SANE",
    tag: "Cérémonie",
    location: "Grande salle",
    img: "/sane_company.png",
    date: "24 octobre",
  },
  {
    time: "09:30 – 10:30",
    title: "Conférence Inaugurale",
    desc: "\"Enjeux des jeunes : enjeux et perspectives pour le Niger\" — Avec des experts nationaux et internationaux",
    tag: "Conférence",
    location: "Grande salle",
    img: "/sane_deal.png",
    date: null,
  },
  {
    time: "11:00 – 12:30",
    title: "Panels thématiques",
    desc: "Transformation digitale et nouveaux métiers · Entrepreneuriat des jeunes · Compétences pour l'avenir",
    tag: "Panel",
    location: "Salles thématiques",
    img: "/sane_cv.png",
    date: null,
  },
  {
    time: "12:30 – 14:00",
    title: "Pause-déjeuner & réseautage",
    desc: "Un moment d'échange entre participants, entreprises et institutions",
    tag: "Networking",
    location: "Espace détente",
    img: "/sane_company.png",
    date: null,
  },
  {
    time: "14:00 – 16:00",
    title: "Sessions de formations",
    desc: "Ateliers pratiques animés par des experts",
    tag: "Formation",
    location: "Salles de formation",
    img: "/sane_deal.png",
    date: null,
  },
  {
    time: "16:00 – 17:30",
    title: "Sessions de recrutement",
    desc: "Rencontrez directement des recruteurs et déposez vos CV",
    tag: "Recrutement",
    location: "Espace recrutement",
    img: "/sane_cv.png",
    date: null,
  },
  {
    time: "17:30 – 18:00",
    title: "Cérémonie de clôture",
    desc: "Synthèse de la journée et prochaines étapes",
    tag: "Cérémonie",
    location: "Grande salle",
    img: "/sane_company.png",
    date: null,
  },
];

const documents = [
  { title: "Programme du SANE", sub: "Version PDF", icon: FileText },
  { title: "Guide du participant", sub: "Visiteur PDF", icon: FileText },
  { title: "Plan du site", sub: "Plan PDF", icon: FileText },
];

export default function ProgrammePage() {
  const [activeTab, setActiveTab] = useState("Programme");

  return (
    <>
      <Header />
      <main>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a22] via-[#0f6b35] to-[#1a9e5c]" />
          <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
            <Image src="/Programme.png" alt="" fill priority className="object-cover object-center" sizes="55vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/50 to-transparent" />
          </div>

          <Container>
            {/* Breadcrumb */}
            <div className="relative flex items-center gap-2 pt-5 text-[12px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={12} />
              <span className="text-white/90 font-medium">Programme</span>
            </div>

            <div className="relative grid min-h-[420px] grid-cols-1 items-center gap-8 pb-10 pt-6 lg:grid-cols-2 lg:gap-10">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                    Salon National de l&apos;Emploi
                  </span>
                </div>
                <h1 className="text-[32px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[42px] md:text-[48px]">
                  Programme du SANE
                </h1>
                <p className="mt-4 max-w-[500px] text-[15px] leading-7 text-white/85">
                  Des échanges, des formations et des rencontres pour construire l&apos;avenir de l&apos;emploi au Niger.
                </p>
                <p className="mt-2 max-w-[500px] text-[13px] leading-6 text-white/65">
                  Découvrez le programme conçu par le Salon National de l&apos;Emploi pour inspirer, former et connecter les talents, les entreprises et les institutions engagées pour l&apos;emploi du Niger.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/inscription" className="group inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#E57617] px-7 text-[13px] font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white">
                    S&apos;inscrire au SANE
                    <ArrowRight size={15} className="text-white !text-white transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link href="#programme" className="inline-flex h-[44px] items-center justify-center rounded-full border-2 border-white px-7 text-[13px] font-bold text-white !text-white transition-colors hover:bg-white hover:!text-[#10632D]">
                    Voir les formations
                  </Link>
                </div>
              </div>

              {/* Right floating card */}
              <div className="relative hidden lg:block">
                <div className="absolute -top-2 right-0 z-10 w-[145px] rounded-xl bg-white px-4 py-4 shadow-xl">
                  <p className="text-[11px] font-extrabold uppercase leading-[1.7] text-[#10632D]">
                    Emploi<br />Formation<br />Opportunités<br />Avenir
                  </p>
                  <div className="mt-3 h-[3px] w-8 rounded-full bg-[#E57617]" />
                </div>
                <div className="absolute bottom-8 right-6 z-10 text-right">
                  <p className="font-serif text-[22px] italic leading-7 text-white drop-shadow-lg">
                    Un Niger<br />de Talents
                  </p>
                  <div className="ml-auto mt-2 h-[3px] w-12 bg-[#E57617]" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== QUICK STATS BAR ===== */}
        <div className="border-b border-[#DDE8E0] bg-white">
          <Container>
            <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-4">
              {quickStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eaf5ee]">
                      <Icon size={18} strokeWidth={2} className="text-[#10632D]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-[#E57617]">{s.label}</p>
                      <p className="text-[13px] font-semibold text-[#0a2e16]">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </div>

        {/* ===== TAB NAVIGATION ===== */}
        <div className="sticky top-[72px] z-30 border-b border-[#DDE8E0] bg-white">
          <Container>
            <div className="flex gap-1 overflow-x-auto py-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-[#10632D] text-white"
                      : "text-[#61756B] hover:bg-[#eaf5ee] hover:text-[#10632D]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Container>
        </div>

        {/* ===== PROGRAMME DÉTAILLÉ ===== */}
        <section id="programme" className="bg-white py-14">
          <Container>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-[26px] font-extrabold text-[#0a2e16] md:text-[32px]">Programme détaillé</h2>
                <p className="mt-1 text-[13px] text-[#61756B]">Un programme riche et varié pour inspirer, former et connecter les talents.</p>
              </div>
              <button className="hidden items-center gap-2 rounded-lg border border-[#DDE8E0] px-4 py-2 text-[13px] font-semibold text-[#10632D] transition-colors hover:bg-[#eaf5ee] sm:flex">
                <Download size={15} /> Télécharger le programme PDF
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-0">
              {schedule.map((item, i) => (
                <div key={i} className="group relative flex gap-4 border-b border-[#f0f5f2] py-5 last:border-0">
                  {/* Time */}
                  <div className="w-[110px] shrink-0">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#10632D]">
                      <Clock size={12} strokeWidth={2} />
                      {item.time}
                    </div>
                    {item.date && (
                      <span className="mt-1 inline-block rounded-full bg-[#E57617] px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.date}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
                    <Image src={item.img} alt={item.title} fill className="object-cover" sizes="96px" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="text-[15px] font-extrabold text-[#0a2e16]">{item.title}</h3>
                    <p className="text-[13px] leading-5 text-[#61756B]">{item.desc}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tagColors[item.tag] ?? "bg-gray-100 text-gray-600"}`}>
                        <Tag size={10} /> {item.tag}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#61756B]">
                        <MapPin size={10} /> {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ===== CTA BANNER ===== */}
        <CTASection />

        {/* ===== LIEU DE L'ÉVÉNEMENT ===== */}
        <section className="bg-white py-14 md:py-16">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left image */}
              <div className="relative h-[300px] overflow-hidden rounded-2xl shadow-xl">
                <Image src="/SalonNationalbg.png" alt="Palais des Congrès de Niamey" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-[12px] font-bold text-[#10632D]">
                  Palais des Congrès — Niamey
                </div>
              </div>

              {/* Right content */}
              <div>
                <h2 className="text-[24px] font-extrabold text-[#0a2e16] md:text-[30px]">Lieu de l&apos;événement</h2>
                <p className="mt-1 text-[14px] font-semibold text-[#E57617]">Palais des Congrès de Niamey</p>
                <p className="mt-3 text-[14px] leading-7 text-[#61756B]">
                  Le SANE se tiendra au Palais des Congrès de Niamey, un lieu emblématique et accessible, offrant un cadre idéal pour accueillir tous les participants.
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {["Niamey, Niger", "Salle principale — 1000+ places", "Salles de formation disponibles", "Parking disponible"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-[#61756B]">
                      <MapPin size={13} strokeWidth={2} className="shrink-0 text-[#10632D]" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="#" className="group mt-6 inline-flex items-center gap-2 rounded-lg border border-[#10632D] px-5 py-2.5 text-[13px] font-bold text-[#10632D] transition-colors hover:bg-[#10632D] hover:!text-white">
                  Voir sur la carte <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== DOCUMENTS UTILES ===== */}
        <section className="bg-[#f7faf8] py-12">
          <Container>
            <h2 className="mb-6 text-[22px] font-extrabold text-[#0a2e16]">Documents utiles</h2>
            <p className="mb-8 text-[13px] text-[#61756B]">Téléchargez les documents officiels du SANE.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {documents.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div key={doc.title} className="flex items-center gap-4 rounded-xl border border-[#DDE8E0] bg-white p-5 transition-shadow hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee]">
                      <Icon size={22} strokeWidth={2} className="text-[#10632D]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-extrabold text-[#0a2e16]">{doc.title}</p>
                      <p className="text-[12px] text-[#61756B]">{doc.sub}</p>
                    </div>
                    <Download size={16} strokeWidth={2} className="shrink-0 text-[#E57617]" />
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
