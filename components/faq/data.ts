import { Briefcase, GraduationCap, Handshake, Headphones, Landmark, MessageCircle, User, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FaqEntry, FeatureBarItem } from "@/components/shared";

export interface FaqCategory {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const faqCategories: FaqCategory[] = [
  { key: "generalites", icon: Landmark, title: "Généralités", subtitle: "Questions sur le SANE" },
  { key: "inscriptions", icon: User, title: "Inscriptions", subtitle: "Participation et accès" },
  { key: "formations", icon: GraduationCap, title: "Formations", subtitle: "Programmes et certificats" },
  { key: "emploi", icon: Briefcase, title: "Emploi", subtitle: "Offres et opportunités" },
  { key: "partenaires", icon: Handshake, title: "Partenaires", subtitle: "Collaborations et soutien" },
];

export const faqData: Record<string, FaqEntry[]> = {
  generalites: [
    { question: "Qu'est-ce que le Salon National de l'Emploi (SANE) ?", answer: "Le SANE est un événement national qui vise à connecter les talents, les entreprises, les institutions et les organisations pour favoriser l'emploi, la formation et le développement des compétences au Niger." },
    { question: "Quand et où se déroule le SANE ?", answer: "Le SANE se déroule annuellement à Niamey, Niger. Les dates exactes sont communiquées sur notre site et nos réseaux sociaux plusieurs mois à l'avance." },
    { question: "Qui peut participer au SANE ?", answer: "Le SANE est ouvert à tous : demandeurs d'emploi, étudiants, professionnels en reconversion, entreprises, institutions publiques et organisations internationales." },
    { question: "L'entrée au salon est-elle gratuite ?", answer: "Oui, l'accès au salon est entièrement gratuit pour les visiteurs et les demandeurs d'emploi. Certaines formations spécialisées peuvent nécessiter une inscription préalable." },
    { question: "Quels sont les objectifs du SANE ?", answer: "Les objectifs principaux sont de faciliter la mise en relation entre employeurs et demandeurs d'emploi, promouvoir la formation professionnelle, et contribuer au développement économique du Niger." },
    { question: "Comment puis-je contacter l'équipe organisatrice ?", answer: "Vous pouvez nous contacter via notre page Contact, par email à contact@sane.ne, ou par téléphone au +227 XX XX XX XX." },
  ],
  inscriptions: [
    { question: "Comment s'inscrire au SANE ?", answer: "L'inscription se fait en ligne via notre plateforme. Cliquez sur 'S'inscrire' dans le menu principal et suivez les étapes indiquées." },
    { question: "Y a-t-il une date limite d'inscription ?", answer: "Les inscriptions sont ouvertes jusqu'à la veille de l'événement, mais nous recommandons de s'inscrire le plus tôt possible pour bénéficier de toutes les activités." },
    { question: "Quels documents sont nécessaires ?", answer: "Une pièce d'identité valide et un CV à jour sont recommandés. Pour les entreprises, un document justificatif de l'entreprise est requis." },
    { question: "Puis-je m'inscrire à plusieurs activités ?", answer: "Oui, vous pouvez vous inscrire à autant d'activités que vous le souhaitez, dans la limite des places disponibles." },
    { question: "L'inscription est-elle gratuite ?", answer: "Oui, l'inscription au SANE est entièrement gratuite pour les visiteurs et demandeurs d'emploi." },
    { question: "Recevrai-je une confirmation de mon inscription ?", answer: "Oui, un email de confirmation vous sera envoyé avec votre badge d'accès et les détails pratiques de votre participation." },
  ],
  formations: [
    { question: "Quelles formations sont proposées ?", answer: "Le SANE propose des formations dans divers domaines : numérique, entrepreneuriat, langues, compétences techniques, développement personnel et leadership." },
    { question: "Comment choisir la formation adaptée ?", answer: "Consultez notre catalogue de formations en ligne et utilisez les filtres par domaine, niveau et durée pour trouver la formation qui correspond à vos besoins." },
    { question: "Les formations sont-elles certifiantes ?", answer: "Certaines formations délivrent des certificats reconnus. Les détails sont précisés dans la description de chaque formation." },
    { question: "Qui sont les formateurs ?", answer: "Nos formateurs sont des experts reconnus dans leurs domaines respectifs, issus d'entreprises, d'universités et d'organisations internationales." },
    { question: "Puis-je suivre une formation en ligne ?", answer: "Oui, certaines formations sont disponibles en format hybride ou entièrement en ligne. Consultez le programme pour les options disponibles." },
  ],
  emploi: [
    { question: "Comment accéder aux offres d'emploi ?", answer: "Les offres d'emploi sont disponibles dans la section 'Emploi' de notre site. Vous pouvez filtrer par secteur, localisation et type de contrat." },
    { question: "Les entreprises recrutent-elles sur place ?", answer: "Oui, de nombreuses entreprises effectuent des entretiens et du recrutement directement pendant le salon." },
    { question: "Puis-je déposer mon CV en ligne ?", answer: "Oui, vous pouvez créer votre profil et déposer votre CV sur notre plateforme pour être visible par les recruteurs." },
    { question: "Y a-t-il un accompagnement pour les jeunes ?", answer: "Oui, des conseillers en insertion professionnelle sont disponibles pour accompagner les jeunes dans leur recherche d'emploi et leur orientation." },
    { question: "Les offres sont-elles accessibles après le salon ?", answer: "Oui, les offres d'emploi restent disponibles sur notre plateforme en ligne après l'événement." },
  ],
  partenaires: [
    { question: "Comment devenir partenaire du SANE ?", answer: "Contactez-nous via notre formulaire de partenariat ou écrivez-nous à partenaires@sane.ne pour discuter des modalités de collaboration." },
    { question: "Quels sont les avantages du partenariat ?", answer: "Les partenaires bénéficient d'une visibilité accrue, d'un accès privilégié aux talents, et contribuent directement au développement de l'emploi au Niger." },
    { question: "Quels types de partenariats proposez-vous ?", answer: "Nous proposons des partenariats institutionnels, financiers, techniques et médiatiques, adaptés aux objectifs de chaque organisation." },
    { question: "Les ONG peuvent-elles participer ?", answer: "Oui, les ONG et organisations de la société civile sont les bienvenues en tant que partenaires ou exposants." },
    { question: "Comment sponsoriser un événement spécifique ?", answer: "Contactez notre équipe partenariats pour découvrir les opportunités de sponsoring disponibles pour les différents événements du SANE." },
  ],
};

export const faqStats: FeatureBarItem[] = [
  { icon: MessageCircle, value: String(Object.values(faqData).flat().length), label: "Questions fréquentes" },
  { icon: Users, value: String(faqCategories.length), label: "Thématiques principales" },
  { icon: Zap, value: "Réponses rapides", label: "et claires" },
  { icon: Headphones, value: "Notre équipe", label: "à votre écoute" },
];
