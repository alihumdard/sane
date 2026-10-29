import {
  BarChart3, Bell, BookOpen, Briefcase, Building2, CalendarDays, FileText,
  HelpCircle, Home, Mic, Newspaper, Settings, Share2, Handshake, UserCheck, Users,
} from "lucide-react";
import type { SidebarItem } from "@/components/dashboard/DashboardSidebar";

/**
 * The back-office menu, as routes.
 *
 * It used to be a list of section titles with seventy-odd sub-entries —
 * "Catégories d'emploi", "Rôles et permissions", "Tags", "Certificats",
 * "Sauvegardes" — matched against three lookup tables in the sidebar to
 * find out which ones led anywhere. Most led nowhere and were silently
 * dropped; a few survived as buttons that did nothing when clicked.
 *
 * Every entry here names its own page, so a link in the menu is a link to
 * something. Adding a page means adding a line.
 */
export type AccentNav = "green" | "orange" | "blue" | "teal";

export interface EntreeNav {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** One of the four validated accents — see app/globals.css. */
  accent: AccentNav;
  /** Heading this entry opens, when it starts a new family. */
  groupe?: string;
  /** Sub-entries, each with its own route. */
  sous?: { label: string; href: string }[];
}

export const SECTIONS_ADMIN: EntreeNav[] = [
  { label: "Tableau de bord", accent: "green", href: "/dashboard/admin", icon: <Home size={18} /> },
  {
    groupe: "Gestion",
    label: "Utilisateurs",
    accent: "blue",
    href: "/dashboard/admin/utilisateurs",
    icon: <Users size={18} />,
    sous: [
      { label: "Tous les comptes", href: "/dashboard/admin/utilisateurs" },
      { label: "Ajouter un compte", href: "/dashboard/admin/utilisateurs/nouveau" },
    ],
  },
  {
    label: "Emploi",
    accent: "green",
    href: "/dashboard/admin/emploi",
    icon: <Briefcase size={18} />,
    sous: [
      { label: "Offres d'emploi", href: "/dashboard/admin/emploi" },
      { label: "Entreprises", href: "/dashboard/admin/emploi?onglet=entreprises" },
      { label: "Entretiens", href: "/dashboard/admin/emploi?onglet=entretiens" },
      { label: "Candidatures", href: "/dashboard/admin/candidatures" },
    ],
  },
  {
    label: "Formations",
    accent: "orange",
    href: "/dashboard/admin/formations",
    icon: <BookOpen size={18} />,
    sous: [
      { label: "Toutes les formations", href: "/dashboard/admin/formations" },
      { label: "Ajouter une formation", href: "/dashboard/admin/formations/nouveau" },
      { label: "Inscriptions", href: "/dashboard/admin/inscriptions" },
    ],
  },
  {
    label: "Événements",
    accent: "teal",
    href: "/dashboard/admin/evenements",
    icon: <CalendarDays size={18} />,
    sous: [
      { label: "Éditions du salon", href: "/dashboard/admin/evenements" },
      { label: "Programme", href: "/dashboard/admin/programme" },
      { label: "Ajouter une session", href: "/dashboard/admin/programme/nouveau" },
    ],
  },
  {
    groupe: "Contenus du site",
    label: "Intervenants",
    accent: "orange",
    href: "/dashboard/admin/intervenants",
    icon: <Mic size={18} />,
    sous: [
      { label: "Tous les intervenants", href: "/dashboard/admin/intervenants" },
      { label: "Ajouter un intervenant", href: "/dashboard/admin/intervenants/nouveau" },
    ],
  },
  {
    label: "Partenaires",
    accent: "blue",
    href: "/dashboard/admin/partenaires",
    icon: <Handshake size={18} />,
    sous: [
      { label: "Tous les partenaires", href: "/dashboard/admin/partenaires" },
      { label: "Ajouter un partenaire", href: "/dashboard/admin/partenaires/nouveau" },
    ],
  },
  {
    label: "Actualités",
    accent: "green",
    href: "/dashboard/admin/actualites",
    icon: <Newspaper size={18} />,
    sous: [
      { label: "Toutes les actualités", href: "/dashboard/admin/actualites" },
      { label: "Ajouter une actualité", href: "/dashboard/admin/actualites/nouveau" },
    ],
  },
  {
    label: "Presse",
    accent: "teal",
    href: "/dashboard/admin/presse",
    icon: <Share2 size={18} />,
    sous: [
      { label: "Tous les éléments", href: "/dashboard/admin/presse" },
      { label: "Ajouter un élément", href: "/dashboard/admin/presse/nouveau" },
    ],
  },
  {
    label: "FAQ",
    accent: "orange",
    href: "/dashboard/admin/faq",
    icon: <HelpCircle size={18} />,
    sous: [
      { label: "Toutes les questions", href: "/dashboard/admin/faq" },
      { label: "Ajouter une question", href: "/dashboard/admin/faq/nouveau" },
    ],
  },
  { groupe: "Administration", label: "Notifications", accent: "blue", href: "/dashboard/admin/notifications", icon: <Bell size={18} /> },
  { label: "Rapports", accent: "teal", href: "/dashboard/admin/rapports", icon: <BarChart3 size={18} /> },
  { label: "Paramètres", accent: "green", href: "/dashboard/admin/parametres", icon: <Settings size={18} /> },
];

