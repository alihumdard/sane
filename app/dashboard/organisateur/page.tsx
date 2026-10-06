"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home, User, Calendar, BookOpen, Users, UserCheck,
  ClipboardList, Layout, Monitor, MessageSquare, Bell,
  BarChart3, Handshake, Settings, Search, ChevronDown,
  ChevronRight, Eye, Mail, MoreVertical, MapPin, Clock,
  ArrowRight, TrendingUp, Mic, Menu
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const sidebarItems = [
  { icon: <Home size={18} />, label: "Tableau de bord", active: true },
  { icon: <User size={18} />, label: "Mon profil" },
  { icon: <Calendar size={18} />, label: "Événements" },
  { icon: <BookOpen size={18} />, label: "Formations" },
  { icon: <Mic size={18} />, label: "Intervenants" },
  { icon: <Users size={18} />, label: "Participants" },
  { icon: <ClipboardList size={18} />, label: "Inscriptions" },
  { icon: <Layout size={18} />, label: "Programme" },
  { icon: <Monitor size={18} />, label: "Sessions" },
  { icon: <UserCheck size={18} />, label: "Entretiens" },
  { icon: <MessageSquare size={18} />, label: "Messages", badge: 3 },
  { icon: <Bell size={18} />, label: "Notifications", badge: 5 },
  { icon: <BarChart3 size={18} />, label: "Rapports" },
  { icon: <Handshake size={18} />, label: "Partenaires" },
  { icon: <Settings size={18} />, label: "Paramètres" },
];

const statsIcons = {
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 10h18" stroke="currentColor" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="currentColor"/><rect x="14" y="13" width="3" height="3" rx=".5" fill="currentColor"/></svg>
  ),
  graduation: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="currentColor"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="currentColor"/></svg>
  ),
  people: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="3.5" fill="currentColor"/><circle cx="5" cy="9" r="2.5" fill="currentColor"/><circle cx="19" cy="9" r="2.5" fill="currentColor"/><path d="M12 12c-3.5 0-6 2-6 4.5V18h12v-1.5c0-2.5-2.5-4.5-6-4.5z" fill="currentColor"/><path d="M5 13c-2 0-4 1.2-4 3v1h4v-2c0-.7.2-1.4.5-2H5zM19 13c2 0 4 1.2 4 3v1h-4v-2c0-.7-.2-1.4-.5-2H19z" fill="currentColor"/></svg>
  ),
  mic: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 19v3M9 22h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  star: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor"/></svg>
  ),
};

const statsData = [
  { icon: statsIcons.calendar, value: "8", label: "Événements", trend: "+14%", bg: "#FFF3E8", color: "#E57617" },
  { icon: statsIcons.graduation, value: "12", label: "Formations", trend: "+33%", bg: "#E8F5ED", color: "#10632D" },
  { icon: statsIcons.people, value: "2.8K", label: "Participants", trend: "+28%", bg: "#E0F2F1", color: "#0D7377" },
  { icon: statsIcons.mic, value: "1.2K", label: "Inscriptions", trend: "+36%", bg: "#E8F5ED", color: "#10632D" },
  { icon: statsIcons.star, value: "24", label: "Partenaires", trend: "+20%", bg: "#FFF3E8", color: "#E57617" },
];

const lineChartData = [
  { month: "Jan", insc: 30, part: 10 },
  { month: "Fév", insc: 50, part: 20 },
  { month: "Mar", insc: 80, part: 35 },
  { month: "Avr", insc: 70, part: 30 },
  { month: "Mai", insc: 120, part: 50 },
  { month: "Juin", insc: 140, part: 60 },
  { month: "Juil", insc: 160, part: 70 },
  { month: "Août", insc: 180, part: 85 },
  { month: "Sep", insc: 250, part: 110 },
  { month: "Oct", insc: 320, part: 140 },
  { month: "Nov", insc: 380, part: 180 },
  { month: "Déc", insc: 420, part: 200 },
];

const donutData = [
  { label: "Étudiants", pct: 32, color: "#1e3a5f" },
  { label: "Jeunes diplômés", pct: 24, color: "#10632D" },
  { label: "Professionnels", pct: 18, color: "#3b82f6" },
  { label: "Demandeurs d'emploi", pct: 12, color: "#E57617" },
  { label: "Entrepreneurs", pct: 8, color: "#f59e0b" },
  { label: "Autres", pct: 6, color: "#22c55e" },
];

const events = [
  { day: "15", month: "Mar", title: "Conférence d'ouverture SANEM 2024", time: "09:00 - 12:00", location: "Palais des Congrès - Niamey" },
  { day: "18", month: "Mar", title: "Forum Emploi & Entrepreneuriat", time: "10:00 - 16:00", location: "Hôtel Bravia - Niamey" },
  { day: "22", month: "Mar", title: "Atelier : Compétences numériques", time: "14:00 - 17:00", location: "En ligne" },
];

