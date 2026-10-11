import {
  Briefcase, Building2, UserSearch, GraduationCap,
  UserPlus, Search as SearchIcon, Mail, ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoItem } from "@/components/shared";

export interface Partner {
  name: string;
  abbr: string;
  color: string;
  logo: string;
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
  { icon: UserSearch, title: "Postes à pourvoir", description: "+1000" },
  { icon: GraduationCap, title: "Secteurs d'activité", description: "+15" },
];

export const recruitingPartners: Partner[] = [
  { name: "République du Niger", abbr: "RN", color: "var(--sane-green-dark)", logo: "/niger_ministere_emploi.png" },
  { name: "Organisation Internationale du Travail", abbr: "OIT", color: "var(--sane-c-1a5276)", logo: "/organisation_internationale_travail.png" },
  { name: "Enabel", abbr: "EN", color: "var(--sane-c-e30613)", logo: "/enabel.png" },
  { name: "GIZ", abbr: "GIZ", color: "var(--sane-c-007f3e)", logo: "/giz.png" },
  { name: "AFD", abbr: "AFD", color: "var(--sane-c-e63946)", logo: "/afd.png" },
];

export const steps: Step[] = [
  { num: "01", icon: UserPlus, title: "Créez votre profil", desc: "Inscrivez-vous et complétez votre profil." },
  { num: "02", icon: SearchIcon, title: "Recherchez des offres", desc: "Trouvez les opportunités selon vos compétences." },
  { num: "03", icon: Mail, title: "Postulez en ligne", desc: "Envoyez votre candidature en quelques clics." },
  { num: "04", icon: ClipboardCheck, title: "Suivez votre candidature", desc: "Recevez des notifications et suivez l'état de votre dossier." },
];
