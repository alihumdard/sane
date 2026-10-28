import { Building2, Globe, Handshake, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/*
 * The partners live in the database, entered from the back-office. Twenty
 * were written here and shown instead of the real ones, which the page never
 * reached.
 *
 * What stays is how to draw one that has no logo yet.
 */

/** A stable tint per name, so a logo-less partner is not grey among colours. */
const TEINTES = [
  "var(--sane-green-dark)",
  "var(--sane-c-1a5276)",
  "var(--sane-c-0066cc)",
  "var(--sane-c-e63946)",
  "var(--sane-c-005c8a)",
  "var(--sane-orange)",
];

export function couleurPartenaire(nom: string): string {
  const somme = [...nom].reduce((t, c) => t + c.charCodeAt(0), 0);

  return TEINTES[somme % TEINTES.length];
}

/** "Organisation Internationale du Travail" → "OIT". */
export function initiales(nom: string): string {
  const mots = nom.split(/\s+/).filter((m) => m.length > 2 && !/^(de|du|des|la|le|les|et|pour)$/i.test(m));

  return (mots.length > 1 ? mots.slice(0, 3).map((m) => m[0]).join("") : nom.slice(0, 3)).toUpperCase();
}

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
