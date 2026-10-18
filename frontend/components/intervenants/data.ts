import { Building2, GraduationCap, Mic, Users } from "lucide-react";
import type { FeatureBarItem } from "@/components/shared";

export const speakerStats: FeatureBarItem[] = [
  { icon: Users, value: "+50", label: "Intervenants" },
  { icon: Building2, value: "+10", label: "Secteurs d'activité" },
  { icon: Mic, value: "+20", label: "Conférences" },
  { icon: GraduationCap, value: "+1000", label: "Participants" },
];

export interface Speaker {
  name: string;
  title: string;
  org: string;
  tags: string[];
  img: string;
  /** Longer presentation, shown on the speaker's own page. */
  bio?: string;
}

/**
 * The speaker's address, derived from their name.
 *
 * Written-in speakers carry no identifier of their own, and the ones from the
 * administration should read the same way in the address bar, so both are
 * addressed by a slug of the name rather than by a number.
 */
export function slugIntervenant(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const speakers: Speaker[] = [
  {
    name: "M. Ibrahim Maiga",
    title: "Directeur Général",
    org: "Ministère de l'Emploi",
    tags: ["Politiques publiques", "Emploi des jeunes"],
    img: "/sane-deal3.webp",
  },
  {
    name: "Mme Aïssatou Issa",
    title: "Directrice des Programmes",
    org: "ONG Internationale UNESCO",
    tags: ["Formation", "Inclusion"],
    img: "/card-img2.webp",
  },
  {
    name: "M. Moussa Alidou",
    title: "Expert en Développement",
    org: "Agence de Développement",
    tags: ["Innovation", "Entrepreneuriat"],
    img: "/sane-cv2.webp",
  },
  {
    name: "Mme Kadidia Salifou",
    title: "Responsable Communication",
    org: "SANEM",
    tags: ["Communication", "Partenariats"],
    img: "/sane-deal3.webp",
  },
  {
    name: "M. Salim Oumar",
    title: "Consultant RH",
    org: "Cabinet Conseil",
    tags: ["Ressources humaines", "Insertion professionnelle"],
    img: "/Transformation3.webp",
  },
  {
    name: "Mme Fatoumata Diallo",
    title: "Spécialiste en Formation",
    org: "UNESCO",
    tags: ["Éducation", "Compétences"],
    img: "/Leadership2.webp",
  },
  {
    name: "M. Abdoulaye Harouna",
    title: "Fondateur & CEO",
    org: "Tech Solutions",
    tags: ["Transformation digitale", "Entrepreneuriat"],
    img: "/card-2.webp",
  },
  {
    name: "M. Zakariou Idrissa",
    title: "Directeur Innovation",
    org: "Startup Niger",
    tags: ["Innovation", "Économie numérique"],
    img: "/sane-deal3.webp",
  },
];

export const ALL_SECTORS = "Tous les secteurs";
export const ALL_DOMAINS = "Tous les domaines";

export const secteurs = [ALL_SECTORS, "Emploi", "Formation", "Entrepreneuriat", "Innovation", "Communication", "Ressources humaines"];
export const domaines = [ALL_DOMAINS, "Politiques publiques", "Inclusion", "Transformation digitale", "Éducation", "Partenariats"];
