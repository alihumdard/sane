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
  confirmee_le: string | null;
  created_at: string;
}

export interface InscriptionResponse {
  message: string;
  data: ApiInscription;
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
