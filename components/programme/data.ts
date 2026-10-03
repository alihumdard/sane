import {
  CalendarDays,
  MapPin,
  UsersRound,
  Mic,
  FileText,
  MessageSquare,
  GraduationCap,
  Users,
  Briefcase,
  Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoItem } from "@/components/shared";

export type SessionTag =
  | "Accueil"
  | "Cérémonie"
  | "Conférence"
  | "Panel"
  | "Networking"
  | "Formation"
  | "Recrutement";

export interface Session {
  time: string;
  title: string;
  /** Rendered as a paragraph; an array renders as a bulleted list. */
  description: string | string[];
  tag: SessionTag;
  location: string;
  image: string;
}

export interface ProgrammeDocument {
  title: string;
  format: string;
  href: string;
  icon: LucideIcon;
}

export const tagStyles: Record<SessionTag, string> = {
  Accueil: "bg-[#eaf5ee] text-[var(--sane-green)]",
  Cérémonie: "bg-[#fff3e8] text-[var(--sane-orange)]",
  Conférence: "bg-[#e8f0ff] text-[#2B6CB0]",
  Panel: "bg-[#f3e8ff] text-[#6B46C1]",
  Networking: "bg-[#e8fff3] text-[#0F766E]",
  Formation: "bg-[#fef3c7] text-[#92400E]",
  Recrutement: "bg-[#fee2e2] text-[#B91C1C]",
};

export const eventInfo: InfoItem[] = [
  { icon: CalendarDays, title: "Date", description: "À confirmer" },
  { icon: MapPin, title: "Lieu", description: "Niamey, Niger" },
  { icon: UsersRound, title: "Participants", description: "+1000 attendus" },
  { icon: Mic, title: "Sessions", description: "Conférences, formations, réseautage, recrutement" },
];

export interface Filter {
  label: string;
  icon: LucideIcon;
  /** Session tag this filter matches; omitted for the "show all" filter. */
  tag?: SessionTag;
}

export const filters: Filter[] = [
  { label: "Programme complet", icon: CalendarDays },
  { label: "Conférences", icon: MessageSquare, tag: "Conférence" },
  { label: "Formations", icon: GraduationCap, tag: "Formation" },
  { label: "Panels", icon: Users, tag: "Panel" },
  { label: "Recrutement", icon: Briefcase, tag: "Recrutement" },
  { label: "Networking", icon: Network, tag: "Networking" },
];

export const sessions: Session[] = [
  {
    time: "08:00 – 09:00",
    title: "Accueil & Inscriptions",
    description: "Accueil des participants, remise des badges et documents.",
    tag: "Accueil",
    location: "Hall principal",
    image: "/sane_deal.png",
  },
  {
    time: "09:00 – 09:30",
    title: "Cérémonie d'ouverture",
    description: "Allocutions officielles et présentation des objectifs du SANE.",
    tag: "Cérémonie",
    location: "Grande salle",
    image: "/sane_company.png",
  },
  {
    time: "09:30 – 10:30",
    title: "Conférence inaugurale",
    description: [
      "« L'emploi des jeunes : enjeux et perspectives pour le Niger »",
      "Avec des experts nationaux et internationaux.",
    ],
    tag: "Conférence",
    location: "Grande salle",
    image: "/sane_deal.png",
  },
  {
    time: "11:00 – 12:30",
    title: "Panels thématiques",
    description: [
      "Transformation digitale et nouveaux métiers",
      "Entrepreneuriat des jeunes",
      "Compétences pour l'avenir",
    ],
    tag: "Panel",
    location: "Salles thématiques",
    image: "/sane_cv.png",
  },
  {
    time: "12:30 – 14:00",
    title: "Pause-déjeuner & réseautage",
    description: "Un moment d'échange entre participants, entreprises et institutions.",
    tag: "Networking",
    location: "Espace détente",
    image: "/sane_company.png",
  },
  {
    time: "14:00 – 16:00",
    title: "Sessions de formation",
    description: "Ateliers pratiques animés par des experts du secteur.",
    tag: "Formation",
    location: "Salles de formation",
    image: "/sane_deal.png",
  },
  {
    time: "16:00 – 17:30",
    title: "Sessions de recrutement",
    description: "Rencontrez directement des recruteurs et déposez vos CV.",
    tag: "Recrutement",
    location: "Espace recrutement",
    image: "/sane_cv.png",
  },
  {
    time: "17:30 – 18:00",
    title: "Cérémonie de clôture",
    description: "Synthèse de la journée et prochaines étapes.",
    tag: "Cérémonie",
    location: "Grande salle",
    image: "/sane_company.png",
  },
];

export const documents: ProgrammeDocument[] = [
  { title: "Programme du SANE", format: "PDF — 2,4 Mo", href: "#", icon: FileText },
  { title: "Guide du participant", format: "PDF — 1,1 Mo", href: "#", icon: FileText },
  { title: "Plan du site", format: "PDF — 800 Ko", href: "#", icon: FileText },
];