const inscriptions = [
  { name: "Ibrahim Souley", event: "Forum Emploi 2024", type: "Événement", typeColor: "#10632D", date: "12 Mars 2024", statut: "Confirmée", statutColor: "#10632D", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Fatouma Issa", event: "Gestion de projet", type: "Formation", typeColor: "#3b82f6", date: "11 Mars 2024", statut: "Confirmée", statutColor: "#10632D", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Moussa Adamou", event: "Conférence d'ouverture", type: "Événement", typeColor: "#10632D", date: "10 Mars 2024", statut: "En attente", statutColor: "#E57617", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Aminata Diallo", event: "Entrepreneuriat des jeunes", type: "Formation", typeColor: "#3b82f6", date: "10 Mars 2024", statut: "Confirmée", statutColor: "#10632D", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Oumar Salifou", event: "Atelier numérique", type: "Formation", typeColor: "#3b82f6", date: "09 Mars 2024", statut: "Confirmée", statutColor: "#10632D", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
];

const catIcons = {
  student: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>,
  graduate: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>,
  pro: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  seeker: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>,
  entrepreneur: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
  other: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>,
};

const categories = [
  { icon: catIcons.student, label: "Étudiants", count: 896, pct: 32, color: "#10632D", bg: "#E8F5ED" },
  { icon: catIcons.graduate, label: "Jeunes diplômés", count: 672, pct: 24, color: "#E57617", bg: "#FFF3E8" },
  { icon: catIcons.pro, label: "Professionnels", count: 504, pct: 18, color: "#0D7377", bg: "#E0F2F1" },
  { icon: catIcons.seeker, label: "Demandeurs d'emploi", count: 336, pct: 12, color: "#1e3a5f", bg: "#E8EEF5" },
  { icon: catIcons.entrepreneur, label: "Entrepreneurs", count: 224, pct: 8, color: "#f59e0b", bg: "#FEF9E7" },
  { icon: catIcons.other, label: "Autres", count: 168, pct: 6, color: "#6b7280", bg: "#F3F4F6" },
];

const activities = [
  { icon: <ClipboardList size={14} />, iconBg: "#10632D", title: "Nouvelle inscription à la formation Gestion de projet", desc: "Ibrahim Souley s'est inscrit il y a 2 heures" },
  { icon: <Users size={14} />, iconBg: "#3b82f6", title: "Un nouvel intervenant a été ajouté", desc: "Dr. Amadou Mahamane a été invité il y a 4 heures" },
  { icon: <Calendar size={14} />, iconBg: "#E57617", title: "Nouvel événement créé", desc: "Forum Emploi & Entrepreneuriat a été publié il y a 1 jour" },
];

const recentMessages = [
  { name: "Moussa Adamou", preview: "Bonjour, je souhaiterais avoir plus d'informations...", time: "il y a 1 heure", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Fatouma Issa", preview: "Merci pour l'organisation de cet événement !", time: "il y a 3 heures", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Oumar Salifou", preview: "Est-il possible de participer en ligne ?", time: "il y a 5 heures", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
];

const recentNotifs = [
  { icon: <Calendar size={14} />, iconBg: "#E57617", title: "Rappel : Conférence d'ouverture demain", desc: "Il vous reste 1 jour", time: "il y a 30 min" },
  { icon: <ClipboardList size={14} />, iconBg: "#10632D", title: "50 nouvelles inscriptions", desc: "Forum Emploi & Entrepreneuriat", time: "il y a 2 heures" },
  { icon: <Handshake size={14} />, iconBg: "#f59e0b", title: "Nouvelle demande de partenariat", desc: "ONG Locale - Niamey", time: "il y a 6 heures" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function DashboardOrganisateurPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const maxVal = 450;

  const conicGradient = (() => {
    let acc = 0;
    return donutData.map((d) => {
      const start = acc;
      acc += d.pct;
      return `${d.color} ${start * 3.6}deg ${acc * 3.6}deg`;
    }).join(", ");
  })();

  return (
    <div className="flex h-screen bg-[var(--sane-background)] overflow-hidden">
      {/* Mobile overlay */}
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ═══════════ MAIN ═══════════ */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* TOP NAVBAR */}
        <DashboardNavbar searchPlaceholder="Rechercher un événement..." notificationCount={5} userName="Aïssatou Bello" userRole="Organisateur" userImage="https://randomuser.me/api/portraits/women/55.jpg" onMenuClick={() => setSidebarOpen(true)} />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
          {/* ═══════════ WELCOME BANNER ═══════════ */}
          <div className="relative mb-6 overflow-hidden rounded-2xl min-h-[110px] sm:h-[140px]">
            <Image src="/sane_deal.png" alt="Dashboard" fill className="object-cover" style={{ objectPosition: "center 30%" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white from-32% via-white/40 via-48% to-transparent" />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#10632D"/><text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANEM</text><path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
              <p className="text-[16px] italic text-[var(--sane-orange)] leading-tight font-semibold" style={{ fontFamily: "Georgia, serif" }}>Un Niger<br/>de Talents</p>
            </div>
            <div className="relative z-20 p-4 sm:p-6">
              <nav className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--sane-text-light)]">
                <span>Accueil</span>
                <ChevronRight size={11} />
                <span>Organisateur</span>
                <ChevronRight size={11} />
                <span className="font-medium text-[var(--sane-green-deep)]">Tableau de bord</span>
              </nav>
              <h1 className="mb-1 text-2xl font-extrabold text-[var(--sane-green-deep)]">Bienvenue, Aïssatou !</h1>
              <p className="max-w-md text-[13px] text-[var(--sane-text-light)]">Organisez, gérez et suivez tous vos événements du SANEM. Contribuez à connecter les talents nigériens aux opportunités.</p>
            </div>
          </div>

          {/* ═══════════ STATS ROW ═══════════ */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 rounded-xl border border-[var(--sane-border)] bg-white px-4 py-3">
            {statsData.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-[var(--sane-green-deep)]">{s.value}</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--sane-green)]">
                      <TrendingUp size={10} /> {s.trend}
                    </span>
                    <span className="hidden text-[9px] text-[var(--sane-text-light)]/60 min-[420px]:inline">vs. mois dernier</span>
                  </div>
                  <p className="text-[10px] text-[var(--sane-text-light)] truncate">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════ CHARTS ROW ═══════════ */}
          <div className="mb-6 grid grid-cols-1 xl:grid-cols-[1fr_280px_280px] gap-4">
            {/* Line Chart */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[14px] font-bold text-[var(--sane-green-deep)]">Inscriptions par mois</h3>
                </div>
                <select className="rounded border border-[var(--sane-border)] px-2 py-1 text-[10px] text-[var(--sane-text-light)] outline-none">
                  <option>Cette année</option>
                </select>
              </div>
              <div className="mb-3 flex items-center gap-4 text-[10px] text-[var(--sane-text-light)]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--sane-green)]" /> Inscriptions</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--sane-orange)]" /> Participants</span>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[9px] text-[var(--sane-text-light)] pb-5">
                  <span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
                </div>
                <div className="relative flex-1" style={{ height: 130 }}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((p) => (
                    <div key={p} className="absolute left-0 right-0 border-t border-[var(--sane-border)]/50" style={{ top: `${p}%` }} />
                  ))}
                  {/* Line charts */}
                  <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${lineChartData.length * 40} ${maxVal}`} preserveAspectRatio="none" fill="none">
                    {/* Inscriptions line (green) */}
                    <polyline
                      points={lineChartData.map((d, i) => `${i * 40 + 20},${maxVal - d.insc}`).join(" ")}
                      stroke="#10632D" strokeWidth="2.5" fill="none"
                    />
                    {lineChartData.map((d, i) => (
                      <circle key={`i${i}`} cx={i * 40 + 20} cy={maxVal - d.insc} r="4" fill="white" stroke="#10632D" strokeWidth="2" />
                    ))}
                    {/* Participants line (orange) */}
                    <polyline
                      points={lineChartData.map((d, i) => `${i * 40 + 20},${maxVal - d.part}`).join(" ")}
                      stroke="#E57617" strokeWidth="2.5" fill="none"
                    />
                    {lineChartData.map((d, i) => (
                      <circle key={`p${i}`} cx={i * 40 + 20} cy={maxVal - d.part} r="4" fill="white" stroke="#E57617" strokeWidth="2" />
                    ))}
                  </svg>
                  {/* Month labels */}
                  <div className="absolute -bottom-4 left-0 right-0 flex">
                    {lineChartData.map((d, i) => (
                      <span key={i} className="flex-1 text-center text-[9px] text-[var(--sane-text-light)]">{d.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-4 bg-[var(--sane-orange)]" />
                <h3 className="text-[14px] font-bold text-[var(--sane-green-deep)]">Répartition des participants</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="h-[100px] w-[100px] rounded-full" style={{ background: `conic-gradient(${conicGradient})` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-[15px] font-extrabold text-[var(--sane-green-deep)]">2.8K</span>
                      <span className="text-[7px] text-[var(--sane-text-light)]">Participants</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {donutData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px]">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--sane-text-light)]">{d.label}</span>
                      <span className="ml-1 font-semibold text-[var(--sane-green-deep)]">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prochains événements */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Prochains événements</h3>
                </div>
                <Link href="#" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3">
                {events.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex shrink-0 flex-col items-center">
                      <span className="text-[16px] font-extrabold leading-none text-[var(--sane-orange)]">{e.day}</span>
                      <span className="text-[9px] font-semibold text-[var(--sane-orange)]">{e.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[var(--sane-green-deep)] truncate">{e.title}</p>
                      <div className="flex items-center gap-2 text-[9px] text-[var(--sane-text-light)]">
                        <span className="flex items-center gap-0.5"><Clock size={8} /> {e.time}</span>
                      </div>
                      <p className="text-[9px] text-[var(--sane-text-light)] flex items-center gap-0.5"><MapPin size={8} /> {e.location}</p>
                    </div>
                    <ChevronRight size={14} className="text-[var(--sane-text-light)] mt-1 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════ TABLE + CATEGORIES ═══════════ */}
          <div className="mb-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            {/* Inscriptions Table */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5 min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[14px] font-bold text-[var(--sane-green-deep)]">Dernières inscriptions</h3>
                </div>
                <Link href="#" className="text-[11px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={11} /></Link>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-[var(--sane-border)] text-[10px] font-semibold text-[var(--sane-text-light)]">
                    <th className="pb-2 pr-2 w-6"><input type="checkbox" className="h-3 w-3 accent-[var(--sane-green)]" /></th>
                    <th className="pb-2">Participant</th>
                    <th className="pb-2">Événement / Formation</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Date d'inscription</th>
                    <th className="pb-2">Statut</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map((r, i) => (
                    <tr key={i} className="border-b border-[var(--sane-border)] last:border-0">
                      <td className="py-2.5 pr-2"><input type="checkbox" className="h-3 w-3 accent-[var(--sane-green)]" /></td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <Image src={r.avatar} alt={r.name} width={28} height={28} className="rounded-full object-cover" />
                          <span className="text-[12px] font-semibold text-[var(--sane-green-deep)]">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-[11px] text-[var(--sane-text-light)]">{r.event}</td>
                      <td className="py-2.5">
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white" style={{ backgroundColor: r.typeColor }}>
                          {r.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-[var(--sane-text-light)]">{r.date}</td>
                      <td className="py-2.5">
                        <span className="rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: r.statutColor, color: r.statutColor }}>
                          {r.statut}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5 text-[var(--sane-text-light)]">
                          <button className="hover:text-[var(--sane-green)]"><Eye size={14} /></button>
                          <button className="hover:text-[var(--sane-green)]"><Mail size={14} /></button>
                          <button className="hover:text-[var(--sane-green)]"><MoreVertical size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Participants par catégorie */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Participants par catégorie</h3>
                </div>
                <Link href="#" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3">
                {categories.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
                      {c.icon}
                    </div>
                    <span className="w-[120px] text-[11px] text-[var(--sane-green-deep)] truncate shrink-0">{c.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#E8EEF2] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct * 2.8}%`, backgroundColor: c.color }} />
                    </div>
                    <span className="text-[12px] font-bold text-[var(--sane-green-deep)] w-8 text-right">{c.count}</span>
                    <span className="text-[10px] text-[var(--sane-text-light)] w-7 text-right">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════ BOTTOM ROW ═══════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Activités récentes */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Activités récentes</h3>
                </div>
                <Link href="#" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3.5">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: a.iconBg }}>
                      {a.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[var(--sane-green-deep)] leading-tight">{a.title}</p>
                      <p className="text-[10px] text-[var(--sane-orange)] mt-0.5">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages récents */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Messages récents</h3>
                </div>
                <Link href="#" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3.5">
                {recentMessages.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Image src={m.avatar} alt={m.name} width={36} height={36} className="rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-[var(--sane-green-deep)]">{m.name}</p>
                      <p className="text-[10px] text-[var(--sane-text-light)] truncate">{m.preview}</p>
                      <p className="text-[9px] text-[#3b82f6] mt-0.5">{m.time}</p>
                    </div>
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--sane-orange)] shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications récentes */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Notifications récentes</h3>
                </div>
                <Link href="#" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3.5">
                {recentNotifs.map((n, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: n.iconBg }}>
                      {n.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--sane-green-deep)] leading-tight">{n.title}</p>
                      <p className="text-[10px] text-[var(--sane-text-light)]">{n.desc}</p>
                      <p className="text-[9px] text-[var(--sane-orange)] mt-0.5">{n.time}</p>
                    </div>
                    <span className="mt-1 h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: n.iconBg }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
