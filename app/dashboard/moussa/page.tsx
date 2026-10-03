"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, User, BookOpen, Briefcase, FileText, Calendar,
  Heart, MessageSquare, Bell, Settings, ChevronRight,
  MapPin, Clock, Monitor, Bookmark, CheckCircle, Mail, Phone,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord", active: true },
  { icon: <User size={18} />, label: "Mon profil" },
  { icon: <BookOpen size={18} />, label: "Mes formations" },
  { icon: <Briefcase size={18} />, label: "Mes opportunités" },
  { icon: <FileText size={18} />, label: "Mes candidatures" },
  { icon: <Calendar size={18} />, label: "Mes entretiens" },
  { icon: <Heart size={18} />, label: "Mes favoris" },
  { icon: <MessageSquare size={18} />, label: "Mes messages", badge: 3 },
  { icon: <Bell size={18} />, label: "Mes notifications", badge: 5 },
  { icon: <Settings size={18} />, label: "Paramètres" },
];

/* ─── Stats ─── */
const statsData = [
  { icon: <BookOpen size={20} />, value: "3", label: "Formations en cours", color: "#8B5CF6", bg: "#F3F0FF" },
  { icon: <FileText size={20} />, value: "12", label: "Candidatures envoyées", color: "#3B82F6", bg: "#EFF6FF" },
  { icon: <Calendar size={20} />, value: "4", label: "Entretiens planifiés", color: "#10B981", bg: "#ECFDF5" },
  { icon: <Bookmark size={20} />, value: "2", label: "Offres sauvegardées", color: "#10632D", bg: "#E8F5ED" },
  { icon: <MessageSquare size={20} />, value: "5", label: "Nouveaux messages", color: "#8B5CF6", bg: "#F3F0FF" },
];

/* ─── Formations recommandées ─── */
const formations = [
  {
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=220&fit=crop",
    titre: "Compétences numériques pour l'emploi",
    organisme: "SANE · En ligne",
    duree: "6 semaines",
  },
  {
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=220&fit=crop",
    titre: "Gestion de projet",
    organisme: "IFAD · Niamey",
    duree: "4 semaines",
  },
  {
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=220&fit=crop",
    titre: "Entrepreneuriat des jeunes",
    organisme: "PNUD · Niamey",
    duree: "8 semaines",
  },
];

/* ─── Offres d'emploi ─── */
const offres = [
  { bg: "#1a3c8f", label: "PNUD", poste: "Assistant administratif", entreprise: "PNUD · Niamey", type: "Temps plein", domaine: "Administration", date: "Il y a 2 jours" },
  { bg: "#009FCA", label: "UNF", poste: "Chargé de communication", entreprise: "UNICEF · Niamey", type: "CDD", domaine: "Communication", date: "Il y a 3 jours" },
  { bg: "#10632D", label: "SN", poste: "Technicien informatique", entreprise: "Société Nationale · Niamey", type: "Temps plein", domaine: "Informatique", date: "Il y a 5 jours" },
  { bg: "#E57617", label: "ONG", poste: "Chargé de suivi-évaluation", entreprise: "ONG Locale · Niamey", type: "CDD", domaine: "Suivi & Évaluation", date: "Il y a 1 semaine" },
  { bg: "#004A99", label: "GIZ", poste: "Assistant projet", entreprise: "GIZ · Niamey", type: "Stage", domaine: "Gestion de projet", date: "Il y a 1 semaine" },
];

/* ─── Entretiens ─── */
const entretiens = [
  { day: "15", month: "Mar", titre: "Entretien - Assistant administratif", lieu: "PNUD · En ligne", heure: "10:00 - 10:30", mode: "video" },
  { day: "18", month: "Mar", titre: "Entretien - Technicien informatique", lieu: "Société Nationale · Niamey", heure: "14:00 - 14:30", mode: "person" },
  { day: "22", month: "Mar", titre: "Entretien - Chargé de communication", lieu: "UNICEF · En ligne", heure: "11:00 - 11:30", mode: "video" },
];

