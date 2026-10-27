export interface ApiFormation {
  id: number;
  titre: string;
  slug: string;
  description: string | null;
  prerequis: string | null;
  duree: string;
  lieu: string;
  niveau: string;
  format: string;
  image: string | null;
  date_debut: string | null;
  date_fin: string | null;
  categorie: { id: number; nom: string; slug: string } | null;
  formateur: { id: number; nom: string; fonction: string | null; photo: string | null } | null;
  /** Present only where the endpoint eager-loads it (the admin list does). */
  edition?: { id: number; annee: number };
  max_inscriptions: number;
  inscriptions_count: number;
  places_restantes: number;
  taux_remplissage: number;
  complete: boolean;
  publiee: boolean;
}

export interface FormationsResponse {
  data: ApiFormation[];
  meta: {
    total: number;
    edition: { id: number; annee: number; nom: string };
  };
  filtres: {
    niveaux: string[];
    formats: string[];
  };
}

export type TypeParticipation =
  | "visiteur"
  | "participant_formation"
  | "entreprise"
  | "recruteur";

export interface InscriptionPayload {
  type_participation: TypeParticipation;
  nom: string;
  naissance?: string;
  email: string;
  telephone: string;
  genre?: string;
  nationalite?: string;
  ville?: string;
  niveau?: string;
  statut_pro?: string;
  domaine?: string;
  experience?: string;
  parcours?: string;
  interets?: string[];
  source?: string;
  newsletter?: boolean;
  consentement: boolean;
  formations?: number[];
}

export interface ApiInscription {
  id: number;
  reference: string;
  type_participation: TypeParticipation;
  type_participation_label: string;
  statut: "en_attente" | "confirmee" | "annulee";
  statut_label: string;
  nom: string;
  naissance: string | null;
  email: string;
  telephone: string;
  genre: string | null;
  nationalite: string | null;
  ville: string | null;
  niveau: string | null;
  statut_pro: string | null;
  domaine: string | null;
  experience: string | null;
  parcours: string | null;
  interets: string[];
  source: string | null;
  newsletter: boolean;
  formations?: ApiFormation[];
  documents?: DocumentUpload[];
  confirmee_le: string | null;
  created_at: string;
}

export interface InscriptionResponse {
  message: string;
  data: ApiInscription;
}

/* ─── Pièces justificatives ─── */

export type TypeDocument = "piece_identite" | "cv" | "lettre_motivation" | "photo";

export interface DocumentUpload {
  id: number;
  type: TypeDocument;
  type_label: string;
  nom_original: string;
  mime: string;
  taille: number;
  taille_lisible: string;
  url: string;
  televerse_le: string;
}

/** Kept as an alias: both names are in use across the app. */
export type ApiDocument = DocumentUpload;

export interface DocumentsResponse {
  data: DocumentUpload[];
  manquants: { type: TypeDocument; label: string }[];
  attendus: DocumentAttendu[];
}

export interface DocumentUploadResponse {
  message: string;
  data: DocumentUpload;
  manquants: { type: TypeDocument; label: string }[];
}

/* ─── Portail emploi (Phase 5) ─── */

export type TypeContrat = "cdi" | "cdd" | "stage" | "consultant" | "alternance";
export type StatutOffre = "brouillon" | "publiee" | "pourvue" | "expiree" | "fermee";
export type NiveauCompetence = "debutant" | "intermediaire" | "avance" | "expert";

export type StatutCandidature =
  | "envoyee"
  | "en_revue"
  | "preselectionnee"
  | "entretien"
  | "acceptee"
  | "refusee";

export interface ApiEntreprise {
  id: number;
  nom: string;
  slug: string;
  secteur: string | null;
  taille: string | null;
  logo: string | null;
  site_web: string | null;
  description: string | null;
  ville: string | null;
  verifiee: boolean;
}

export interface ApiOffre {
  id: number;
  titre: string;
  slug: string;
  description: string;
  missions: string | null;
  profil_recherche: string | null;
  /** Up to two selection questions the employer asks every applicant. */
  question_1: string | null;
  question_2: string | null;
  type_contrat: TypeContrat;
  type_contrat_label: string;
  statut: StatutOffre;
  statut_label: string;
  secteur: string;
  ville: string;
  salaire_min: number | null;
  salaire_max: number | null;
  experience_requise: string | null;
  niveau_etude: string | null;
  date_limite: string | null;
  publiee_le: string | null;
  expiree: boolean;
  ouverte: boolean;
  vues: number;
  candidatures_count: number;
  entreprise?: ApiEntreprise;
  deja_postule?: boolean;
  en_favori?: boolean;
}

