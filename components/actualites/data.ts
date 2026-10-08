export interface CategoryTab {
  key: string;
  title: string;
  subtitle: string;
  iconPath: string;
}

export const categoryTabs: CategoryTab[] = [
  { key: "tous", title: "Tous", subtitle: "Les actualités", iconPath: "M4 4h16v12H4zm0 12l4-4 2 2 4-4 6 6" },
  { key: "evenements", title: "Événements", subtitle: "Conférences et rencontres", iconPath: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { key: "communiques", title: "Communiqués", subtitle: "Annonces officielles", iconPath: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
  { key: "partenariats", title: "Partenariats", subtitle: "Collaborations", iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { key: "formations", title: "Formations", subtitle: "Programmes et sessions", iconPath: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3l4 2 4-2" },
  { key: "temoignages", title: "Témoignages", subtitle: "Parcours inspirants", iconPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
];

export const categoryLabels: Record<string, string> = {
  evenements: "Événement",
  communiques: "Communiqué",
  partenariats: "Partenariat",
  formations: "Formation",
  temoignages: "Témoignage",
};

export const tagColors: Record<string, string> = {
  evenements: "var(--sane-orange)",
  communiques: "var(--sane-c-1a5276)",
  partenariats: "var(--sane-orange)",
  formations: "var(--sane-green)",
  temoignages: "var(--sane-green)",
};

export interface NewsArticle {
  image: string;
  date: string;
  iso: string;
  category: string;
  title: string;
  description: string;
}

export const articles: NewsArticle[] = [
  {
    image: "/sane_deal.webp",
    date: "12 Mars 2024",
    iso: "2024-03-12",
    category: "evenements",
    title: "Lancement officiel du SANEM 2024 à Niamey",
    description: "Le Ministère de l'Emploi annonce la tenue de la prochaine édition du Salon National de l'Emploi au Palais des Congrès de Niamey.",
  },
  {
    image: "/hero-bg.webp",
    date: "08 Mars 2024",
    iso: "2024-03-08",
    category: "formations",
    title: "Le SANEM 2024 : un carrefour d'opportunités pour les jeunes",
    description: "Découvrez les objectifs, les temps forts et les innovations de cette nouvelle édition qui réunit entreprises, institutions et chercheurs d'emploi.",
  },
  {
    image: "/sane_deal.webp",
    date: "05 Mars 2024",
    iso: "2024-03-05",
    category: "partenariats",
    title: "Le SANEM renforce ses partenariats internationaux",
    description: "De nouvelles collaborations pour soutenir l'emploi, la formation et l'insertion professionnelle des jeunes nigériens.",
  },
  {
    image: "/hero-bg.webp",
    date: "28 Février 2024",
    iso: "2024-02-28",
    category: "temoignages",
    title: "Ils ont trouvé leur opportunité grâce au SANEM",
    description: "Découvrez les témoignages inspirants des jeunes qui ont pu bénéficier d'opportunités d'emploi et de formation.",
  },
  {
    image: "/sane_deal.webp",
    date: "20 Février 2024",
    iso: "2024-02-20",
    category: "formations",
    title: "Des formations adaptées aux besoins du marché",
    description: "Le SANEM met l'accent sur des formations pratiques et certifiantes pour renforcer l'employabilité des jeunes.",
  },
  {
    image: "/hero-bg.webp",
    date: "15 Février 2024",
    iso: "2024-02-15",
    category: "communiques",
    title: "Communiqué officiel du SANEM",
    description: "Retrouvez les dernières annonces et informations importantes concernant l'organisation de l'événement.",
  },
];

export const popularArticles = [
  { title: "Lancement officiel du SANEM 2024 à Niamey", date: "12 Mars 2024", image: "/sane_deal.webp" },
  { title: "Des formations pour les jeunes nigériens", date: "05 Mars 2024", image: "/hero-bg.webp" },
  { title: "Le SANEM renforce ses partenariats", date: "28 Février 2024", image: "/sane_deal.webp" },
  { title: "Témoignages de participants", date: "20 Février 2024", image: "/hero-bg.webp" },
];

export const upcomingEvents = [
  { title: "Conférence sur l'emploi des jeunes", date: "10 Avril 2024", location: "Niamey, Niger" },
  { title: "Atelier de formation digitale", date: "15 Avril 2024", location: "Niamey, Niger" },
  { title: "Rencontres B2B entreprises - talents", date: "20 Avril 2024", location: "Niamey, Niger" },
];
