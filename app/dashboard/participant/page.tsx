"use client";

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, User, ClipboardList, BookOpen, Star, Briefcase,
  FileText, Calendar, Heart, MessageSquare, Bell,
  Settings, HelpCircle, LogOut, ChevronRight, Monitor, Video,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import HeroBanner from "@/components/dashboard/HeroBanner";
import EnterpriseLogo from "@/components/dashboard/EnterpriseLogo";
import ParticipantStatsCard from "@/components/dashboard/ParticipantStatsCard";
import BarChart from "@/components/dashboard/BarChart";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import SectionCard from "@/components/dashboard/SectionCard";

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord", active: true },
  { icon: <User size={18} />, label: "Mon profil" },
  { icon: <ClipboardList size={18} />, label: "Mes inscriptions" },
  { icon: <BookOpen size={18} />, label: "Mes formations" },
  { icon: <Briefcase size={18} />, label: "Mes opportunités" },
  { icon: <FileText size={18} />, label: "Mes candidatures" },
  { icon: <Calendar size={18} />, label: "Mes rendez-vous" },
  { icon: <Heart size={18} />, label: "Mes favoris" },
  { icon: <MessageSquare size={18} />, label: "Messages", badge: 3 },
  { icon: <Bell size={18} />, label: "Notifications", badge: 5 },
  { icon: <Settings size={18} />, label: "Paramètres" },
  { icon: <HelpCircle size={18} />, label: "Aide & FAQ" },
  { icon: <LogOut size={18} />, label: "Déconnexion", dividerBefore: true },
];

/* ─── Stats ─── */
const statsData = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/></svg>, value: "3", label: "Formations inscrites", link: "Voir mes formations", bg: "#E8F5ED", color: "#10632D" },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 12v3"/><path d="M2 12h20"/></svg>, value: "5", label: "Candidatures envoyées", link: "Voir mes candidatures", bg: "#FFF3E8", color: "#E57617" },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><rect x="7" y="14" width="3" height="3" rx="0.5"/><rect x="14" y="14" width="3" height="3" rx="0.5"/></svg>, value: "2", label: "Rendez-vous à venir", link: "Voir mon calendrier", bg: "#E0F0FF", color: "#2563EB" },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 11h6"/></svg>, value: "12", label: "Nouvelles opportunités", link: "Voir les opportunités", bg: "#FFFBE8", color: "#D97706" },
];

