import {
  GraduationCap, Users, BookOpen, Award,
  UserCheck, FileCheck, Briefcase,
  Mail, ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoItem } from "@/components/shared";

export interface Formation {
  tag: string;
  title: string;
  duree: string;
  places: string;
  lieu: string;
  img: string;
  /** sample values: edit them to match the real sessions */
  niveau: string;
  format: string;
}

export interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Faq {
  q: string;
  a: string;
}

export const tagColors: Record<string, string> = {
  Management: "bg-[var(--sane-green)] text-white",
  Digital: "bg-[#2B6CB0] text-white",
  Entrepreneuriat: "bg-[var(--sane-orange)] text-white",
  Communication: "bg-[#6B46C1] text-white",
  Technologie: "bg-[#0F766E] text-white",
  Informatique: "bg-[#1D4ED8] text-white",
  "Développement personnel": "bg-[#92400E] text-white",
  Finance: "bg-[#B91C1C] text-white",
};

export const formationInfo: InfoItem[] = [
  { icon: GraduationCap, title: "Formations", description: "+20" },
  { icon: Users, title: "Participants", description: "+1000" },
  { icon: BookOpen, title: "Experts formateurs", description: "+50" },
  { icon: Award, title: "reconnus", description: "Certificats" },
];

export const formations: Formation[] = [
  { tag: "Management", title: "Leadership & Management", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/Leadership.png", niveau: "Intermédiaire", format: "Présentiel" },
  { tag: "Digital", title: "Transformation Digitale", duree: "3 jours", places: "Places limitées", lieu: "Niamey", img: "/Transformation3.png", niveau: "Intermédiaire", format: "Hybride" },
  { tag: "Entrepreneuriat", title: "Entrepreneuriat des Jeunes", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/Entrepreneuriat.png", niveau: "Débutant", format: "Présentiel" },
  { tag: "Communication", title: "Techniques de Communication", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/sane_deal.png", niveau: "Débutant", format: "Présentiel" },
  { tag: "Technologie", title: "Compétences en Énergies Renouvelables", duree: "3 jours", places: "Places limitées", lieu: "Niamey", img: "/sane_company.png", niveau: "Avancé", format: "Présentiel" },
  { tag: "Informatique", title: "Compétences Digitales", duree: "3 jours", places: "Places limitées", lieu: "Niamey", img: "/Transformation3.png", niveau: "Débutant", format: "En ligne" },
  { tag: "Développement personnel", title: "Préparation à l'Emploi", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/sane cv2.png", niveau: "Débutant", format: "Hybride" },
  { tag: "Finance", title: "Gestion de Projet", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/Leadership.png", niveau: "Intermédiaire", format: "En ligne" },
];

export const domaines = ["Domaine de formation", "Management", "Digital", "Entrepreneuriat", "Communication", "Technologie", "Finance"];
export const niveaux = ["Niveau", "Débutant", "Intermédiaire", "Avancé"];
export const formats = ["Format", "Présentiel", "En ligne", "Hybride"];

export const whyItems: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: "Formations pratiques et adaptées au marché" },
  { icon: UserCheck, label: "Des formateurs experts et reconnus" },
  { icon: FileCheck, label: "Certification de participation" },
  { icon: Briefcase, label: "Meilleures opportunités d'emploi et d'entrepreneuriat" },
];

export const steps: Step[] = [
  { num: "01", icon: Users, title: "Choisissez votre formation", desc: "Parcourez notre catalogue et sélectionnez la formation qui vous intéresse." },
  { num: "02", icon: UserCheck, title: "Inscrivez-vous en ligne", desc: "Remplissez le formulaire d'inscription et confirmez votre participation." },
  { num: "03", icon: Mail, title: "Participez à la formation", desc: "Suivez les sessions avec nos formateurs experts." },
  { num: "04", icon: ClipboardCheck, title: "Obtenez votre certificat", desc: "Recevez une attestation de participation à la fin de la formation." },
];

export const faqs: Faq[] = [
  { q: "Qui peut s'inscrire aux formations ?", a: "Toute personne intéressée par le développement de ses compétences peut s'inscrire — demandeurs d'emploi, étudiants, professionnels." },
  { q: "Comment obtenir un certificat ?", a: "Un certificat de participation est remis à chaque participant ayant suivi l'intégralité de la formation." },
  { q: "Les formations sont-elles payantes ?", a: "Certaines formations sont gratuites, d'autres sont payantes. Les tarifs sont indiqués sur chaque fiche formation." },
  { q: "Les formations sont-elles en ligne ?", a: "Nous proposons des formations en présentiel, en ligne et en format hybride selon les sessions." },
  { q: "Où se déroulent les formations ?", a: "Les formations en présentiel se déroulent au Palais des Congrès de Niamey et dans différentes salles partenaires." },
  { q: "Comment être informé des prochaines sessions ?", a: "Inscrivez-vous à notre newsletter ou suivez-nous sur les réseaux sociaux pour être informé en premier." },
];
