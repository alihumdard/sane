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
}

export const speakers: Speaker[] = [
  {
    name: "M. Ibrahim Maiga",
    title: "Directeur Général",
    org: "Ministère de l'Emploi",
    tags: ["Politiques publiques", "Emploi des jeunes"],
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Mme Aïssatou Issa",
    title: "Directrice des Programmes",
    org: "ONG Internationale UNESCO",
    tags: ["Formation", "Inclusion"],
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "M. Moussa Alidou",
    title: "Expert en Développement",
    org: "Développement de Développement",
    tags: ["Innovation", "Entrepreneuriat"],
    img: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Mme Kadidia Salifou",
    title: "Responsable Communication",
    org: "SANEM",
    tags: ["Communication", "Partenariats"],
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "M. Salim Oumar",
    title: "Consultant RH",
    org: "Cabinet Conseil",
    tags: ["Ressources humaines", "Insertion professionnelle"],
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Mme Fatoumata Diallo",
    title: "Spécialiste en Formation",
    org: "UNESCO",
    tags: ["Éducation", "Compétences"],
    img: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    name: "M. Abdoulaye Harouna",
    title: "Fondateur & CEO",
    org: "Tech Solutions",
    tags: ["Transformation digitale", "Entrepreneuriat"],
    img: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "M. Zakariou Idrissa",
    title: "Directeur Innovation",
    org: "Startup Niger",
    tags: ["Innovation", "Économie numérique"],
    img: "https://randomuser.me/api/portraits/men/88.jpg",
  },
];

export const ALL_SECTORS = "Tous les secteurs";
export const ALL_DOMAINS = "Tous les domaines";

export const secteurs = [ALL_SECTORS, "Emploi", "Formation", "Entrepreneuriat", "Innovation", "Communication", "Ressources humaines"];
export const domaines = [ALL_DOMAINS, "Politiques publiques", "Inclusion", "Transformation digitale", "Éducation", "Partenariats"];
