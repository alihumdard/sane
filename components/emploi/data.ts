import {
  Briefcase, Building2, Users, BarChart3,
  UserPlus, Search as SearchIcon, Mail, ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoItem } from "@/components/shared";

export interface Job {
  company: string;
  companyFull: string;
  title: string;
  location: string;
  contract: string;
  category: string;
  date: string;
  color: string;
}

export interface Sector {
  name: string;
  count: number;
}

export interface Partner {
  name: string;
  abbr: string;
  color: string;
}

export interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const emploiInfo: InfoItem[] = [
  { icon: Briefcase, title: "Offres d'emploi", description: "+500" },
  { icon: Building2, title: "Entreprises", description: "+200" },
  { icon: Users, title: "Postes à pourvoir", description: "+1000" },
  { icon: BarChart3, title: "Secteurs d'activité", description: "+15" },
];

export const jobs: Job[] = [
  { company: "Enabel", companyFull: "Enabel Niger", title: "Chargé de Communication", location: "Niamey", contract: "CDI", category: "Communication", date: "12 Mars 2024", color: "#e30613" },
  { company: "GIZ", companyFull: "GIZ Niger", title: "Développeur Web", location: "Niamey", contract: "CDD", category: "Informatique", date: "10 Mars 2024", color: "#007f3e" },
  { company: "BM", companyFull: "Banque Mondiale", title: "Spécialiste Suivi & Évaluation", location: "Niamey", contract: "CDI", category: "Gestion de projets", date: "08 Mars 2024", color: "#0066b2" },
  { company: "PNUD", companyFull: "PNUD Niger", title: "Assistant Administratif", location: "Niamey", contract: "CDD", category: "Administration", date: "05 Mars 2024", color: "#0068b8" },
  { company: "AFD", companyFull: "AFD Niger", title: "Expert en Formation", location: "Niamey", contract: "Consultant", category: "Formation", date: "02 Mars 2024", color: "#e63946" },
];

export const cities = ["Niamey", "Zinder", "Maradi", "Agadez", "Diffa", "Tahoua"];

export const sectors: Sector[] = [
  { name: "Administration & Gestion", count: 125 },
  { name: "Communication", count: 80 },
  { name: "Informatique & Digital", count: 95 },
  { name: "Éducation & Formation", count: 70 },
  { name: "Santé", count: 60 },
  { name: "Agriculture & Environnement", count: 55 },
  { name: "Projets & Développement", count: 110 },
  { name: "Autres secteurs", count: 45 },
];

export const recruitingPartners: Partner[] = [
  { name: "République du Niger", abbr: "RN", color: "#0a4a22" },
  { name: "Organisation Internationale du Travail", abbr: "OIT", color: "#1a5276" },
  { name: "Enabel", abbr: "EN", color: "#e30613" },
  { name: "GIZ", abbr: "GIZ", color: "#007f3e" },
  { name: "AFD", abbr: "AFD", color: "#e63946" },
];

export const secteurOptions = ["Secteur d'activité", "Administration", "Communication", "Informatique", "Formation", "Santé"];
export const lieuOptions = ["Lieu", "Niamey", "Zinder", "Maradi", "Agadez", "Diffa", "Tahoua"];
export const contratOptions = ["Type de contrat", "CDI", "CDD", "Consultant", "Stage"];

export const steps: Step[] = [
  { num: "01", icon: UserPlus, title: "Créez votre profil", desc: "Inscrivez-vous et complétez votre profil." },
  { num: "02", icon: SearchIcon, title: "Recherchez des offres", desc: "Trouvez les opportunités selon vos compétences." },
  { num: "03", icon: Mail, title: "Postulez en ligne", desc: "Envoyez votre candidature en quelques clics." },
  { num: "04", icon: ClipboardCheck, title: "Suivez votre candidature", desc: "Recevez des notifications et suivez l'état de votre dossier." },
];
