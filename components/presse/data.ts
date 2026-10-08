import { Camera, FileText, Newspaper, Palette, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ArticleCardData, FeatureBarItem } from "@/components/shared";

export const pressStats: FeatureBarItem[] = [
  { icon: Newspaper, value: "+50", label: "Articles de presse" },
  { icon: FileText, value: "+20", label: "Communiqués officiels" },
  { icon: Video, value: "+30", label: "Reportages médias" },
  { icon: Camera, value: "+200", label: "Photos disponibles" },
];

export const pressArticles: ArticleCardData[] = [
  {
    image: "/sane-deal3.webp",
    date: "12 Mars 2024",
    tag: "Communiqué",
    tagColor: "var(--sane-orange)",
    title: "Lancement officiel du SANEM 2024 à Niamey",
    description: "Le Ministère de l'Emploi annonce la tenue de la prochaine édition du Salon National de l'Emploi au Palais des Congrès de Niamey.",
  },
  {
    image: "/hero-bg.webp",
    date: "08 Mars 2024",
    tag: "Événement",
    tagColor: "var(--sane-green)",
    title: "Le SANEM 2024 : un carrefour d'opportunités pour les talents nigériens",
    description: "Découvrez les temps forts, les objectifs et les innovations de cette nouvelle édition qui réunit entreprises, institutions et chercheurs d'emploi.",
  },
  {
    image: "/sane-deal3.webp",
    date: "05 Mars 2024",
    tag: "Presse",
    tagColor: "var(--sane-c-1a5276)",
    title: "Des formations pour renforcer l'employabilité des jeunes",
    description: "Le SANEM met l'accent sur le développement des compétences à travers des formations adaptées aux besoins du marché.",
  },
];

export interface PressResource {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  button: string;
  href: string;
}

export const pressResources: PressResource[] = [
  { icon: Newspaper, color: "var(--sane-orange)", title: "Communiqués de presse", description: "Tous nos communiqués officiels au format PDF.", button: "Voir les communiqués", href: "/contact" },
  { icon: Camera, color: "var(--sane-green)", title: "Photos officielles", description: "Photos libres de droit pour vos publications.", button: "Accéder aux photos", href: "/contact" },
  { icon: Video, color: "var(--sane-orange)", title: "Vidéos et reportages", description: "Revivez les moments forts du SANEM en vidéo.", button: "Voir les vidéos", href: "/contact" },
  { icon: Palette, color: "var(--sane-green)", title: "Kit média", description: "Logos, visuels, charte graphique et documents officiels.", button: "Télécharger le kit", href: "/contact" },
];

export const mediaLogos = [
  { name: "RTN", subtitle: "Télévision Nationale", color: "var(--sane-green-dark)" },
  { name: "Le Sahel", subtitle: "L'actualité du Niger", color: "var(--sane-c-1a5276)" },
  { name: "ANP", subtitle: "Agence Nigérienne de Presse", color: "var(--sane-green-deep)" },
  { name: "France 24", subtitle: "", color: "var(--sane-c-005a9c)" },
  { name: "RFI", subtitle: "", color: "var(--sane-c-e4022a)" },
  { name: "TV5MONDE", subtitle: "", color: "var(--sane-c-003366)" },
];
