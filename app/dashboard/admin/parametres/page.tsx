"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, ChevronRight, Globe,
  Shield, Zap, Database, Mail, HardDrive, Code2,
  UserCog, Palette, Lock, Save, Camera,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";

/* ─── Sidebar config ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord" },
  { icon: <Users size={18} />, label: "Utilisateurs", chevron: true },
  { icon: <Briefcase size={18} />, label: "Emploi", chevron: true },
  { icon: <BookOpen size={18} />, label: "Formations", chevron: true },
  { icon: <Calendar size={18} />, label: "Événements", chevron: true },
  { icon: <Mic size={18} />, label: "Intervenants", chevron: true },
  { icon: <Handshake size={18} />, label: "Partenaires", chevron: true },
  { icon: <Newspaper size={18} />, label: "Presse", chevron: true },
  { icon: <HelpCircle size={18} />, label: "FAQ", chevron: true },
  { icon: <Bell size={18} />, label: "Notifications", chevron: true },
  { icon: <BarChart3 size={18} />, label: "Rapports", chevron: true },
  {
    icon: <Settings size={18} />, label: "Paramètres", active: true, chevron: true, expanded: true,
    subItems: ["Paramètres généraux", "Utilisateurs & accès", "Notifications", "Apparence", "Langue", "Sécurité", "Intégrations", "Sauvegardes"],
    activeSubIndex: 0,
  },
  { icon: <FileText size={18} />, label: "Contenus", chevron: true },
  { icon: <Share2 size={18} />, label: "Communication", chevron: true },
];

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
    value: "8", label: "Sections de paramètres", trend: "+0", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "32", label: "Utilisateurs actifs", trend: "+12%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
    value: "100%", label: "Sécurité configurée", trend: "+5%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    value: "6", label: "Notifications actives", trend: "+20%", bg: "#F0E8F5", color: "#6B21A8",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>,
    value: "4", label: "Intégrations connectées", trend: "+33%", bg: "#FFF3E8", color: "#E57617",
  },
];

/* ─── Tabs ─── */
const tabs = [
  { icon: <Settings size={13} />, label: "Paramètres généraux" },
  { icon: <UserCog size={13} />, label: "Utilisateurs & accès" },
  { icon: <Bell size={13} />, label: "Notifications" },
  { icon: <Palette size={13} />, label: "Apparence" },
  { icon: <Globe size={13} />, label: "Langue" },
  { icon: <Shield size={13} />, label: "Sécurité" },
  { icon: <Zap size={13} />, label: "Intégrations" },
  { icon: <Database size={13} />, label: "Sauvegardes" },
];

const systemStatus = [
  { icon: <Globe size={13} />, label: "Site web" },
  { icon: <Database size={13} />, label: "Base de données" },
  { icon: <Mail size={13} />, label: "Service email" },
  { icon: <HardDrive size={13} />, label: "Stockage de fichiers" },
  { icon: <Code2 size={13} />, label: "API" },
];

const quickConfig = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/></svg>, bg: "#E0F0FF", color: "#2563EB", title: "Gérer les utilisateurs", desc: "Ajouter, modifier et gérer les accès" },
  { icon: <Bell size={16} />, bg: "#F0E8F5", color: "#6B21A8", title: "Configurer les notifications", desc: "Paramètres des emails et alertes" },
  { icon: <Palette size={16} />, bg: "#FFF3E8", color: "#E57617", title: "Personnaliser l'apparence", desc: "Couleurs, logo et thème" },
  { icon: <Lock size={16} />, bg: "#FFF3E8", color: "#E57617", title: "Sécuriser votre compte", desc: "Mot de passe et authentification" },
  { icon: <Zap size={16} />, bg: "#E0F0FF", color: "#2563EB", title: "Connecter les intégrations", desc: "API, services externes" },
];

