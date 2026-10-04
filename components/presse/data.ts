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
    image: "/sane_deal.png",
    date: "12 Mars 2024",
    tag: "Communiqué",
    tagColor: "var(--sane-orange)",
    title: "Lancement officiel du SANE 2024 à Niamey",
    description: "Le Ministère de l'Emploi annonce la tenue de la prochaine édition du Salon National de l'Emploi au Palais des Congrès de Niamey.",
  },
  {
    image: "/hero-bg.png",
    date: "08 Mars 2024",
    tag: "Événement",
    tagColor: "var(--sane-green)",
    title: "Le SANE 2024 : un carrefour d'opportunités pour les talents nigériens",
    description: "Découvrez les temps forts, les objectifs et les innovations de cette nouvelle édition qui réunit entreprises, institutions et chercheurs d'emploi.",
  },
  {
    image: "/sane_deal.png",
    date: "05 Mars 2024",
    tag: "Presse",
    tagColor: "#1a5276",
    title: "Des formations pour renforcer l'employabilité des jeunes",
    description: "Le SANE met l'accent sur le développement des compétences à travers des formations adaptées aux besoins du marché.",
  },
];

export interface PressResource {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  button: string;
}

export const pressResources: PressResource[] = [
  { icon: Newspaper, color: "var(--sane-orange)", title: "Communiqués de presse", description: "Tous nos communiqués officiels au format PDF.", button: "Voir les communiqués" },
  { icon: Camera, color: "var(--sane-green)", title: "Photos officielles", description: "Photos libres de droit pour vos publications.", button: "Accéder aux photos" },
  { icon: Video, color: "var(--sane-orange)", title: "Vidéos et reportages", description: "Revivez les moments forts du SANE en vidéo.", button: "Voir les vidéos" },
  { icon: Palette, color: "var(--sane-green)", title: "Kit média", description: "Logos, visuels, charte graphique et documents officiels.", button: "Télécharger le kit" },
];

export const mediaLogos = [
  { name: "RTN", subtitle: "Télévision Nationale", color: "var(--sane-green-dark)" },
  { name: "Le Sahel", subtitle: "L'actualité du Niger", color: "#1a5276" },
  { name: "ANP", subtitle: "Agence Nigérienne de Presse", color: "var(--sane-green-deep)" },
  { name: "France 24", subtitle: "", color: "#005a9c" },
  { name: "RFI", subtitle: "", color: "#e4022a" },
  { name: "TV5MONDE", subtitle: "", color: "#003366" },
];