/* ─── Notifications ─── */
const notifs = [
  { color: "#10632D", bg: "#E8F5ED", icon: <CheckCircle size={14} />, title: "Votre candidature a été présélectionnée", time: "il y a 2 heures" },
  { color: "#8B5CF6", bg: "#F3F0FF", icon: <MessageSquare size={14} />, title: "Nouveau message de l'employeur UNICEF", time: "il y a 5 heures" },
  { color: "#E57617", bg: "#FFF3E8", icon: <Calendar size={14} />, title: "Rappel : Entretien demain à 10h", time: "il y a 1 jour" },
];

export default function MoussaDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une formation, une offre, un événement..."
          notificationCount={5}
          userName="Moussa Idrissa"
          userRole="Participant"
          userImage="https://randomuser.me/api/portraits/men/32.jpg"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">

          {/* ═══ HERO BANNER ═══ */}
          <div className="relative mb-4 overflow-hidden rounded-2xl min-h-[110px] sm:h-[160px]">
            <Image
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=400&fit=crop&q=90"
              alt="Hero"
              fill
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white from-30% via-white/50 via-50% to-transparent" />
            <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 items-center gap-2">
              <p className="text-[18px] italic text-[#E57617] font-semibold leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
            </div>
            <div className="relative z-20 p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2e16] mb-1">Bienvenue Moussa !</h1>
              <p className="hidden sm:block max-w-md text-[13px] text-[#61756B]">
                Découvrez de nouvelles opportunités, développez vos compétences<br />et construisez votre avenir avec le SANE.
              </p>
            </div>
          </div>

          {/* ═══ STATS ═══ */}
          <div className="mb-4 grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-[#DDE8E0] bg-white px-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[18px] font-extrabold text-[#0a2e16] leading-none">{s.value}</p>
                  <p className="text-[10px] text-[#61756B] truncate mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-[#10632D] font-semibold flex items-center gap-0.5 mt-0.5">
                    Voir <ChevronRight size={10} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ MAIN GRID ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 min-w-0">

              {/* Formations recommandées */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[14px] font-bold text-[#0a2e16]">Formations recommandées</h3>
                  </div>
                  <button className="text-[11px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">
                    Voir tout <ChevronRight size={11} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {formations.map((f, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-[#DDE8E0] bg-[#F5F9F6]">
                      <div className="relative h-[120px]">
                        <Image src={f.img} alt={f.titre} fill className="object-cover" />
                        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-[#10632D]">
                          Formation
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-[12px] font-bold text-[#0a2e16] leading-tight mb-1">{f.titre}</p>
                        <p className="text-[10px] text-[#61756B] flex items-center gap-1 mb-1">
                          <MapPin size={9} /> {f.organisme}
                        </p>
                        <div className="flex items-center gap-2 text-[9px] text-[#61756B] mb-3">
                          <span className="flex items-center gap-0.5"><Clock size={9} /> {f.duree}</span>
                          <span className="flex items-center gap-0.5 text-[#10632D]">
                            <CheckCircle size={9} /> Certificat
                          </span>
                        </div>
                        <button className="w-full rounded-lg bg-[#10632D] py-1.5 text-[11px] font-semibold text-white hover:bg-[#0a4a22]">
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dernières offres d'emploi */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[14px] font-bold text-[#0a2e16]">Dernières offres d'emploi</h3>
                  </div>
                  <button className="text-[11px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">
                    Voir tout <ChevronRight size={11} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <tbody>
                      {offres.map((o, i) => (
                        <tr key={i} className="border-b border-[#DDE8E0] last:border-0">
                          <td className="py-3 pr-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ backgroundColor: o.bg }}>
                              {o.label}
                            </div>
                          </td>
                          <td className="py-3 pr-3 min-w-[160px]">
                            <p className="text-[12px] font-bold text-[#0a2e16]">{o.poste}</p>
                            <p className="text-[10px] text-[#61756B]">{o.entreprise}</p>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="rounded-full bg-[#E8F5ED] px-2 py-0.5 text-[9px] font-semibold text-[#10632D]">{o.type}</span>
                              <span className="rounded-full bg-[#F5F9F6] px-2 py-0.5 text-[9px] font-semibold text-[#61756B]">{o.domaine}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-3 text-[10px] text-[#61756B] whitespace-nowrap">{o.date}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <button className="rounded-lg bg-[#10632D] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0a4a22] whitespace-nowrap">
                                Postuler
                              </button>
                              <button className="rounded-lg border border-[#DDE8E0] p-1.5 text-[#61756B] hover:bg-[#F5F9F6]">
                                <Bookmark size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="flex flex-col gap-4 min-w-0">

              {/* Mon profil */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[13px] font-bold text-[#0a2e16]">Mon profil</h3>
                  </div>
                  <button className="text-[10px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">
                    Voir mon profil <ChevronRight size={10} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Moussa"
                    width={56}
                    height={56}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="text-[14px] font-extrabold text-[#0a2e16]">Moussa Idrissa</p>
                    <p className="text-[11px] text-[#61756B]">Participant</p>
                    <div className="mt-1 flex flex-col gap-0.5">
                      <p className="text-[10px] text-[#61756B] flex items-center gap-1"><Mail size={10} /> moussa.idrissa@example.com</p>
                      <p className="text-[10px] text-[#61756B] flex items-center gap-1"><Phone size={10} /> +227 90 12 34 56</p>
                      <p className="text-[10px] text-[#61756B] flex items-center gap-1"><MapPin size={10} /> Niamey, Niger</p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-[#61756B]">Profil complété</span>
                    <span className="font-bold text-[#10632D]">80%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#DDE8E0]">
                    <div className="h-2 rounded-full bg-[#10632D]" style={{ width: "80%" }} />
                  </div>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#10632D] py-2 text-[11px] font-semibold text-[#10632D] hover:bg-[#F5F9F6]">
                  ✏ Compléter mon profil
                </button>
              </div>

              {/* Mes prochains entretiens */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[13px] font-bold text-[#0a2e16]">Mes prochains entretiens</h3>
                  </div>
                  <button className="text-[10px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">
                    Voir tout <ChevronRight size={10} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {entretiens.map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-12 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#E8F5ED]">
                        <span className="text-[15px] font-extrabold text-[#10632D] leading-none">{e.day}</span>
                        <span className="text-[8px] font-semibold text-[#10632D]">{e.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#0a2e16] leading-tight truncate">{e.titre}</p>
                        <p className="text-[9px] text-[#61756B] flex items-center gap-0.5"><MapPin size={8} /> {e.lieu}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-[9px] text-[#61756B] flex items-center gap-0.5"><Clock size={8} /> {e.heure}</span>
                          {e.mode === "video" ? (
                            <span className="flex items-center gap-0.5 rounded-full bg-[#E0F0FF] px-1.5 py-0.5 text-[8px] font-semibold text-[#2563EB]">
                              <Monitor size={8} /> En ligne
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 rounded-full bg-[#FFF3E8] px-1.5 py-0.5 text-[8px] font-semibold text-[#E57617]">
                              <MapPin size={8} /> Présentiel
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#DDE8E0]">
                        <ChevronRight size={12} className="text-[#61756B]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications récentes */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[13px] font-bold text-[#0a2e16]">Notifications récentes</h3>
                  </div>
                  <button className="text-[10px] font-semibold text-[#10632D] hover:text-[#E57617] flex items-center gap-1">
                    Voir tout <ChevronRight size={10} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {notifs.map((n, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: n.bg, color: n.color }}>
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight">{n.title}</p>
                        <p className="text-[9px] text-[#E57617] mt-0.5">{n.time}</p>
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: n.color }} />
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