/** What the back-office search box can reach, by what the admin might type. */
export const CIBLES_RECHERCHE: { mots: string[]; label: string; href: string; icon: React.ReactNode }[] = [
  { mots: ["tableau", "bord", "accueil", "dashboard", "vue"], label: "Tableau de bord", href: "/dashboard/admin", icon: <Home size={14} /> },
  { mots: ["utilisateur", "compte", "membre", "role"], label: "Utilisateurs", href: "/dashboard/admin/utilisateurs", icon: <Users size={14} /> },
  { mots: ["offre", "emploi", "poste", "recrutement"], label: "Offres d'emploi", href: "/dashboard/admin/emploi", icon: <Briefcase size={14} /> },
  { mots: ["entreprise", "societe", "recruteur"], label: "Entreprises", href: "/dashboard/admin/emploi?onglet=entreprises", icon: <Building2 size={14} /> },
  { mots: ["candidature", "postulant", "candidat"], label: "Candidatures", href: "/dashboard/admin/candidatures", icon: <UserCheck size={14} /> },
  { mots: ["formation", "cours", "atelier"], label: "Formations", href: "/dashboard/admin/formations", icon: <BookOpen size={14} /> },
  { mots: ["inscription", "participant", "inscrit"], label: "Inscriptions", href: "/dashboard/admin/inscriptions", icon: <FileText size={14} /> },
  { mots: ["edition", "evenement", "salon", "date"], label: "Éditions", href: "/dashboard/admin/evenements", icon: <CalendarDays size={14} /> },
  { mots: ["programme", "session", "horaire"], label: "Programme", href: "/dashboard/admin/programme", icon: <CalendarDays size={14} /> },
  { mots: ["intervenant", "formateur", "orateur"], label: "Intervenants", href: "/dashboard/admin/intervenants", icon: <Mic size={14} /> },
  { mots: ["partenaire", "sponsor"], label: "Partenaires", href: "/dashboard/admin/partenaires", icon: <Handshake size={14} /> },
  { mots: ["actualite", "article", "news", "blog"], label: "Actualités", href: "/dashboard/admin/actualites", icon: <Newspaper size={14} /> },
  { mots: ["presse", "communique", "media"], label: "Presse", href: "/dashboard/admin/presse", icon: <Share2 size={14} /> },
  { mots: ["faq", "question"], label: "FAQ", href: "/dashboard/admin/faq", icon: <HelpCircle size={14} /> },
  { mots: ["notification", "email", "message"], label: "Notifications", href: "/dashboard/admin/notifications", icon: <Bell size={14} /> },
  { mots: ["rapport", "statistique", "export", "chiffre"], label: "Rapports", href: "/dashboard/admin/rapports", icon: <BarChart3 size={14} /> },
  { mots: ["parametre", "reglage", "contact", "reseau"], label: "Paramètres", href: "/dashboard/admin/parametres", icon: <Settings size={14} /> },
];

/** Same sidebar on every admin page; `active` is the current section label. */
export function adminNav(active: string): SidebarItem[] {
  return SECTIONS_ADMIN.map((s) => ({
    icon: s.icon,
    label: s.label,
    href: s.href,
    groupe: s.groupe,
    active: s.label === active,
    subItems: s.sous,
  }));
}
