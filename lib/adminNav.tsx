import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic, Handshake, Newspaper,
  Share2, HelpCircle, Bell, BarChart3, Settings,
} from "lucide-react";
import type { SidebarItem } from "@/components/dashboard/DashboardSidebar";

const SECTIONS: { label: string; icon: React.ReactNode; subItems?: string[] }[] = [
  { label: "Tableau de bord", icon: <Home size={18} /> },
  { label: "Utilisateurs", icon: <Users size={18} />, subItems: ["Tous les utilisateurs", "Participants", "Entreprises", "Recruteurs", "Organisateurs", "Administrateurs", "Rôles et permissions"] },
  { label: "Emploi", icon: <Briefcase size={18} />, subItems: ["Toutes les offres", "Ajouter une offre", "Catégories d'emploi", "Candidatures", "Entretiens", "Entreprises", "Statistiques"] },
  { label: "Formations", icon: <BookOpen size={18} />, subItems: ["Toutes les formations", "Ajouter une formation", "Catégories", "Sessions", "Formateurs", "Inscriptions", "Évaluations", "Certificats", "Statistiques"] },
  { label: "Événements", icon: <Calendar size={18} />, subItems: ["Tous les événements", "Ajouter un événement", "Programme", "Sessions", "Intervenants", "Inscriptions", "Participants", "Lieux", "Catégories"] },
  { label: "Intervenants", icon: <Mic size={18} />, subItems: ["Tous les intervenants", "Ajouter un intervenant", "Catégories", "Sessions", "Disponibilités", "Evaluations", "Invitations", "Statistiques"] },
  { label: "Partenaires", icon: <Handshake size={18} />, subItems: ["Tous les partenaires", "Ajouter un partenaire", "Catégories", "Types de partenariat", "Conventions", "Documents", "Statistiques"] },
  { label: "Actualités", icon: <Newspaper size={18} />, subItems: ["Toutes les actualités", "Ajouter une actualité", "Catégories", "Tags", "Commentaires", "Statistiques"] },
  { label: "Presse", icon: <Share2 size={18} />, subItems: ["Tous les communiqués", "Ajouter un communiqué", "Catégories", "Médias", "Dossiers de presse", "Couvertures médias", "Statistiques"] },
  { label: "FAQ", icon: <HelpCircle size={18} />, subItems: ["Toutes les questions", "Ajouter une question", "Catégories", "Pages FAQ", "Statistiques"] },
  { label: "Notifications", icon: <Bell size={18} />, subItems: ["Toutes les notifications", "Créer une notification", "Catégories", "Paramètres", "Statistiques"] },
  { label: "Rapports", icon: <BarChart3 size={18} />, subItems: ["Tous les rapports", "Générer un rapport", "Statistiques", "Rapports personnalisés", "Exporter des données"] },
  { label: "Paramètres", icon: <Settings size={18} />, subItems: ["Paramètres généraux", "Utilisateurs & accès", "Notifications", "Apparence", "Langue", "Sécurité", "Intégrations", "Sauvegardes"] },
];

/** Same sidebar on every admin page; `active` is the current section label. */
export function adminNav(active: string, activeSubIndex = 0): SidebarItem[] {
  return SECTIONS.map((s) => {
    const isActive = s.label === active;
    return {
      icon: s.icon,
      label: s.label,
      active: isActive,
      chevron: !!s.subItems,
      expanded: isActive && !!s.subItems,
      subItems: s.subItems,
      activeSubIndex: isActive ? activeSubIndex : undefined,
    };
  });
}
