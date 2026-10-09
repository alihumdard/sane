# SANEM — Plan de Travail / Work Plan

> **Statut actuel :** Frontend Next.js 16 complet mais 100 % statique (aucun appel API, aucune authentification, aucune base de données). Backend à créer de zéro en Laravel.

---

## 0. Restructuration du dépôt (Repo Restructure)

### Structure cible

```
sane/
├── frontend/              # Next.js 16 (code existant déplacé ici)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── .env.local         # NEXT_PUBLIC_API_URL=http://localhost:8000/api
│
├── backend/               # Laravel 12 (nouveau)
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Enums/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env               # DB_*, MAIL_*, SANCTUM_*
│
├── .gitignore
├── README.md
└── WORK_PLAN.md
```

### Étapes

| # | Tâche | Détail |
|---|-------|--------|
| 0.1 | Créer `frontend/` | `git mv` de app, components, lib, public, package.json, tsconfig, next.config, postcss, eslint |
| 0.2 | Vérifier le build | `cd frontend && npm run dev` — le site doit fonctionner à l'identique |
| 0.3 | Installer Composer | PHP 8.2.12 déjà présent (XAMPP). Composer manquant → à installer |
| 0.4 | Créer `backend/` | `composer create-project laravel/laravel backend` |
| 0.5 | Créer la base | MariaDB 10.4 (XAMPP) → base `sanem` |
| 0.6 | `.gitignore` racine | Ignorer `backend/vendor`, `backend/.env`, `frontend/node_modules`, `frontend/.next` |
| 0.7 | Commit | « Restructure repo into frontend/ and backend/ » |

**Durée estimée : 1 jour**

---

## 1. Fondations Backend (Backend Foundations)

À faire **avant** la Phase 4 — c'est l'infrastructure dont toutes les phases dépendent.

| # | Tâche | Détail |
|---|-------|--------|
| 1.1 | Packages | `laravel/sanctum` (auth SPA), `spatie/laravel-permission` (rôles), `maatwebsite/excel` (export Phase 8) |
| 1.2 | CORS | `config/cors.php` → autoriser `http://localhost:3000` + domaine Vercel |
| 1.3 | Enums PHP | `RoleUtilisateur`, `StatutInscription`, `TypeParticipation`, `StatutCandidature`, `StatutEntretien`, `TypeContrat`, `NiveauFormation`, `FormatFormation` |
| 1.4 | Table `users` étendue | `nom`, `email`, `telephone`, `role`, `statut`, `photo`, `email_verified_at` |
| 1.5 | 5 rôles | `participant`, `entreprise`, `recruteur`, `organisateur`, `administrateur` |
| 1.6 | Réponses API standardisées | `ApiResponse::success($data, $meta)` / `::error($message, $code)` |
| 1.7 | Trait de requête | `HasApiQuery` — gère `?q=`, `?page=`, `?per_page=`, `?sort=`, `?dir=`, filtres exacts. **Doit correspondre au hook `useTable` existant** |
| 1.8 | Client API frontend | `frontend/lib/api.ts` — wrapper fetch, gestion token, typage |
| 1.9 | Seeder de base | Édition 2026, rôles, 1 compte admin |

**Point critique :** le hook `useTable` (`components/dashboard/useTable.ts`) définit déjà le contrat de requête côté client. L'API doit retourner :

```json
{
  "data": [...],
  "meta": { "total": 120, "page": 1, "per_page": 10, "last_page": 12 },
  "filters": { "Catégorie": ["Numérique", "Management"], "Statut": ["Active"] }
}
```

**Durée estimée : 3 jours**

---

## 2. Authentification (Auth) — prérequis Phases 4-5

Le frontend a déjà l'UI de connexion (`components/connexion/LoginCard.tsx`) mais `onSubmit` est un no-op.

