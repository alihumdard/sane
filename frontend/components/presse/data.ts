import { Camera, Newspaper, Palette, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