/** One filter value with its live count, as the API reports it. */
export interface FiltreValeur {
  valeur: string;
  /** What to show; `valeur` is what the query filters on. */
  libelle: string;
  total: number;
}

export interface OffresResponse {
  data: ApiOffre[];
  meta: PaginationMeta;
  filtres: {
    secteur: FiltreValeur[];
    ville: FiltreValeur[];
    type_contrat: FiltreValeur[];
  };
}

export interface ApiCompetence {
  id: number;
  nom: string;
  niveau: NiveauCompetence;
}

export interface ApiFormationAcademique {
  id: number;
  diplome: string;
  etablissement: string;
  domaine: string | null;
  annee_debut: number | null;
  annee_fin: number | null;
  en_cours: boolean;
}

export interface ApiExperience {
  id: number;
  poste: string;
  entreprise: string;
  lieu: string | null;
  date_debut: string;
  date_fin: string | null;
  en_poste: boolean;
  description: string | null;
}

export interface ApiProfilDemandeur {
  id: number;
  nom?: string;
  email?: string;
  telephone?: string | null;
  photo?: string | null;
  titre_pro: string | null;
  resume: string | null;
  secteur: string | null;
  ville: string | null;
  type_emploi: string | null;
  disponibilite: string | null;
  linkedin: string | null;
  portfolio: string | null;
  visible: boolean;
  competences?: ApiCompetence[];
  formations?: ApiFormationAcademique[];
  experiences?: ApiExperience[];
  documents?: ApiDocumentCandidature[];
  taux_completion?: number;
  /** True once the profile carries what an application requires. */
  peut_postuler?: boolean;
  /** What is still missing for that: "cv", "formation". */
  manque_pour_postuler?: string[];
}

export interface ApiDocumentCandidature {
  id: number;
  type: TypeDocument;
  type_label: string;
  nom_original: string;
  taille_lisible: string;
  principal: boolean;
  televerse_le: string;
}

export interface ApiCandidature {
  id: number;
  reference: string;
  statut: StatutCandidature;
  statut_label: string;
  est_final: boolean;
  peut_etre_retiree: boolean;
  lettre_motivation: string | null;
  /** Answers to the offer own selection questions, when it asks any. */
  reponse_1: string | null;
  reponse_2: string | null;
  offre?: ApiOffre;
  profil?: ApiProfilDemandeur;
  cv?: ApiDocumentCandidature;
  note_recruteur?: string | null;
  statut_modifie_le: string | null;
  created_at: string;
}

export interface CandidaturesResponse {
  data: ApiCandidature[];
  meta: PaginationMeta;
}

/* ─── Espace recruteur (Phase 6) ─── */

export interface TableauBordEntreprise {
  entreprise: { nom: string; verifiee: boolean } | null;
  message?: string;
  offres?: { total: number; publiees: number; brouillons: number; vues: number };
  candidatures?: {
    total: number;
    nouvelles: number;
    en_revue: number;
    entretien: number;
    acceptees: number;
  };
  recentes?: ApiCandidature[];
}

export interface OffresEntrepriseResponse {
  data: ApiOffre[];
  meta: PaginationMeta;
  resume: { total: number; publiees: number; brouillons: number; candidatures: number };
}

export interface CandidaturesEntrepriseResponse {
  data: ApiCandidature[];
  meta: PaginationMeta;
  resume: Record<string, number>;
  filtres: { statut: { value: StatutCandidature; label: string }[] };
}

export interface CandidatsResponse {
  data: ApiProfilDemandeur[];
  meta: PaginationMeta;
}

export interface OffrePayload {
  titre: string;
  description: string;
  missions?: string;
  question_1?: string;
  question_2?: string;
  profil_recherche?: string;
  type_contrat: TypeContrat;
  secteur: string;
  ville: string;
  salaire_min?: number;
  salaire_max?: number;
  experience_requise?: string;
  niveau_etude?: string;
  date_limite?: string;
  statut?: StatutOffre;
}

export interface EntreprisePayload {
  nom: string;
  secteur?: string;
  taille?: string;
  site_web?: string;
  description?: string;
  ville?: string;
  telephone?: string;
}

/* ─── Matching & entretiens (Phase 7) ─── */

export type StatutEntretien = "en_attente" | "confirme" | "termine" | "annule";
export type ModeEntretien = "presentiel" | "visio" | "telephone";
export type StatutCorrespondance = "suggere" | "retenu" | "ecarte";

/** One scoring criterion, with the reason it scored what it did. */
export interface CritereMatching {
  obtenu: number;
  max: number;
  raison: string;
  communes?: string[];
}

