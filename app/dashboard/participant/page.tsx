"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home, User, BookOpen, Briefcase, ClipboardList, Calendar,
  Heart, MessageSquare, Bell, Settings, Search, ChevronDown,
  ChevronRight, ArrowRight, MapPin, Phone, Mail, Bookmark,
  Edit3, Video, TrendingUp
} from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const sidebarItems = [
  { icon: <Home size={18} />, label: "Tableau de bord", active: true },
  { icon: <User size={18} />, label: "Mon profil" },
  { icon: <BookOpen size={18} />, label: "Mes formations" },
  { icon: <Briefcase size={18} />, label: "Mes opportunités" },
  { icon: <ClipboardList size={18} />, label: "Mes candidatures" },
  { icon: <Calendar size={18} />, label: "Mes entretiens" },
  { icon: <Heart size={18} />, label: "Mes favoris" },
  { icon: <MessageSquare size={18} />, label: "Mes messages", badge: 3 },
  { icon: <Bell size={18} />, label: "Mes notifications", badge: 5 },
  { icon: <Settings size={18} />, label: "Paramètres" },
];

const statsData = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>,
    value: "3", label: "Formations en cours", bg: "#F0E8F5", color: "#6B21A8",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
    value: "12", label: "Candidatures envoyées", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" fill="#10632D"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="#10632D" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="white"/><rect x="14" y="13" width="3" height="3" rx=".5" fill="white"/></svg>,
    value: "4", label: "Entretiens planifiés", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>,
    value: "2", label: "Offres sauvegardées", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    value: "5", label: "Nouveaux messages", bg: "#F0E8F5", color: "#6B21A8",
  },
];

const formations = [
  {
    image: "/sane_company.png",
    tag: "Formation",
    title: "Compétences numériques pour l'emploi",
    org: "SANE",
    location: "En ligne",
    duration: "6 semaines",
    cert: "Certificat",
  },
  {
    image: "/Entrepreneuriat.png",
    tag: "Formation",
    title: "Gestion de projet",
    org: "IFAD",
    location: "Niamey",
    duration: "4 semaines",
    cert: "Certificat",
  },
  {
    image: "/Transformation.png",
    tag: "Formation",
    title: "Entrepreneuriat des jeunes",
    org: "PNUD",
    location: "Niamey",
    duration: "8 semaines",
    cert: "Certificat",
  },
];

const companyLogos: Record<string, React.ReactNode> = {
  pnud: <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#1e3a5f"/><text x="14" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">PNUD</text></svg>,
  unicef: <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#00AEEF"/><text x="14" y="18" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700" fontFamily="sans-serif">UNICEF</text></svg>,
  sn: <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="14,2 26,24 2,24" fill="#DC2626"/><text x="14" y="20" textAnchor="middle" fill="white" fontSize="6" fontWeight="700" fontFamily="sans-serif">SN</text></svg>,
  ong: <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#E57617"/><text x="14" y="18" textAnchor="middle" fill="white" fontSize="6" fontWeight="700" fontFamily="sans-serif">ONG</text></svg>,
  giz: <span className="text-[14px] font-extrabold text-[#1e3a5f]">giz</span>,
};

const tagColors: Record<string, string> = {
  "Temps plein": "bg-[#E8F5ED] text-[#10632D]",
  "CDD": "bg-[#FEE2E2] text-[#DC2626]",
  "Stage": "bg-[#FFF3E8] text-[#E57617]",
  "Administration": "bg-[#EDE9FE] text-[#6B21A8]",
  "Communication": "bg-[#EDE9FE] text-[#6B21A8]",
  "Informatique": "bg-[#EDE9FE] text-[#6B21A8]",
  "Suivi & Evaluation": "bg-[#EDE9FE] text-[#6B21A8]",
  "Gestion de projet": "bg-[#EDE9FE] text-[#6B21A8]",
};

