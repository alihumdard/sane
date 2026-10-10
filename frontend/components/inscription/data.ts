import { Calendar, Camera, Clock, FileText, GraduationCap, Handshake, BriefcaseBusiness, Mail, MapPin, Phone, Ticket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FaqEntry, FeatureBarItem } from "@/components/shared";

export const perks: FeatureBarItem[] = [
  { icon: Ticket, value: "Accès au salon", label: "Entrée gratuite", color: "var(--sane-orange)" },
  { icon: Handshake, value: "Rencontres", label: "Entreprises et recruteurs", color: "var(--sane-green)" },
  { icon: GraduationCap, value: "Formations", label: "Ateliers et conférences", color: "var(--sane-green)" },
  { icon: BriefcaseBusiness, value: "Opportunités", label: "Offres d'emploi exclusives", color: "var(--sane-orange)" },
];

export const steps = [
  { num: 1, label: "Participation", title: "Type de participation", desc: "Comment souhaitez-vous participer au SANEM ?" },
  { num: 2, label: "Informations personnelles", title: "Informations personnelles", desc: "Veuillez renseigner vos informations personnelles." },
  { num: 3, label: "Profil et parcours", title: "Profil et parcours", desc: "Dites-nous en plus sur votre situation et votre parcours." },
  { num: 4, label: "Formations", title: "Choix des formations", desc: "Sélectionnez les formations qui vous intéressent." },
  { num: 5, label: "Centres d'intérêt", title: "Centres d'intérêt", desc: "Choisissez les activités qui vous intéressent." },
  { num: 6, label: "Confirmation", title: "Confirmation", desc: "Vérifiez vos informations avant de valider." },
];

/** The formation step only applies to one type, so it is skipped for the others. */
export const STEP_FORMATIONS = 4;

export interface TypeParticipationOption {
  value: TypeParticipationValue;
  titre: string;
  description: string;
  icon: LucideIcon;
}

export type TypeParticipationValue =
  | "visiteur"
  | "participant_formation"
  | "entreprise"
  | "recruteur";

export const typeParticipationOptions: TypeParticipationOption[] = [
  {
    value: "visiteur",
    titre: "Visiteur",
    description: "Découvrir le salon, les stands et les conférences.",
    icon: Ticket,
  },
  {
    value: "participant_formation",
    titre: "Participant aux formations",
    description: "Suivre une ou plusieurs formations gratuites.",
    icon: GraduationCap,
  },
  {
    value: "entreprise",
    titre: "Entreprise",
    description: "Présenter votre entreprise et rencontrer des talents.",
    icon: BriefcaseBusiness,
  },
  {
    value: "recruteur",
    titre: "Recruteur",
    description: "Accéder aux profils et organiser des entretiens.",
    icon: Handshake,
  },
];

export const options = {
  genre: ["Homme", "Femme"],
  nationalite: ["Niger", "Nigeria", "Mali", "Burkina Faso", "Autre"],
  ville: ["Niamey", "Zinder", "Maradi", "Tahoua", "Agadez", "Autre"],
  niveau: ["Baccalauréat", "Licence", "Master", "Doctorat"],
  statut: ["Étudiant", "Demandeur d'emploi", "Salarié", "Entrepreneur", "Autre"],
  domaine: ["Informatique et numérique", "Gestion et finance", "Santé", "Agriculture", "Éducation", "Autre"],
  experience: ["Aucune", "Moins de 2 ans", "2 à 5 ans", "Plus de 5 ans"],
  source: ["Réseaux sociaux", "Presse", "Bouche-à-oreille", "Établissement ou employeur", "Autre"],
};

export const interestOptions = [
  "Offres d'emploi",
  "Formations",
  "Conférences",
  "Ateliers",
  "Rencontres B2B",
  "Entrepreneuriat",
  "Orientation professionnelle",
];

export const whyItems = [
  "Accès gratuit au salon",
  "Conférences et ateliers",
  "Rencontre avec des recruteurs",
  "Offres d'emploi exclusives",
];

export const practicalInfo: { icon: LucideIcon; title: string; lines: string[]; color: string }[] = [
  { icon: Calendar, title: "Date de l'événement", lines: ["10 Décembre 2026"], color: "var(--sane-green)" },
  { icon: MapPin, title: "Lieu", lines: ["Palais des Congrès de Niamey"], color: "var(--sane-orange)" },
  { icon: Clock, title: "Horaires", lines: ["08h00 – 17h00"], color: "var(--sane-green)" },
  { icon: Phone, title: "Contact", lines: ["contact@sanem.ne"], color: "var(--sane-orange)" },
];

export const documents: { icon: LucideIcon; title: string; desc: string; format: string; color: string }[] = [
  { icon: FileText, title: "Pièce d'identité", desc: "Carte nationale ou passeport", format: "Format : PDF, JPG (max 2 Mo)", color: "var(--sane-orange)" },
  { icon: FileText, title: "CV à jour", desc: "Votre curriculum vitae", format: "Format : PDF (max 2 Mo)", color: "var(--sane-green)" },
  { icon: Mail, title: "Lettre de motivation (optionnelle)", desc: "Pour certaines opportunités", format: "Format : PDF (max 2 Mo)", color: "var(--sane-orange)" },
  { icon: Camera, title: "Photo d'identité", desc: "Photo récente", format: "Format : JPG, PNG (max 2 Mo)", color: "var(--sane-green)" },
];

export const faqs: FaqEntry[] = [
  { question: "L'inscription est-elle gratuite ?", answer: "Oui, l'inscription au Salon National de l'Emploi est entièrement gratuite pour tous les participants." },
  { question: "Y a-t-il une date limite d'inscription ?", answer: "Les inscriptions sont ouvertes jusqu'à la veille de l'événement, mais nous recommandons de s'inscrire à l'avance." },
  { question: "Quels documents sont nécessaires ?", answer: "Une pièce d'identité valide et un CV à jour sont requis. La lettre de motivation est optionnelle." },
  { question: "Vais-je recevoir une confirmation ?", answer: "Oui, un email de confirmation avec votre badge sera envoyé après validation de votre inscription." },
  { question: "Puis-je m'inscrire à plusieurs activités ?", answer: "Oui, vous pouvez vous inscrire à autant d'activités que vous le souhaitez dans la limite des places disponibles." },
  { question: "Puis-je modifier mes informations après l'inscription ?", answer: "Oui, vous pourrez modifier vos informations depuis votre espace personnel jusqu'au jour de l'événement." },
];

export type RegistrationData = Record<string, string>;

export const emptyRegistration: RegistrationData = {
  type_participation: "", nom: "", naissance: "", email: "", telephone: "", genre: "", nationalite: "Niger",
  ville: "", niveau: "", statut: "", domaine: "", experience: "", parcours: "", source: "",
};