export interface ApiCorrespondance {
  id: number;
  score: number;
  statut: StatutCorrespondance;
  details: Record<string, CritereMatching>;
  offre?: ApiOffre;
  profil?: ApiProfilDemandeur;
  calcule_le: string;
}

export interface CorrespondancesResponse {
  data: ApiCorrespondance[];
  meta: PaginationMeta;
  offre: { id: number; titre: string };
}

export interface ApiCreneau {
  id: number;
  debut: string;
  fin: string;
  duree_minutes: number;
  mode: ModeEntretien;
  mode_label: string;
  lieu: string | null;
  reserve: boolean;
  passe: boolean;
}

export interface ApiEntretien {
  id: number;
  reference: string;
  statut: StatutEntretien;
  statut_label: string;
  est_final: boolean;
  lien_visio: string | null;
  motif_annulation: string | null;
  confirme_le: string | null;
  creneau?: ApiCreneau;
  candidature?: ApiCandidature;
  note?: string | null;
  created_at: string;
}

export interface EntretiensResponse {
  data: ApiEntretien[];
  meta: PaginationMeta;
}

export interface CreneauPayload {
  debut: string;
  fin: string;
  mode: ModeEntretien;
  lieu?: string;
}

export interface CompteInscriptionPayload {
  nom: string;
  email: string;
  telephone?: string;
  password: string;
  password_confirmation: string;
  role: "demandeur" | "recruteur";
}

export interface DocumentAttendu {
  type: TypeDocument;
  label: string;
  obligatoire: boolean;
  /** Human-readable, e.g. "PDF, JPG, JPEG". */
  formats: string;
  taille_max_mo: number;
}

/* ─── Back-office ─── */

export type StatutInscription = "en_attente" | "confirmee" | "annulee";

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export interface AdminInscriptionsResponse {
  data: ApiInscription[];
  meta: PaginationMeta;
  filtres: {
    statut: { value: string; label: string }[];
    type_participation: { value: string; label: string }[];
    ville: string[];
  };
  resume: {
    total: number;
    en_attente: number;
    confirmee: number;
    annulee: number;
  };
}

export interface AdminFormationsResponse {
  /** Available categories and speakers, so the form can map names back to ids. */
  categories?: { id: number; nom: string }[];
  formateurs?: { id: number; nom: string; libelle: string }[];
  data: ApiFormation[];
  meta: PaginationMeta;
}

export interface FormationPayload {
  edition_id: number;
  categorie_id?: number | null;
  formateur_id?: number | null;
  titre: string;
  slug?: string;
  description?: string | null;
  prerequis?: string | null;
  duree: string;
  lieu: string;
  niveau: string;
  format: string;
  image?: string | null;
  date_debut?: string | null;
  date_fin?: string | null;
  max_inscriptions: number;
  publiee: boolean;
}

/* ─── Contenus éditoriaux (Phase 8) ─── */

export interface ApiActualite {
  id: number;
  titre: string;
  slug: string;
  categorie: string;
  extrait: string | null;
  contenu?: string;
  image: string | null;
  auteur: string | null;
  publiee_le: string | null;
  vues?: number;
}

export interface ApiFaqEntree {
  id: number;
  categorie: string;
  question: string;
  reponse: string;
  ordre: number;
}

export interface ApiPartenaire {
  id: number;
  nom: string;
  slug: string;
  type: string;
  logo: string | null;
  site_web: string | null;
  description: string | null;
}

export interface ApiArticlePresse {
  id: number;
  titre: string;
  media: string;
  type: string;
  date_publication: string;
  lien: string | null;
  fichier: string | null;
  resume: string | null;
}

/* ─── Éditions (Phase 8) ─── */

export interface ApiEdition {
  id: number;
  annee: number;
  nom: string;
  date_debut: string;
  date_fin: string;
  lieu: string | null;
  active: boolean;
  inscriptions_ouvertes: boolean;
  formations_count: number;
  inscriptions_count: number;
}

export interface EditionPayload {
  annee: number;
  nom: string;
  date_debut: string;
  date_fin: string;
  lieu?: string;
  active?: boolean;
  inscriptions_ouvertes?: boolean;
}

/* ─── Intervenants (Phase 8) ─── */

export interface ApiFormateur {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  fonction: string | null;
  organisation: string | null;
  bio: string | null;
  photo: string | null;
  formations_count: number;
  created_at: string;
}

export interface FormateurPayload {
  nom: string;
  email?: string;
  telephone?: string;
  fonction?: string;
  organisation?: string;
  bio?: string;
  photo?: string;
}

export interface ApiNotification {
  id: string;
  titre: string;
  message: string;
  lien: string | null;
  type: string;
  lue: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  data: ApiNotification[];
  non_lues: number;
}