const jobOffers = [
  { logoKey: "pnud", title: "Assistant administratif", company: "PNUD · Niamey", tags: ["Temps plein", "Administration"], time: "Il y a 2 jours" },
  { logoKey: "unicef", title: "Chargé de communication", company: "UNICEF · Niamey", tags: ["CDD", "Communication"], time: "Il y a 3 jours" },
  { logoKey: "sn", title: "Technicien informatique", company: "Société Nationale · Niamey", tags: ["Temps plein", "Informatique"], time: "Il y a 5 jours" },
  { logoKey: "ong", title: "Chargé de suivi-évaluation", company: "ONG Locale · Niamey", tags: ["CDD", "Suivi & Evaluation"], time: "Il y a 1 semaine" },
  { logoKey: "giz", title: "Assistant projet", company: "GIZ · Niamey", tags: ["Stage", "Gestion de projet"], time: "Il y a 1 semaine" },
];

const interviews = [
  { day: "15", month: "Mar", title: "Entretien - Assistant administratif", org: "PNUD · En ligne", time: "10:00 - 10:30", type: "video", accent: "#10632D" },
  { day: "18", month: "Mar", title: "Entretien - Technicien informatique", org: "Société Nationale · Niamey", time: "14:00 - 14:30", type: "location", accent: "#E57617" },
  { day: "22", month: "Mar", title: "Entretien - Chargé de communication", org: "UNICEF · En ligne", time: "11:00 - 11:30", type: "video", accent: "#10632D" },
];

