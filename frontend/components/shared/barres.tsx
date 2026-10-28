"use client";

import {
  Award, BookOpen, Briefcase, Building2, CalendarDays, Camera, FileText, GraduationCap,
  Handshake, Headphones, MapPin, MessageCircle, Mic, Newspaper, UserSearch, Users, Video, Zap,
} from "lucide-react";
import { BarreStatistiques, type Compteur } from "./BarreStatistiques";
import { datesEdition } from "@/lib/statistiques";

/*
 * One strip per page, each reading the live figures.
 *
 * They live together in a client module because a counter names an icon and a
 * way to read its value — both functions, and a function cannot be handed
 * from a server page to a client component.
 *
 * What they replaced: "+500 Offres d'emploi" and "+200 Entreprises" above
 * twelve real offers, "+0 Postes à pourvoir" and "+0 Secteurs" that looked
 * live and sat at zero, "+48" press mentions against four records, "+50
 * Intervenants" against eight.
 */

const EMPLOI: Compteur[] = [
  { icon: Briefcase, label: "Offres d'emploi", valeur: (s) => s.emploi.offres },
  { icon: Building2, label: "Entreprises", valeur: (s) => s.emploi.entreprises },
  { icon: GraduationCap, label: "Secteurs d'activité", valeur: (s) => s.emploi.secteurs },
  { icon: UserSearch, label: "Candidats inscrits", valeur: (s) => s.participation.inscriptions },
];

const FORMATIONS: Compteur[] = [
  { icon: GraduationCap, label: "Formations", valeur: (s) => s.formations.total },
  { icon: Users, label: "Places ouvertes", valeur: (s) => s.formations.places },
  { icon: BookOpen, label: "Formateurs", valeur: (s) => s.formations.formateurs },
  { icon: Award, label: "Certificats", valeur: () => "reconnus" },
];

const PRESSE: Compteur[] = [
  { icon: Newspaper, label: "Communiqués et articles", valeur: (s) => s.presse.articles },
  { icon: Video, label: "Médias cités", valeur: (s) => s.presse.medias },
  { icon: FileText, label: "Partenaires", valeur: (s) => s.participation.partenaires },
  { icon: Camera, label: "Formations", valeur: (s) => s.formations.total },
];

const FAQ: Compteur[] = [
  { icon: MessageCircle, label: "Questions fréquentes", valeur: (s) => s.faq.questions },
  { icon: Users, label: "Thématiques", valeur: (s) => s.faq.categories },
  { icon: Zap, label: "et claires", valeur: () => "Réponses rapides" },
  { icon: Headphones, label: "à votre écoute", valeur: () => "Notre équipe" },
];

const PARTENAIRES: Compteur[] = [
  { icon: Handshake, label: "Partenaires", valeur: (s) => s.participation.partenaires },
  { icon: Building2, label: "Entreprises vérifiées", valeur: (s) => s.emploi.entreprises },
  { icon: Briefcase, label: "Offres publiées", valeur: (s) => s.emploi.offres },
  { icon: GraduationCap, label: "Formations", valeur: (s) => s.formations.total },
];

const INTERVENANTS: Compteur[] = [
  { icon: Users, label: "Intervenants annoncés", valeur: (s) => s.formations.formateurs },
  { icon: Building2, label: "Entreprises présentes", valeur: (s) => s.emploi.entreprises },
  { icon: Mic, label: "Sessions au programme", valeur: (s) => s.programme.sessions },
  { icon: GraduationCap, label: "Participants inscrits", valeur: (s) => s.participation.inscriptions },
];

const A_PROPOS: Compteur[] = [
  { icon: CalendarDays, label: "Date", valeur: (s) => datesEdition(s) },
  { icon: MapPin, label: "Lieu", valeur: (s) => s.edition?.lieu ?? null },
  { icon: Users, label: "Inscrits", valeur: (s) => s.participation.inscriptions },
  { icon: Mic, label: "Sessions", valeur: (s) => s.programme.sessions },
];

export const BarreAPropos = () => <BarreStatistiques compteurs={A_PROPOS} forme="info" />;
export const BarreEmploi = () => <BarreStatistiques compteurs={EMPLOI} forme="info" />;
export const BarreFormations = () => <BarreStatistiques compteurs={FORMATIONS} forme="info" />;
export const BarrePresse = () => <BarreStatistiques compteurs={PRESSE} />;
export const BarreFaq = () => <BarreStatistiques compteurs={FAQ} />;
export const BarrePartenaires = () => <BarreStatistiques compteurs={PARTENAIRES} variant="plain" />;
export const BarreIntervenants = () => <BarreStatistiques compteurs={INTERVENANTS} />;