| # | Tâche | Backend | Frontend |
|---|-------|---------|----------|
| 2.1 | Inscription compte | `POST /api/auth/register` | — |
| 2.2 | Connexion | `POST /api/auth/login` → token Sanctum | Brancher `LoginCard` |
| 2.3 | Déconnexion | `POST /api/auth/logout` | Bouton « Déconnexion » |
| 2.4 | Utilisateur courant | `GET /api/auth/me` | Context React `useAuth()` |
| 2.5 | Mot de passe oublié | `POST /api/auth/forgot-password` + reset | Page `/mot-de-passe-oublie` |
| 2.6 | Vérification email | Signed URL Laravel | Page de confirmation |
| 2.7 | Protection des routes | Middleware `auth:sanctum` + `role:` | `middleware.ts` Next.js |
| 2.8 | Redirection par rôle | — | participant→`/dashboard/participant`, entreprise/recruteur→`/dashboard`, organisateur→`/dashboard/organisateur`, admin→`/dashboard/admin` |

**Hors périmètre pour l'instant :** Google/LinkedIn OAuth (boutons présents mais à confirmer avec le client).

**Durée estimée : 3 jours**

---

## 3. PHASE 4 — Inscriptions & Gestion des Formations

> Référence doc : *Three-step participant registration; participation type selection; available training selection; seat/capacity and quota management; participant information; validation; registration confirmation; automatic confirmation email; registration summary and training selection. **No online payment** (formations gratuites).*

### 3.1 Base de données

| Table | Champs clés |
|-------|-------------|
| `editions` | `annee` (unique), `nom`, `date_debut`, `date_fin`, `active` |
| `categories_formation` | `nom`, `slug`, `couleur` |
| `formateurs` | `nom`, `email`, `telephone`, `bio`, `photo` |
| `formations` | `edition_id`, `categorie_id`, `formateur_id`, `titre`, `description`, `duree`, `lieu`, `niveau`, `format`, `date_debut`, `date_fin`, `prerequis`, `image`, **`max_inscriptions`**, **`inscriptions_count`**, `statut` |
| `inscriptions` | `edition_id`, `user_id` (nullable), `type_participation`, `statut`, + tous les champs du formulaire, `interets` (JSON), `newsletter`, `consentement`, `seats_released`, `seats_released_at` |
| `inscription_formation` | `inscription_id`, `formation_id`, unique composite |
| `documents_inscription` | `inscription_id`, `type` (piece_identite/cv/lettre_motivation/photo), `chemin`, `taille`, `mime` |

**Contrainte clé :** `unique(edition_id, email)` sur `inscriptions` — une inscription par email par édition.

**Gestion des places (concurrence) :**
```php
DB::transaction(function () use ($formationIds) {
    foreach ($formationIds as $id) {
        $ok = Formation::where('id', $id)
            ->whereColumn('inscriptions_count', '<', 'max_inscriptions')
            ->increment('inscriptions_count');
        if (!$ok) throw new PlacesEpuiseesException($id);
    }
});
```

### 3.2 API Endpoints

**Public**
- `GET /api/formations` — liste + filtres (domaine, niveau, format) + places restantes
- `GET /api/formations/{id}` — détail
- `POST /api/inscriptions` — soumettre l'inscription (+ formations sélectionnées)
- `POST /api/inscriptions/{id}/documents` — upload (max 2 Mo, PDF/JPG/PNG)
- `GET /api/inscriptions/{id}/confirmation` — récapitulatif

**Participant (auth)**
- `GET /api/mes-inscriptions`
- `GET /api/mes-formations`
- `DELETE /api/mes-inscriptions/{id}` — annulation + libération des places

**Admin (auth + rôle)**
- `GET|POST|PUT|DELETE /api/admin/formations`
- `GET|PUT /api/admin/inscriptions` (validation : `en_attente` → `confirmee` / `annulee`)
- `POST /api/admin/inscriptions/bulk-delete`
- `GET /api/admin/formations/{id}/inscrits`

### 3.3 Emails

| Email | Déclencheur |
|-------|-------------|
| `InscriptionRecue` | À la soumission |
| `InscriptionConfirmee` | Validation admin |
| `InscriptionAnnulee` | Annulation |
| `RappelFormation` | J-3 avant la formation (scheduler) |

