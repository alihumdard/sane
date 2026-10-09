import {
  GraduationCap, Users, BookOpen, Award,
  UserCheck, FileCheck, Briefcase,
  Mail, ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoItem } from "@/components/shared";

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
  Digital: "bg-[var(--sane-c-2b6cb0)] text-white",
  Entrepreneuriat: "bg-[var(--sane-orange)] text-white",
  Communication: "bg-[var(--sane-c-6b46c1)] text-white",
  Technologie: "bg-[var(--sane-c-0f766e)] text-white",
  Informatique: "bg-[var(--sane-blue-dark)] text-white",
  "Développement personnel": "bg-[var(--sane-c-92400e)] text-white",
  Finance: "bg-[var(--sane-red-dark)] text-white",
};

export const formationInfo: InfoItem[] = [
  { icon: GraduationCap, title: "Formations", description: "+20" },
  { icon: Users, title: "Participants", description: "+1000" },
  { icon: BookOpen, title: "Experts formateurs", description: "+50" },
  { icon: Award, title: "Certificats", description: "reconnus" },
];

export const domaines = ["Domaine de formation", "Management", "Digital", "Entrepreneuriat", "Communication", "Technologie", "Finance"];
export const niveaux = ["Niveau", "Débutant", "Intermédiaire", "Avancé"];
export const formats = ["Format", "Présentiel", "En ligne", "Hybride"];

/** Until the API serves uploaded images, fall back to a local one per category. */
export const imagesParCategorie: Record<string, string> = {
  Management: "/Leadership2.webp",
  Digital: "/Transformation3.webp",
  Entrepreneuriat: "/Entrepreneuriat.webp",
  Communication: "/sane-deal3.webp",
  Technologie: "/sane-company3.webp",
  Informatique: "/Transformation3.webp",
  "Développement personnel": "/sane-cv2.webp",
  Finance: "/Leadership2.webp",
};

export const imageParDefaut = "/Leadership2.webp";

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
  { q: "Les formations sont-elles payantes ?", a: "Non, toutes les formations du SANEM sont entièrement gratuites. Seul le nombre de places est limité." },
  { q: "Les formations sont-elles en ligne ?", a: "Nous proposons des formations en présentiel, en ligne et en format hybride selon les sessions." },
  { q: "Où se déroulent les formations ?", a: "Les formations en présentiel se déroulent au Palais des Congrès de Niamey et dans différentes salles partenaires." },
  { q: "Comment être informé des prochaines sessions ?", a: "Inscrivez-vous à notre newsletter ou suivez-nous sur les réseaux sociaux pour être informé en premier." },
];
