import { Bell, Briefcase, Building2, CalendarCheck, FileText, Settings, User, UserSearch } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Role {
  key: string;
  title: string;
  icon: LucideIcon;
  desc: string;
  color: string;
}

export const roles: Role[] = [
  { key: "participant", title: "Participant", icon: User, desc: "Accédez aux formations, conférences, ateliers et opportunités d'emploi.", color: "var(--sane-orange)" },
  { key: "entreprise", title: "Entreprise", icon: Building2, desc: "Publiez vos offres d'emploi, rencontrez des talents et gérez vos candidatures.", color: "var(--sane-green)" },
  { key: "recruteur", title: "Recruteur", icon: UserSearch, desc: "Accédez aux profils, organisez des entretiens et suivez vos recrutements.", color: "var(--sane-orange)" },
  { key: "organisateur", title: "Organisateur", icon: Settings, desc: "Gérez vos événements, participants et contenus depuis votre espace.", color: "var(--sane-green)" },
];

export const features = [
  { icon: Briefcase, title: "Gérez votre profil", desc: "Mettez à jour vos informations" },
  { icon: FileText, title: "Suivez vos candidatures", desc: "Accédez aux offres et opportunités" },
  { icon: CalendarCheck, title: "Accédez à vos inscriptions", desc: "Formations, conférences et ateliers" },
  { icon: Bell, title: "Recevez des notifications", desc: "Restez informé en temps réel" },
];

export const connexionStats = [
  { value: "+1000", label: "Participants" },
  { value: "+100", label: "Entreprises" },
  { value: "+500", label: "Opportunités" },
];