### 3.4 Travaux Frontend

| # | Tâche | Fichier |
|---|-------|---------|
| a | Ajouter l'étape « Type de participation » | `RegistrationWizard.tsx` — passe de 4 à 5 étapes |
| b | Ajouter l'étape « Sélection des formations » | Nouveau composant, affiche places restantes, désactive si complet |
| c | Remonter `newsletter` dans l'état | `steps.tsx:84` — actuellement non contrôlé |
| d | Brancher `handleSubmit` | `RegistrationWizard.tsx:30-35` — remplacer par POST |
| e | Upload de documents | 4 champs fichier (actuellement informatifs seulement) |
| f | Gestion erreurs/chargement | Nouveau — validation serveur, places épuisées |
| g | Formations dynamiques | `components/formations/data.ts` → API |
| h | Places numériques | `places: "Places limitées"` → calculé depuis l'API |
| i | Admin formations → API | `app/dashboard/admin/formations/page.tsx` |
| j | Admin inscriptions (nouveau) | `app/dashboard/admin/inscriptions/page.tsx` |
| k | Dashboard participant → API | `app/dashboard/participant/page.tsx` |

**Durée estimée : 8-10 jours**

---

## 4. PHASE 5 — Portail Demandeur d'Emploi

> Référence doc : *Registration/login; profile; personal information; CV/professional profile; skills; education; experience; sector; location; job type; job search and filters; job details; applications and history; notifications; interviews.*

### 4.1 Base de données

| Table | Champs clés |
|-------|-------------|
| `profils_demandeur` | `user_id`, `titre_professionnel`, `resume`, `secteur`, `ville`, `type_emploi_recherche`, `disponibilite`, `cv_chemin`, `photo`, `linkedin`, `portfolio` |
| `competences` | `nom`, `slug` (référentiel) |
| `competence_profil` | `profil_id`, `competence_id`, `niveau` |
| `formations_academiques` | `profil_id`, `diplome`, `etablissement`, `domaine`, `annee_debut`, `annee_fin`, `en_cours` |
| `experiences` | `profil_id`, `poste`, `entreprise`, `lieu`, `date_debut`, `date_fin`, `en_poste`, `description` |
| `entreprises` | `user_id`, `nom`, `secteur`, `taille`, `logo`, `site_web`, `description`, `ville`, `verifiee` |
| `offres_emploi` | `entreprise_id`, `titre`, `description`, `missions`, `profil_recherche`, `type_contrat`, `secteur`, `ville`, `salaire_min/max`, `experience_requise`, `niveau_etude`, `date_limite`, `statut`, `vues` |
| `candidatures` | `offre_id`, `profil_id`, `statut`, `lettre_motivation`, `cv_chemin`, `note_recruteur`, `date_candidature` |
| `favoris` | `user_id`, `offre_id` |
| `notifications` | (table Laravel standard) |

**Workflow candidature :** `envoyee` → `en_revue` → `preselectionnee` → `entretien` → `acceptee` / `refusee`

### 4.2 API Endpoints

**Public**
- `GET /api/offres` — recherche + filtres (secteur, ville, contrat, mot-clé)
- `GET /api/offres/{id}` — détail (incrémente `vues`)
- `GET /api/secteurs` — avec compteurs

**Demandeur (auth)**
- `GET|PUT /api/profil`
- `POST /api/profil/cv` — upload CV
- `CRUD /api/profil/competences|formations|experiences`
- `POST /api/offres/{id}/postuler`
- `GET /api/mes-candidatures` + `GET /api/mes-candidatures/{id}`
- `POST|DELETE /api/offres/{id}/favori`
- `GET /api/notifications` + `POST /api/notifications/{id}/lue`

### 4.3 Travaux Frontend

