import {
  UserPlus, Search as SearchIcon, Mail, ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export const steps: Step[] = [
  { num: "01", icon: UserPlus, title: "Créez votre profil", desc: "Inscrivez-vous et complétez votre profil." },
  { num: "02", icon: SearchIcon, title: "Recherchez des offres", desc: "Trouvez les opportunités selon vos compétences." },
  { num: "03", icon: Mail, title: "Postulez en ligne", desc: "Envoyez votre candidature en quelques clics." },
  { num: "04", icon: ClipboardCheck, title: "Suivez votre candidature", desc: "Recevez des notifications et suivez l'état de votre dossier." },
];
