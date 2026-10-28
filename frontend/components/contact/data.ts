import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FeatureBarItem } from "@/components/shared";

export const MAPS_QUERY = "Palais des Congres Niamey Niger";
export const MAPS_LINK = `https://maps.google.com/?q=${encodeURIComponent(MAPS_QUERY)}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;

export interface ContactInfoItem {
  icon: LucideIcon;
  title: string;
  value: string;
  hint: string;
  barLabel: string;
}

export const contactInfo: ContactInfoItem[] = [
  // No number written in: it comes from the organisation's settings, and an
  // entry with nothing behind it is not shown at all.
  { icon: Phone, title: "Téléphone", value: "", hint: "Lun – Ven : 8h – 17h", barLabel: "Appelez-nous" },
  { icon: Mail, title: "Email", value: "contact@sanem.ne", hint: "Nous répondons sous 24h", barLabel: "Envoyez un email" },
  // Like the phone: the address comes from the organisation's settings, and
  // an entry with nothing behind it is not shown at all.
  { icon: MapPin, title: "Adresse", value: "", hint: "Niamey, Niger", barLabel: "Notre localisation" },
  // The strip under the hero shows the value over the label, so the two must
  // differ: the tile read "Lun – Ven : 8h – 17h" twice, one above the other.
  { icon: Clock, title: "Horaires", value: "Lun – Ven : 8h – 17h", hint: "Samedi – Dimanche : Fermé", barLabel: "Nos horaires" },
];

/**
 * Same facts, shaped for the strip under the hero.
 *
 * Takes the resolved list rather than the declarations: computed from the
 * latter at module load, the strip kept showing the written-in address and an
 * empty phone while the page below showed what the organisers had entered.
 */
export function barreCoordonnees(coordonnees: ContactInfoItem[]): FeatureBarItem[] {
  return coordonnees.map((c) => ({ icon: c.icon, value: c.value, label: c.barLabel }));
}

export const sujets = ["Demande d'information", "Partenariat", "Inscription", "Formations", "Emploi", "Réclamation", "Autre"];
