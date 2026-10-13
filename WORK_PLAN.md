# SANEM — Plan de Travail

> **Mis à jour :** 11 octobre 2026
> **Contrat :** 900 USD · 9 phases · 100 USD par phase
> **Événement :** Niamey, 10–12 décembre 2026
> **Avancement réel :** Phases 1–8 livrées · Phase 9 à faire

---

## 1. État des lieux (vérifié, pas estimé)

| Phase | Module | État | Détail vérifié |
|---|---|---|---|
| 1 | Analyse & Architecture | ✅ **Livrée** | 7 modèles, 4 enums, 13 migrations, Sanctum + rôles |
| 2 | UI/UX & Design | ✅ **Livrée** | Design system, responsive, 30+ pages |
| 3 | Site public | ✅ **Livrée** | Toutes les pages publiques en ligne |
| 4 | Inscriptions & Formations | ✅ **Livrée** | Bout en bout + upload documents · 77 tests passent |
| 5 | Espace Demandeur d'emploi | ✅ **Livrée** | 10 migrations, 23 routes, recherche indexée · 20 tests |
| 6 | Espace Recruteur | ✅ **Livrée** | 16 routes cloisonnées par policies · 5 pages · 21 tests |
| 7 | Matching & Entretiens | ✅ **Livrée** | Score par critères explicable · rappels planifiés · 19 tests |
| 8 | Back-office Administrateur | ✅ **Livrée** | 10 pages branchées · statistiques · export CSV · 17 tests |
| 9 | Sécurité & Mise en production | ⬜ **0 %** | Backend non déployé. `MAIL_MAILER=log` |

**Lecture honnête :** 4 phases sur 9 sont payées et livrées, mais elles représentent la partie la
plus simple. Les phases 5 à 7 sont le cœur métier (emploi) et sont à zéro. En volume de travail
réel, le projet est à environ **40 %**, pas à 44 %.

### Existant réutilisable