const notifications = [
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#10632D"/><path d="M8 8h8M8 12h5M8 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: "Votre candidature a été présélectionnée", time: "il y a 2 heures", dot: "#10632D" },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" fill="#7C3AED"/><path d="M2 7l10 6 10-6" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>, title: "Nouveau message de l'employeur UNICEF", time: "il y a 5 heures", dot: "#7C3AED" },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" fill="#E57617"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="#E57617" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="white"/><rect x="14" y="13" width="3" height="3" rx=".5" fill="white"/></svg>, title: "Rappel : Entretien demain à 10h", time: "il y a 1 jour", dot: "#E57617" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function DashboardParticipantPage() {
  return (
    <div className="flex h-screen bg-[#f8faf9] overflow-hidden">
      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-[#DDE8E0] bg-white">
        <div className="flex flex-col items-center px-5 pt-5 pb-2">
          <div className="flex items-center gap-1">
            <svg width="36" height="36" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#10632D"/><text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANE</text><path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
            <span className="text-[18px] font-extrabold text-[#1e3a5f]">SANE</span>
          </div>
          <span className="text-[7px] font-semibold tracking-[0.15em] text-[#61756B] uppercase">Salon National de l&apos;Emploi</span>
          <svg className="mt-2" width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 10,5 5,10 0,5" fill="#E57617"/></svg>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              className={`flex w-full items-center gap-2.5 px-3 py-2 mb-0.5 text-left transition-all ${
                item.active
                  ? "text-[#0a2e16] font-bold"
                  : "text-[#61756B] hover:bg-[#F5F9F6] rounded-lg"
              }`}
            >
              {item.active ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10632D] text-white shrink-0">
                  {item.icon}
                </span>
              ) : (
                <span>{item.icon}</span>
              )}
              <span className="flex-1 text-[13px]">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E57617] text-white px-1.5 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="shrink-0 px-5 pb-6 pt-4">
          <div className="relative">
            <svg className="absolute right-2 top-0 w-24 opacity-[0.12]" viewBox="0 0 200 150" fill="#10632D"><path d="M60,20 Q80,10 120,15 Q160,20 180,50 Q190,80 170,110 Q150,140 110,145 Q70,148 40,130 Q15,110 20,80 Q25,50 50,30 Z"/></svg>
            <p className="relative text-[20px] italic text-[#10632D] leading-snug font-semibold" style={{ fontFamily: "Georgia, serif" }}>
              Des talents<br/>pour un Niger<br/>plus fort
            </p>
            <div className="relative mt-2 h-[3px] w-14 rounded-full bg-[#E57617]" />
          </div>
        </div>
      </aside>

      {/* ═══════════ MAIN ═══════════ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="flex items-center gap-4 border-b border-[#DDE8E0] bg-white px-6 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-3 py-2">
            <Search size={16} className="text-[#61756B]" />
            <input type="text" placeholder="Rechercher une formation, une offre, un événement..." className="flex-1 bg-transparent text-[12px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none" />
          </div>
          <button className="relative rounded-lg p-2 text-[#61756B] hover:bg-[#F5F9F6]">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E57617] text-[9px] font-bold text-white">5</span>
          </button>
          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-medium text-[#61756B] hover:bg-[#F5F9F6]">
            FR <ChevronDown size={12} />
          </button>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#DDE8E0] px-3 py-1.5">
            <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="Moussa" width={32} height={32} className="rounded-full object-cover" />
            <div>
              <p className="text-[12px] font-bold text-[#0a2e16]">Moussa Idrissa</p>
              <p className="text-[10px] text-[#61756B]">Participant</p>
            </div>
            <ChevronDown size={14} className="text-[#61756B]" />
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ═══════════ WELCOME BANNER ═══════════ */}
          <div className="relative mb-6 overflow-hidden rounded-2xl h-[140px]">
            <Image src="/sane_deal.png" alt="Dashboard" fill className="object-cover" style={{ objectPosition: "center 30%" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white from-32% via-white/60 via-48% to-transparent" />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#10632D"/><text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANE</text><path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
              <p className="text-[16px] italic text-[#E57617] leading-tight font-semibold" style={{ fontFamily: "Georgia, serif" }}>Un Niger<br/>de Talents</p>
            </div>
            <div className="relative z-20 p-6">
              <h1 className="mb-1 text-2xl font-extrabold text-[#0a2e16]">Bienvenue Moussa !</h1>
              <p className="max-w-lg text-[13px] text-[#61756B]">Découvrez de nouvelles opportunités, développez vos compétences et construisez votre avenir avec le SANE.</p>
            </div>
          </div>

          {/* ═══════════ STATS ROW ═══════════ */}
          <div className="mb-6 grid grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-[#DDE8E0] bg-white px-4 py-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-xl font-extrabold text-[#0a2e16]">{s.value}</span>
                  <p className="text-[10px] text-[#61756B] truncate">{s.label}</p>
                </div>
                <ArrowRight size={14} className="text-[#61756B] shrink-0" />
              </div>
            ))}
          </div>

          {/* ═══════════ FORMATIONS + PROFILE ═══════════ */}
          <div className="mb-6 grid grid-cols-[1fr_320px] gap-4">
            {/* Formations recommandées */}
            <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[#E57617]" />
                  <h3 className="text-[15px] font-bold text-[#0a2e16]">Formations recommandées</h3>
                </div>
                <Link href="#" className="text-[11px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {formations.map((f, i) => (
                  <div key={i} className="rounded-2xl bg-white shadow-sm border border-[#EEF2EF] overflow-hidden flex flex-col">
                    <div className="relative h-[130px]">
                      <Image src={f.image} alt={f.title} fill className="object-cover" />
                      <span className="absolute bottom-2 left-2 rounded-md bg-white/80 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold text-[#10632D] border border-[#10632D]/20">{f.tag}</span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col">
                      <h4 className="text-[12px] font-bold text-[#0a2e16] mb-2 leading-tight">{f.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#10632D] mb-1">
                        <MapPin size={10} />
                        <span>{f.org} · {f.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#61756B] mb-3">
                        <span className="flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> {f.duration}</span>
                        <span className="flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> {f.cert}</span>
                      </div>
                      <button className="mt-auto w-full rounded-xl bg-[#10632D] py-2.5 text-[11px] font-bold text-white hover:bg-[#0a4a22] transition-colors">
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mon profil */}
            <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[#E57617]" />
                  <h3 className="text-[15px] font-bold text-[#0a2e16]">Mon profil</h3>
                </div>
                <Link href="#" className="text-[11px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">Voir mon profil <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col items-center text-center mb-4">
                <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="Moussa" width={72} height={72} className="rounded-full object-cover mb-2" />
                <h4 className="text-[14px] font-bold text-[#0a2e16]">Moussa Idrissa</h4>
                <p className="text-[11px] text-[#61756B] mb-3">Participant</p>
                <div className="flex flex-col gap-1.5 w-full text-left">
                  <div className="flex items-center gap-2 text-[11px] text-[#61756B]">
                    <Mail size={12} className="text-[#10632D]" />
                    <span>moussa.idrissa@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#61756B]">
                    <Phone size={12} className="text-[#10632D]" />
                    <span>+227 90 12 34 56</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#61756B]">
                    <MapPin size={12} className="text-[#10632D]" />
                    <span>Niamey, Niger</span>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-[#0a2e16]">Profil complété</span>
                  <span className="text-[11px] font-bold text-[#10632D]">80%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#DDE8E0] overflow-hidden">
                  <div className="h-full rounded-full bg-[#10632D]" style={{ width: "80%" }} />
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#DDE8E0] py-2.5 text-[11px] font-semibold text-[#0a2e16] hover:bg-[#F5F9F6] transition-colors">
                <Edit3 size={13} />
                Compléter mon profil
              </button>
            </div>
          </div>

          {/* ═══════════ OFFERS + INTERVIEWS + NOTIFICATIONS ═══════════ */}
          <div className="grid grid-cols-[1fr_360px] gap-4">
            {/* Dernières offres d'emploi */}
            <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[#E57617]" />
                  <h3 className="text-[15px] font-bold text-[#0a2e16]">Dernières offres d&apos;emploi</h3>
                </div>
                <Link href="#" className="text-[11px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col">
                {jobOffers.map((j, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-[#DDE8E0]/50 last:border-b-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                      {companyLogos[j.logoKey]}
                    </div>
                    <div className="min-w-0 w-[170px] shrink-0">
                      <p className="text-[12px] font-bold text-[#0a2e16] truncate">{j.title}</p>
                      <p className="text-[10px] text-[#61756B]">{j.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {j.tags.map((t, ti) => (
                        <span key={ti} className={`rounded-md px-2.5 py-1 text-[9px] font-semibold ${tagColors[t] || "bg-[#F5F9F6] text-[#10632D]"}`}>{t}</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#61756B] whitespace-nowrap ml-auto mr-3">{j.time}</span>
                    <button className="rounded-lg bg-[#10632D] px-5 py-1.5 text-[10px] font-bold text-white hover:bg-[#0a4a22] transition-colors shrink-0 mr-2">
                      Postuler
                    </button>
                    <button className="text-[#10632D] hover:text-[#E57617] shrink-0">
                      <Bookmark size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: Interviews + Notifications */}
            <div className="flex flex-col gap-4">
              {/* Mes prochains entretiens */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[13px] font-bold text-[#0a2e16]">Mes prochains entretiens</h3>
                  </div>
                  <Link href="#" className="text-[10px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
                </div>
                <div className="flex flex-col gap-3">
                  {interviews.map((itv, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full" style={{ backgroundColor: `${itv.accent}15` }}>
                        <span className="text-[14px] font-extrabold leading-none" style={{ color: itv.accent }}>{itv.day}</span>
                        <span className="text-[9px] font-semibold" style={{ color: itv.accent }}>{itv.month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#0a2e16]">{itv.title}</p>
                        <p className="text-[9px] text-[#61756B]">{itv.org}</p>
                        <p className="text-[9px] text-[#61756B]">{itv.time}</p>
                      </div>
                      {itv.type === "video" ? (
                        <Video size={16} className="text-[#3b82f6] shrink-0" />
                      ) : (
                        <MapPin size={16} className="text-[#ef4444] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications récentes */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[13px] font-bold text-[#0a2e16]">Notifications récentes</h3>
                  </div>
                  <Link href="#" className="text-[10px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
                </div>
                <div className="flex flex-col gap-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="shrink-0">
                        {n.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#0a2e16] leading-tight">{n.title}</p>
                        <p className="text-[9px] text-[#61756B] mt-0.5">{n.time}</p>
                      </div>
                      <span className="mt-1 h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: n.dot }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