| # | Tâche | Statut actuel |
|---|-------|---------------|
| a | Page détail offre `/emploi/[id]` | **N'existe pas** |
| b | Formulaire de candidature | **N'existe pas** |
| c | Recherche/filtres côté serveur | Actuellement client-side (`JobsGrid.tsx:16-22`) |
| d | Pages profil demandeur | **N'existent pas** — profil, compétences, formations, expériences |
| e | Upload CV | **N'existe pas** |
| f | Mes candidatures + historique | Mock dans `dashboard/participant` |
| g | Favoris | Lien mort dans la sidebar |
| h | Notifications | Mock dans `DashboardNavbar:9-15` |
| i | Admin candidatures → API | `app/dashboard/admin/candidatures/page.tsx` (colonnes CV/Lettre actuellement **simulées** par index de ligne) |

**Durée estimée : 10-12 jours**

---

## 5. Phases suivantes (aperçu)

| Phase | Contenu | Durée est. |
|-------|---------|-----------|
| **6 — Portail Recruteur** | Profil entreprise, CRUD offres, recherche candidats, gestion candidatures, suivi recrutement | 8-10 j |
| **7 — Matching & Entretiens** | Tableau de bord matching, critères, créneaux, calendrier, statuts entretien, emails/rappels. ⚠️ *Approche matching (critères vs IA) à confirmer avec le client* | 8-10 j |
| **8 — Back-office Admin** | Compléter les 13 sections + ~85 sous-pages du `adminNav`, export Excel/CSV, rôles & permissions, statistiques | 12-15 j |
| **9 — Intégrations, Sécurité, QA, Déploiement** | GA4, service email, carte interactive, HTTPS/SSL, sauvegardes, optimisation, tests navigateurs, QA fonctionnelle, serveur de production | 8-10 j |

---

## 6. Points à confirmer avec le client

1. **Hébergement backend** — Laravel ne tourne pas sur Vercel. Options : VPS (Hostinger/DigitalOcean/OVH), Laravel Forge, ou hébergement mutualisé cPanel.
2. **Base de données en production** — MySQL/MariaDB (par défaut avec Laravel + cPanel) ou PostgreSQL.
3. **Service email** — SMTP du client, Mailgun, Resend ou Brevo. Nécessaire dès la Phase 4.
4. **Approche de matching** (Phase 7) — par critères ou IA.
5. **OAuth Google/LinkedIn** — les boutons existent dans l'UI. À implémenter ou retirer ?
6. **Contenu réel** — catalogue de formations, capacités, dates, intervenants, partenaires.
7. **Nom de domaine** — pour le déploiement final.

---

## 7. Décisions techniques

| Sujet | Décision | Raison |
|-------|----------|--------|
| Laravel | **12.x** | Dernière version LTS, PHP 8.2 suffisant (8.2.12 présent) |
| Auth | **Sanctum (token)** | Plus simple que SPA cookie-based pour un frontend séparé/déployé ailleurs |
| Base dev | **MariaDB 10.4 (XAMPP)** | Déjà installé localement |
| Dates API | **ISO 8601** | Le frontend formate en français. Les chaînes actuelles (`"12 Mars 2024"`) ne sont pas triables |
| Clés de style | **Jamais renvoyées par l'API** | `catColor`, `statutBg`, etc. restent côté client (voir `STYLE_KEY` dans `useTable.ts:9`) |
| `inscPct` | **Calculé côté serveur** | Dérivé de `inscriptions_count / max_inscriptions` |
| Fichiers | **Laravel Storage** + hostname ajouté à `next.config.ts` `remotePatterns` | Les 3 hôtes actuels sont des placeholders |

---

## 8. Ordre d'exécution

```
Étape 0  : Restructuration du dépôt          →  1 j
Étape 1  : Fondations backend                →  3 j
Étape 2  : Authentification                  →  3 j
Étape 3  : PHASE 4 — Inscriptions/Formations →  8-10 j
Étape 4  : PHASE 5 — Portail Demandeur       →  10-12 j
──────────────────────────────────────────────────────
Sous-total jusqu'à fin Phase 5               :  25-29 j
```

Chaque étape se termine par : migrations testées + endpoints testés + frontend branché + commit.