| Brique | Où | Réutilisée par |
|---|---|---|
| `FiltreLesListes` (recherche/tri/pagination) | `app/Http/Concerns/` | Phases 5, 6, 8 |
| `Notificateur` (email sans casser l'action) | `app/Services/` | Phases 5, 6, 7 |
| `GestionDocuments` (upload privé sécurisé) | `app/Services/` | Phase 5 (CV) |
| `VerifierRole` (middleware rôles) | `app/Http/Middleware/` | Phases 5, 6, 8 |
| `api.ts` (client typé + multipart) | `frontend/lib/` | Tout le frontend |
| Pattern FormRequest + Resource + Service | partout | Tout le backend |

---

## 2. Règle de périmètre

**Ce plan suit strictement la proposition signée (900 USD · 9 phases · 100 USD par phase).**
Chaque ligne ci-dessous correspond à une exigence du document contractuel : rien n'y est ajouté.

Si le client demande plus tard une fonctionnalité hors de ce document (IA, CMS complet, paiement,
OAuth…), ce plan sera mis à jour **à ce moment-là**, et l'ajout fera l'objet d'un avenant chiffré.
Tant que cela n'arrive pas, on livre exactement ce qui est écrit ici — ni plus, ni moins.

---

## 3. Décisions actées

| Sujet | Décision | Conséquence |
|---|---|---|
| **Matching (Phase 7)** | **Par critères**, pas IA | Score pondéré en SQL, explicable, sans coût récurrent. L'IA fera l'objet d'un devis séparé (phase 10). |
| **Périmètre admin (Phase 8)** | **Périmètre contractuel** | CRUD complet sur le métier ; CRUD simple sur l'éditorial. |
| **Stockage documents** | Disque privé + route authentifiée | Déjà en place (Phase 4). Les CV suivront le même chemin. |
| **Langue du code** | Français | Modèles, colonnes, routes, messages. Sans exception. |
| **Paiement** | **Hors périmètre** | Formations gratuites — retiré du contrat. |

---

## 4. Phase 5 — Espace Demandeur d'emploi

> *Inscription/connexion ; profil ; CV ; compétences ; formation ; expérience ; secteur ;
> localisation ; type d'emploi ; recherche et filtres des offres ; détails des offres ;
> candidatures et historique ; notifications ; entretiens.*

### 5.1 Base de données — 8 migrations

| Table | Champs clés |
|---|---|
| `profils_demandeur` | `user_id`, `titre_pro`, `resume`, `secteur`, `ville`, `type_emploi`, `disponibilite`, `linkedin`, `portfolio`, `visible` |
| `competences` | `nom`, `slug` *(référentiel partagé)* |
| `competence_profil` | `profil_id`, `competence_id`, `niveau` |
| `formations_academiques` | `profil_id`, `diplome`, `etablissement`, `domaine`, `annee_debut`, `annee_fin`, `en_cours` |
| `experiences` | `profil_id`, `poste`, `entreprise`, `lieu`, `date_debut`, `date_fin`, `en_poste`, `description` |
| `entreprises` | `user_id`, `nom`, `secteur`, `taille`, `logo`, `site_web`, `description`, `ville`, `verifiee` |
| `offres_emploi` | `entreprise_id`, `titre`, `description`, `missions`, `profil_recherche`, `type_contrat`, `secteur`, `ville`, `salaire_min/max`, `experience_requise`, `niveau_etude`, `date_limite`, `statut`, `vues` |
| `candidatures` | `offre_id`, `profil_id`, `statut`, `lettre_motivation`, `cv_document_id`, `note_recruteur`, unique(`offre_id`,`profil_id`) |

**Nouveaux enums :** `StatutCandidature`, `TypeContrat`, `StatutOffre`, `NiveauCompetence`.

**Workflow candidature :**
`envoyee → en_revue → preselectionnee → entretien → acceptee | refusee`

> Le CV réutilise `documents_inscription`/`GestionDocuments` plutôt qu'un second système de
> fichiers : même disque privé, même validation, même route de téléchargement authentifiée.

### 5.2 API

**Public**
```
GET  /api/offres                     recherche + filtres (secteur, ville, contrat, q)
GET  /api/offres/{offre}             détail (incrémente vues)
GET  /api/secteurs                   référentiel + compteurs
```

**Demandeur (`auth:sanctum` + rôle)**
```
GET|PUT /api/profil
POST    /api/profil/cv
CRUD    /api/profil/competences|formations|experiences
POST    /api/offres/{offre}/postuler
GET     /api/mes-candidatures
GET     /api/notifications    POST /api/notifications/{id}/lue
```

### 5.3 Frontend

| # | Tâche | État actuel |
|---|---|---|
| a | `/emploi/[offre]` page détail | **N'existe pas** |
| b | Formulaire de candidature | **N'existe pas** |
| c | Recherche/filtres côté serveur | Actuellement client-side (`JobsGrid.tsx`) |
| d | Pages profil (profil, compétences, formations, expériences) | **N'existent pas** |
| e | Upload CV | **N'existe pas** |
| f | Mes candidatures + historique | Mock dans `dashboard/participant` |
| g | Notifications | Mock dans `DashboardNavbar` |

### 5.4 Critère de fin
Un demandeur crée un compte, complète son profil, dépose son CV, cherche une offre,
postule, et suit sa candidature. Tests backend verts.

**Estimation : 10–12 jours**

---

## 5. Phase 6 — Espace Recruteur

> *Inscription/connexion ; profil entreprise ; tableau de bord ; création et gestion des offres ;
> statut des offres ; recherche de profils ; gestion des candidatures ; suivi du recrutement.*

### 6.1 Base de données
Tables `entreprises` et `offres_emploi` créées en Phase 5. Ajouts :

| Table | Champs clés |
|---|---|
| `membres_entreprise` | `entreprise_id`, `user_id`, `role_interne` *(plusieurs recruteurs par entreprise)* |
| `favoris_candidat` | `entreprise_id`, `profil_id`, `note` |

### 6.2 API
```
GET|PUT /api/entreprise                     profil entreprise
CRUD    /api/entreprise/offres              + changement de statut
GET     /api/entreprise/offres/{o}/candidatures
PUT     /api/entreprise/candidatures/{c}/statut
GET     /api/entreprise/candidats           recherche de profils (visible = true)
GET     /api/entreprise/tableau-de-bord     compteurs
```

### 6.3 Points de vigilance
- **Cloisonnement strict :** une entreprise ne doit jamais lire les candidatures d'une autre.
  Policy Laravel + test dédié, pas seulement un `where`.
- **Consentement :** seuls les profils `visible = true` sortent dans la recherche candidats.
- Le CV d'un candidat n'est téléchargeable **que** s'il a postulé chez ce recruteur.

### 6.4 Critère de fin
Un recruteur publie une offre, reçoit des candidatures, consulte les profils, fait évoluer
les statuts. Un second recruteur ne voit rien de tout cela.

**Estimation : 8–10 jours**

---

## 6. Phase 7 — Matching & Entretiens

> *Tableau de bord de mise en relation ; critères ; candidats et offres correspondants ;
> planification des entretiens ; créneaux ; confirmations ; calendrier ; statuts ; rappels.*

### 7.1 Matching — par critères (décidé)

```
score = 30×secteur + 25×compétences + 20×ville
      + 15×expérience + 10×type_contrat        → 0–100
```

Calculé en SQL, stocké dans `correspondances` et rafraîchi à la publication d'une offre ou à la
mise à jour d'un profil. **Explicable** : chaque score s'accompagne de ses raisons
(« 85 % — même secteur, 3 compétences communes, même ville »), ce qu'un score IA ne donne pas.

| Table | Champs clés |
|---|---|
| `correspondances` | `offre_id`, `profil_id`, `score`, `details` (jsonb), `statut`, unique(`offre_id`,`profil_id`) |
| `creneaux_entretien` | `entreprise_id`, `debut`, `fin`, `lieu`, `mode`, `reserve` |
| `entretiens` | `candidature_id`, `creneau_id`, `statut`, `lien_visio`, `note`, `rappel_envoye_le` |

**Statuts entretien :** `en_attente → confirme → termine | annule`

### 7.2 API
```
GET  /api/entreprise/matching/offres/{offre}    candidats correspondants + score
GET  /api/matching/mes-correspondances          côté demandeur
CRUD /api/entreprise/creneaux
POST /api/entreprise/candidatures/{c}/entretien proposer un créneau
POST /api/entretiens/{e}/confirmer|annuler
GET  /api/entretiens/calendrier
```

### 7.3 Rappels
Commande planifiée (`schedule:run`) : rappel J-1 par email aux deux parties via `Notificateur`.

### 7.4 Critère de fin
Un recruteur ouvre une offre, voit les candidats classés par score avec justification, propose
un créneau ; le candidat confirme ; les deux reçoivent un rappel la veille.

**Estimation : 8–10 jours**

---

## 7. Phase 8 — Back-office Administrateur

> *Tableau de bord ; participants ; inscriptions ; export Excel/CSV ; formations ; contenus ;
> demandeurs ; recruteurs ; entreprises ; offres ; candidatures ; matching ; rendez-vous ;
> utilisateurs ; rôles ; permissions ; statistiques.*

**Point de départ réel : 2 pages sur 13 branchées.** Les 11 autres sont des maquettes statiques.

### 8.1 Métier — CRUD complet + API

| Page | Travail |
|---|---|
| `inscriptions` | ✅ déjà fait |
| `formations` | ✅ déjà fait |
| `utilisateurs` | CRUD, rôles, permissions, activation/suspension |
| `emploi` | Offres : modération, statut, suppression |
| `candidatures` | Suivi global *(colonnes CV/Lettre actuellement simulées par index de ligne — à brancher)* |
| `rapports` | Statistiques + **export Excel/CSV** |
| `evenements` | ✅ Éditions, dates, ouverture des inscriptions |
| `intervenants` | ✅ CRUD formateurs |
| `notifications` | Historique d'envoi, renvoi manuel |

### 8.2 Éditorial — CRUD simple

`actualites`, `faq`, `presse`, `partenaires`, `parametres` — remplacent les `data.ts` figés
du frontend (12 fichiers de contenu statique aujourd'hui).

### 8.3 Export
`maatwebsite/excel` — inscriptions, candidatures, offres, participants par formation.

### 8.4 Critère de fin
Un administrateur gère l'ensemble de la plateforme sans toucher au code, et exporte ses listes.

**Estimation : 12–15 jours**

---

## 8. Phase 9 — Intégrations, Sécurité, Tests & Mise en production

### 9.1 Sécurité
- [ ] HTTPS/SSL + redirection forcée
- [ ] En-têtes : HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- [ ] Rate limiting sur **toutes** les routes d'écriture publiques
- [ ] Policies Laravel sur chaque ressource (pas seulement du `where`)
- [ ] Audit : aucune donnée personnelle exposée par URL *(déjà appliqué aux documents)*
- [ ] Sauvegardes quotidiennes base + fichiers, avec **restauration testée**
- [ ] `APP_DEBUG=false`, secrets hors dépôt

### 9.2 Intégrations
- [ ] Google Analytics 4
- [ ] Service email réel — **aujourd'hui `MAIL_MAILER=log`, rien ne part**
- [ ] Carte interactive (lieu de l'événement)

### 9.3 Qualité
- [ ] Tests navigateurs (Chrome, Firefox, Safari, mobile Android/iOS)
- [ ] Parcours fonctionnels de bout en bout
- [ ] Performance : index DB, requêtes N+1, images, cache
- [ ] Accessibilité WCAG 2.1 (engagement de la Phase 2)

### 9.4 Déploiement
- [ ] Frontend → Vercel (**Root Directory = `frontend`**)
- [ ] Backend → Railway / Render / Fly.io / VPS — **Vercel n'héberge pas PHP**
- [ ] PostgreSQL managé + domaine + SSL
- [ ] Vérification finale en production

**Estimation : 8–10 jours**

---

## 9. Calendrier

| Phase | Module | Durée | Cumul |
|---|---|---|---|
| 5 | Espace Demandeur d'emploi | 10–12 j | 12 j |
| 6 | Espace Recruteur | 8–10 j | 22 j |
| 7 | Matching & Entretiens | 8–10 j | 32 j |
| 8 | Back-office Administrateur | 12–15 j | 47 j |
| 9 | Intégrations, Sécurité, Production | 8–10 j | **57 j** |

**Reste à livrer : 46–57 jours de travail** pour 500 USD (5 phases).

> ⚠️ **À savoir avant de s'engager sur une date.** Le rythme des phases 1–4 ne prédit pas celui
> des phases 5–9 : le site public est surtout de l'affichage, alors que les espaces emploi sont
> du métier avec droits d'accès, états et règles de cloisonnement. La Phase 8 à elle seule
> (11 pages à brancher) pèse plus lourd que la Phase 4 entière.

### Ordre d'exécution
5 → 6 → 7 → 8 → 9, sans réordonnancement possible : la 6 a besoin des tables de la 5,
la 7 a besoin des candidatures de la 6, la 8 administre tout ce qui précède, la 9 déploie l'ensemble.

### Protocole par phase
1. Se mettre d'accord sur le périmètre **avant** d'écrire du code
2. Migrations + enums + modèles
3. FormRequest → Service → Resource → Controller → routes
4. Tests backend (sécurité et cloisonnement compris)
5. Frontend branché sur l'API réelle
6. Vérification sur serveurs lancés, puis commit

---

## 10. À confirmer avec le client

| # | Point | Bloque | Pourquoi c'est urgent |
|---|---|---|---|
| 1 | **Service email** (SMTP, Mailgun, Resend, Brevo) | Phases 5–7, 9 | `MAIL_MAILER=log` : **aucun email ne part réellement aujourd'hui** |
| 2 | **Hébergement backend + domaine** | Phase 9 | Vercel n'exécute pas PHP. À prévoir bien avant la fin. |
| 3 | Matching par critères — **confirmer par écrit** | Phase 7 | Décision prise ; à faire acter pour éviter une demande d'IA en fin de parcours |
| 4 | OAuth Google/LinkedIn | Phase 5 | Les boutons sont déjà dans l'UI : à implémenter ou à retirer |
| 5 | Contenu réel (formations, intervenants, partenaires) | Phase 8 | 12 fichiers `data.ts` figés attendent du contenu officiel |
| 6 | Réouverture des documents après annulation | — | Aujourd'hui seul le statut `en_attente` autorise l'envoi |

### Risque commercial à surveiller
Les phases 5 à 9 représentent **la moitié du contrat en argent mais nettement plus de la moitié
du travail**. Toute demande d'IA en Phase 7, ou de CMS complet en Phase 8, sort du périmètre
convenu et doit faire l'objet d'un avenant.
