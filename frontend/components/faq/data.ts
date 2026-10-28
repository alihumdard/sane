import { Briefcase, GraduationCap, Handshake, Landmark, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FaqCategory {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const faqCategories: FaqCategory[] = [
  { key: "generalites", icon: Landmark, title: "Généralités", subtitle: "Questions sur le SANEM" },
  { key: "inscriptions", icon: User, title: "Inscriptions", subtitle: "Participation et accès" },
  { key: "formations", icon: GraduationCap, title: "Formations", subtitle: "Programmes et certificats" },
  { key: "emploi", icon: Briefcase, title: "Emploi", subtitle: "Offres et opportunités" },
  { key: "partenaires", icon: Handshake, title: "Partenaires", subtitle: "Collaborations et soutien" },
];

/*
 * The questions live in the database, entered from the back-office. Twenty-
 * seven were written here and shown instead of the eleven the client had
 * actually added: editing the FAQ changed nothing on the site.
 *
 * The categories above stay, as the icon and the wording for a key the
 * records carry. A category nobody declared still gets a block, with the key
 * itself as its title.
 */

export function habillageCategorie(cle: string): FaqCategory {
  return (
    faqCategories.find((c) => c.key === cle) ?? {
      key: cle,
      icon: Landmark,
      title: cle.charAt(0).toUpperCase() + cle.slice(1),
      subtitle: "",
    }
  );
}