/* ─── Mes formations ─── */
const mesFormations = [
  { img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&h=80&fit=crop", titre: "Développement Web pour l'emploi", details: "En ligne · 12 - 16 Mars 2024", statut: "Inscrit", statutColor: "#10632D", statutBg: "#E8F5ED" },
  { img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=80&fit=crop", titre: "Gestion de projet digital", details: "Niamey · 25 - 28 Mars 2024", statut: "En attente", statutColor: "#E57617", statutBg: "#FFF3E8" },
  { img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&h=80&fit=crop", titre: "Compétences numériques", details: "Niamey · 10 - 12 Avril 2024", statut: "Disponible", statutColor: "#2563EB", statutBg: "#E0F0FF" },
];

/* ─── Mes candidatures ─── */
const mesCandidatures = [
  { logo: "enabel", poste: "Assistant Communication", entreprise: "Enabel Niger", date: "12 Mars 2024", statut: "En cours", statutColor: "#10632D", statutBg: "#E8F5ED" },
  { logo: "giz", poste: "Développeur Web", entreprise: "GIZ Niger", date: "08 Mars 2024", statut: "En revue", statutColor: "#E57617", statutBg: "#FFF3E8" },
  { logo: "pnud", poste: "Spécialiste Suivi & Évaluation", entreprise: "PNUD Niger", date: "05 Mars 2024", statut: "En cours", statutColor: "#10632D", statutBg: "#E8F5ED" },
];

/* ─── Prochains rendez-vous ─── */
const rdvs = [
  { day: "15", month: "Mars", titre: "Entretien - Assistant Communication", lieu: "Enabel Niger", heure: "10h00 - 11h00", mode: "En ligne", modeIcon: <Monitor size={10} /> },
  { day: "22", month: "Mars", titre: "Webinaire : Préparation à l'emploi", lieu: "SANE", heure: "14h00 - 16h00", mode: "En ligne", modeIcon: <Video size={10} /> },
];

/* ─── Événements à venir ─── */
const evenements = [
  { day: "10", month: "Avr", titre: "Atelier : Rédaction de CV", lieu: "SANE · Niamey", badge: "Gratuit", badgeColor: "#10632D", badgeBg: "#E8F5ED" },
  { day: "15", month: "Avr", titre: "Conférence : Jeunes et emploi", lieu: "Palais des Congrès", badge: "Gratuit", badgeColor: "#10632D", badgeBg: "#E8F5ED" },
  { day: "22", month: "Avr", titre: "Rencontre avec les recruteurs", lieu: "SANE · Niamey", badge: "Sur invitation", badgeColor: "#E57617", badgeBg: "#FFF3E8" },
];

/* ─── Bar chart data ─── */
const barData = [
  { label: "Formations", value: 3, color: "#10632D" },
  { label: "Candidatures", value: 5, color: "#E57617" },
  { label: "Rendez-vous", value: 2, color: "#2563EB" },
  { label: "Favoris", value: 7, color: "#0a2e16" },
];

/* ─── Calendar ─── */
const calWeeks = [
  [26, 27, 28, 29, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
];

/* ─── Recommendations ─── */
const recommendations = [
  { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop", category: "Formation", catColor: "#10632D", catBg: "#E8F5ED", titre: "Leadership et gestion d'équipe", lieu: "SANE · Niamey", date: "18 - 20 Avril 2024" },
  { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop", category: "Événement", catColor: "#E57617", catBg: "#FFF3E8", titre: "Salon National de l'Emploi 2024", lieu: "Palais des Congrès · Niamey", date: "12 - 14 Mai 2024" },
  { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop", category: "Opportunité", catColor: "#2563EB", catBg: "#E0F0FF", titre: "Stagiaire en Communication", lieu: "UNICEF Niger", date: "Date limite : 25 Mars 2024" },
];

export default function ParticipantDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} hideBottomInfo open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une formation, un événement..."
          notificationCount={5}
          userName="Aicha Mohamed"
          userRole="Participant"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <HeroBanner
            title="Bienvenue Aicha !"
            description="Accédez à vos formations, opportunités et événements depuis votre espace personnel."
            imageSrc="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=600&fit=crop&q=90"
          />

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statsData.map((s, i) => (
              <ParticipantStatsCard key={i} {...s} />
            ))}
          </div>

          {/* Row 1: 3 columns */}
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <SectionCard icon={<BookOpen size={14} className="text-[#10632D]" />} title="Mes formations" viewAllText="Voir toutes">
              <div className="flex flex-col gap-2.5">
                {mesFormations.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-[#DDE8E0]">
                      <Image src={f.img} alt={f.titre} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{f.titre}</p>
                      <p className="text-[9px] text-[#61756B]">{f.details}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ backgroundColor: f.statutBg, color: f.statutColor }}>{f.statut}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon={<FileText size={14} className="text-[#10632D]" />} title="Mes candidatures" viewAllText="Voir toutes">
              <div className="flex flex-col gap-2.5">
                {mesCandidatures.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <EnterpriseLogo code={c.logo} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{c.poste}</p>
                      <p className="text-[9px] text-[#61756B]">{c.entreprise}</p>
                      <p className="text-[9px] text-[#61756B]">{c.date}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ backgroundColor: c.statutBg, color: c.statutColor }}>{c.statut}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon={<Calendar size={14} className="text-[#10632D]" />} title="Prochains rendez-vous" viewAllText="Voir tous">
              <div className="flex flex-col gap-3">
                {rdvs.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#E8F5ED]">
                      <span className="text-[14px] font-extrabold text-[#10632D] leading-none">{r.day}</span>
                      <span className="text-[8px] font-semibold text-[#10632D]">{r.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight">{r.titre}</p>
                      <p className="text-[9px] text-[#61756B]">{r.lieu}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[9px] text-[#61756B]">{r.heure}</span>
                        <span className="flex items-center gap-0.5 rounded-full bg-[#E0F0FF] px-1.5 py-0.5 text-[8px] font-semibold text-[#2563EB]">
                          {r.modeIcon} {r.mode}
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 mt-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#DDE8E0]">
                      <ChevronRight size={12} className="text-[#61756B]" />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Row 2: 3 columns */}
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <SectionCard icon={<Calendar size={14} className="text-[#10632D]" />} title="Événements à venir" viewAllText="Voir tous">
              <div className="flex flex-col gap-2.5">
                {evenements.map((e, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="flex h-11 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#E8F5ED]">
                      <span className="text-[13px] font-extrabold text-[#10632D] leading-none">{e.day}</span>
                      <span className="text-[8px] font-semibold text-[#10632D]">{e.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{e.titre}</p>
                      <p className="text-[9px] text-[#61756B]">{e.lieu}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ backgroundColor: e.badgeBg, color: e.badgeColor }}>{e.badge}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <BarChart title="Statistiques de mon activité" bars={barData} maxValue={10} />

            <MiniCalendar month="Mars" year={2024} weeks={calWeeks} highlightDays={[8, 15, 22]} today={10} />
          </div>

          {/* Recommendations */}
          <div className="mb-4">
            <div className="mb-3 flex items-center gap-1.5">
              <Star size={14} className="text-[#E57617]" />
              <span className="text-[14px] font-bold text-[#0a2e16]">Recommendations pour vous</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.map((r, i) => (
                <div key={i} className="flex overflow-hidden rounded-xl border border-[#DDE8E0] bg-white">
                  <div className="relative w-[120px] shrink-0">
                    <Image src={r.img} alt={r.titre} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 items-center gap-2 p-3">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-full px-2 py-0.5 text-[8px] font-semibold mb-1" style={{ backgroundColor: r.catBg, color: r.catColor }}>{r.category}</span>
                      <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight">{r.titre}</p>
                      <p className="text-[9px] text-[#61756B] mt-0.5">{r.lieu}</p>
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-[#61756B]">
                        <Calendar size={9} />
                        <span>{r.date}</span>
                      </div>
                    </div>
                    <button className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#DDE8E0]">
                      <ChevronRight size={13} className="text-[#61756B]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
