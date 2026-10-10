import { Banknote, Briefcase, Building2, ClipboardList, Globe, Handshake, Landmark, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FeatureBarItem } from "@/components/shared";

export const partnerStats: FeatureBarItem[] = [
  { value: "+50", label: "Partenaires" },
  { value: "+20", label: "Institutions publiques" },
  { value: "+25", label: "Entreprises privées" },
  { value: "+10", label: "Organisations internationales" },
];

export const partners: { name: string; abbr: string; color: string; logo?: string }[] = [
  { name: "République du Niger", abbr: "RN", color: "var(--sane-green-dark)", logo: "/niger_ministere_emploi.png" },
  { name: "OIT", abbr: "OIT", color: "var(--sane-c-1a5276)", logo: "/organisation_internationale_travail.png" },
  { name: "Banque Mondiale", abbr: "BM", color: "var(--sane-c-0066cc)" },
  { name: "AFD", abbr: "AFD", color: "var(--sane-c-e63946)", logo: "/afd.png" },
  { name: "UNESCO", abbr: "UN", color: "var(--sane-c-005c8a)" },
  { name: "PNUD", abbr: "PNUD", color: "var(--sane-c-0068b8)" },
  { name: "USAID", abbr: "US", color: "var(--sane-c-002868)" },
  { name: "GIZ", abbr: "GIZ", color: "var(--sane-c-007f3e)", logo: "/giz.png" },
  { name: "Enabel", abbr: "EN", color: "var(--sane-c-e30613)", logo: "/enabel.png" },
  { name: "The World Bank", abbr: "WB", color: "var(--sane-c-0066b2)" },
  { name: "Orange", abbr: "OR", color: "var(--sane-c-ff6600)" },
  { name: "TotalEnergies", abbr: "TE", color: "var(--sane-c-e4022a)" },
  { name: "Moov Africa", abbr: "MA", color: "var(--sane-c-00a0dc)" },
  { name: "Ecobank", abbr: "EB", color: "var(--sane-c-005a30)" },
  { name: "OFANO", abbr: "OF", color: "var(--sane-green)" },
];

export const partnerTypes: { icon: LucideIcon; title: string; items: string[]; color: string }[] = [
  {
    icon: Landmark,
    title: "Institutions publiques",
    items: ["Ministères et agences nationales", "Collectivités locales", "Programmes gouvernementaux"],
    color: "var(--sane-green)",
  },
  {
    icon: Building2,
    title: "Entreprises privées",
    items: ["Grandes entreprises", "PME et startups", "Secteurs stratégiques", "Recrutement et insertion"],
    color: "var(--sane-orange)",
  },
  {
    icon: Globe,
    title: "Organisations internationales",
    items: ["Coopération au développement", "Programmes d'emploi et formation", "Appui technique et financier", "Partage d'expertise"],
    color: "var(--sane-green)",
  },
  {
    icon: Handshake,
    title: "Société civile & Associations",
    items: ["ONG et réseaux professionnels", "Appui aux jeunes et aux femmes", "Inclusion sociale", "Initiatives locales"],
    color: "var(--sane-orange)",
  },
];

export const impactStats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Briefcase, value: "+1000", label: "Opportunités créées" },
  { icon: Users, value: "+20", label: "Programmes soutenus" },
  { icon: ClipboardList, value: "+30", label: "Projets réalisés" },
  { icon: Globe, value: "+100", label: "Experts mobilisés" },
];

export const testimonials: { quote: string; name: string; role: string; photo: string; icon: LucideIcon }[] = [
  {
    quote: "Le SANEM est un partenaire clé dans la promotion de l'emploi des jeunes au Niger. Cette initiative crée un véritable pont entre les talents et les opportunités.",
    name: "M. Harouna Moussa",
    role: "Ministère de l'Emploi",
    photo: "/sane-company3.webp",
    icon: Landmark,
  },
  {
    quote: "Notre collaboration avec le SANEM nous permet de renforcer nos actions de formation et d'insertion professionnelle des jeunes, en particulier des femmes.",
    name: "Mme Aissatou Diallo",
    role: "PNUD Niger",
    photo: "/Intervenants-card.webp",
    icon: Globe,
  },
  {
    quote: "Le SANEM incarne une vision ambitieuse pour l'avenir du Niger. Nous sommes fiers de soutenir cette plateforme qui favorise le dialogue entre les acteurs de l'emploi.",
    name: "M. Pierre Dubois",
    role: "AFD Niger",
    photo: "/sane-deal3.webp",
    icon: Banknote,
  },
];
