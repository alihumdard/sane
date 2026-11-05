export const SITE_CONFIG = {
  name: "SANEM",
  fullName: "Salon National de l'Emploi",
  country: "Niger",
  // En dur et non lue de l'environnement : ce lien part à l'imprimeur. Lue
  // depuis .env, une affiche tirée à mille exemplaires depuis un poste de
  // développement porterait un code QR pointant sur localhost:3000.
  url: "https://sanem.ne",
  primaryColor: "var(--sane-green)",
  accentColor: "var(--sane-orange)",
};

export const NAVIGATION = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "À propos",
    href: "/a-propos",
  },
  {
    label: "Programme",
    href: "/programme",
  },
  {
    label: "Formations",
    href: "/formations",
  },
  {
    label: "Emploi",
    href: "/emploi",
  },
  {
    label: "Intervenants",
    href: "/intervenants",
  },
  {
    label: "Partenaires",
    href: "/partenaires",
  },
  {
    label: "Actualités",
    href: "/actualites",
  },
  {
    label: "Contact",
    href: "/contact",
  },
] as const;