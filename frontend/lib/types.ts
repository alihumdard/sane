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
  documents?: ApiDocument[];
  confirmee_le: string | null;
  created_at: string;
}

export interface InscriptionResponse {
  message: string;
  data: ApiInscription;
}

/* ─── Pièces justificatives ─── */

export type TypeDocument = "piece_identite" | "cv" | "lettre_motivation" | "photo";

export interface ApiDocument {
  id: number;
  type: TypeDocument;
  type_label: string;
  nom_original: string;
  mime: string;
  taille: number;
  taille_lisible: string;
  televerse_le: string;
}

/** Describes one expected document, as the API advertises it. */
export interface DocumentRequis {
  value: TypeDocument;
  label: string;
  obligatoire: boolean;
  /** Comma-separated extension list, e.g. "pdf,jpg,jpeg". */
  formats: string;
  taille_max_ko: number;
}

export interface DocumentsResponse {
  data: ApiDocument[];
  requis: DocumentRequis[];
}

export interface DocumentUploadResponse {
  message: string;
  data: ApiDocument;
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

export interface CompteInscriptionPayload {
  nom: string;
  email: string;
  telephone?: string;
  password: string;
  password_confirmation: string;
  role: "demandeur" | "recruteur";
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