/* ─── Page ─── */
export default function AdminParametresPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex h-screen bg-[#f8faf9] overflow-hidden">
      <DashboardSidebar items={sidebarItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher un paramètre, une section, une configuration..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
        />

        <main className="flex-1 overflow-y-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1 text-[11px] text-[#61756B]">
            <span className="hover:text-[#10632D] cursor-pointer">Accueil</span>
            <ChevronRight size={12} />
            <span className="hover:text-[#10632D] cursor-pointer">Paramètres</span>
            <ChevronRight size={12} />
            <span className="font-medium text-[#0a2e16]">Paramètres généraux</span>
          </div>

          {/* Welcome Banner */}
          <div className="relative mb-5 h-[150px] overflow-hidden rounded-2xl">
            <Image src="/sane_deal.png" alt="Banner" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8">
              <div className="max-w-[55%]">
                <h1 className="text-[22px] font-extrabold text-[#0a2e16] leading-tight">Paramètres du système</h1>
                <p className="mt-1 text-[11px] text-[#61756B] leading-relaxed">
                  Configurez votre plateforme SANE selon vos besoins. Gérez les informations générales,<br/>
                  la sécurité, les notifications et les préférences de votre organisation.
                </p>
              </div>
              <div className="absolute right-8 flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <svg width="44" height="44" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#10632D"/>
                    <text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANE</text>
                    <path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <p className="text-[9px] font-semibold text-[#61756B] uppercase tracking-widest">SALON</p>
                    <p className="text-[9px] font-semibold text-[#61756B] uppercase tracking-widest">SALON NATIONAL DE L&apos;EMPLOI</p>
                  </div>
                </div>
                <p className="text-[22px] font-bold italic text-[#0a2e16]" style={{ fontFamily: "Georgia, serif" }}>Un Niger</p>
                <p className="text-[22px] font-bold italic text-[#E57617]" style={{ fontFamily: "Georgia, serif" }}>de Talents</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-5 grid grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} {...s} />
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-5 flex items-center gap-0 border-b border-[#DDE8E0] overflow-x-auto">
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === i
                    ? "border-[#10632D] text-[#10632D] font-semibold"
                    : "border-transparent text-[#61756B] hover:text-[#0a2e16]"
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content + Right Sidebar */}
          <div className="grid grid-cols-[1fr_280px] gap-4">
            {/* Form Card */}
            <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h2 className="text-[15px] font-bold text-[#0a2e16]">Informations de l&apos;organisation</h2>
                  </div>
                  <p className="text-[11px] text-[#61756B] ml-6">Configurez les informations générales de votre plateforme.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-[#10632D] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#0a4a22]">
                  <Save size={12} />
                  Enregistrer les modifications
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-8">
                {/* Left fields */}
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Nom de la plateforme <span className="text-red-500">*</span></label>
                    <input defaultValue="SANE" className="w-full rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Email de contact <span className="text-red-500">*</span></label>
                    <input defaultValue="contact@sane.ne" className="w-full rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Téléphone</label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg border border-[#DDE8E0] px-2 py-2 bg-white">
                        <span className="text-[14px]">🇳🇪</span>
                        <span className="text-[11px] text-[#0a2e16]">+227</span>
                        <ChevronRight size={11} className="text-[#61756B] rotate-90" />
                      </div>
                      <input defaultValue="20 72 35 10" className="flex-1 rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Adresse</label>
                    <input defaultValue="Niamey, Niger" className="w-full rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D]" />
                  </div>
                </div>

                {/* Right: logo / favicon / site / timezone */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-2 block">Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-[140px] items-center justify-center rounded-xl border border-[#DDE8E0] bg-white overflow-hidden px-3">
                        <svg width="120" height="48" viewBox="0 0 140 48">
                          <circle cx="24" cy="24" r="22" fill="#10632D"/>
                          <text x="24" y="29" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">SANE</text>
                          <path d="M6 6 Q24 0 42 6" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/>
                          <text x="52" y="20" fill="#0a2e16" fontSize="16" fontWeight="800" fontFamily="sans-serif">SANE</text>
                          <text x="52" y="31" fill="#61756B" fontSize="5.5" fontFamily="sans-serif">SALON</text>
                          <text x="52" y="39" fill="#61756B" fontSize="5" fontFamily="sans-serif">SALON NATIONAL DE L&apos;EMPLOI</text>
                        </svg>
                      </div>
                      <div>
                        <button className="flex items-center gap-1.5 rounded-lg border border-[#DDE8E0] px-3 py-1.5 text-[11px] font-semibold text-[#0a2e16] hover:bg-[#F5F9F6]">
                          <Camera size={12} /> Changer le logo
                        </button>
                        <p className="mt-1 text-[9px] text-[#61756B]">PNG, JPG ou SVG (max. 2 MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-2 block">Favicon</label>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E57617] bg-white text-[#E57617] font-bold text-[18px]" style={{ fontFamily: "Georgia, serif" }}>S</div>
                      <div>
                        <button className="flex items-center gap-1.5 rounded-lg border border-[#DDE8E0] px-3 py-1.5 text-[11px] font-semibold text-[#0a2e16] hover:bg-[#F5F9F6]">
                          <Camera size={12} /> Changer le favicon
                        </button>
                        <p className="mt-1 text-[9px] text-[#61756B]">PNG, ICO (max. 1 MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Site web</label>
                    <input defaultValue="https://www.sane.ne" className="w-full rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D]" />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Fuseau horaire</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D] bg-white">
                        <option>(GMT+01:00) Niamey</option>
                        <option>(GMT+00:00) UTC</option>
                        <option>(GMT+01:00) Paris</option>
                      </select>
                      <ChevronRight size={13} className="absolute right-3 top-2.5 text-[#61756B] pointer-events-none rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description full-width */}
              <div className="mt-4">
                <label className="text-[11px] font-semibold text-[#0a2e16] mb-1 block">Description</label>
                <textarea
                  defaultValue="Le Salon National de l'Emploi (SANE) est une plateforme qui connecte les talents nigériens aux opportunités d'emploi, de formation et de partenariat."
                  rows={3}
                  className="w-full rounded-lg border border-[#DDE8E0] px-3 py-2 text-[12px] text-[#0a2e16] outline-none focus:border-[#10632D] resize-none"
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Statut du système */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-4 bg-[#E57617]" />
                  <h3 className="text-[12px] font-bold text-[#0a2e16]">Statut du système</h3>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10632D] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#10632D]">Tous les services fonctionnent normalement</p>
                    <p className="text-[9px] text-[#61756B]">Dernière vérification : 12 Mars 2024 à 10:45</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 border-t border-[#DDE8E0] pt-3">
                  {systemStatus.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#61756B]">{s.icon}</span>
                      <span className="flex-1 text-[11px] text-[#0a2e16]">{s.label}</span>
                      <span className="rounded-md border border-[#10632D]/30 bg-[#E8F5ED] px-2 py-0.5 text-[9px] font-semibold text-[#10632D]">Actif</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration rapide */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-px w-4 bg-[#E57617]" />
                  <h3 className="text-[12px] font-bold text-[#0a2e16]">Configuration rapide</h3>
                </div>
                <p className="text-[9px] text-[#61756B] mb-3 ml-6">Accès rapide aux paramètres importants.</p>
                <div className="flex flex-col gap-2">
                  {quickConfig.map((q, i) => (
                    <button key={i} className="flex items-center gap-2.5 rounded-lg hover:bg-[#F5F9F6] p-1.5 text-left transition-all">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: q.bg, color: q.color }}>{q.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-[#10632D]">{q.title}</p>
                        <p className="text-[9px] text-[#61756B]">{q.desc}</p>
                      </div>
                      <ChevronRight size={13} className="text-[#61756B] shrink-0" />
                    </button>
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
