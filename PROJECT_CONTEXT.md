# SANEM — Project Context (handoff prompt)

Copy everything below the line into a new Claude chat.

---

I'm building **SANEM — Salon National de l'Emploi**, a national employment-fair
platform for Niger (event in Niamey, 10–12 December 2026). I need your help
continuing development. Here is the full context.

## 1. Contract & scope

Fixed-price contract: **900 USD across 9 phases, 100 USD per phase.**
All training courses are **free** — there is **no payment integration anywhere
in scope** (it was explicitly removed from the contract).

The platform is two things at once:
1. A **public event website** — programme, speakers, courses, news, partners, press
2. A **job-market platform** — jobseeker + recruiter spaces, job postings,
   applications, candidate↔offer matching, interview scheduling

The 9 contracted phases:

| # | Phase |
|---|---|
| 1 | Analyse, Architecture & Conception |
| 2 | UI/UX & Design |
| 3 | Développement du site public |
| 4 | Inscription & Gestion des formations |
| 5 | Espace Demandeur d'emploi (jobseeker space) |
| 6 | Espace Recruteur (recruiter space) |
| 7 | Matching & Entretiens (matching + interviews) |
| 8 | Back-Office Administrateur |
| 9 | Intégrations, Sécurité, Tests & Mise en production |

## 2. Tech stack

**Monorepo** at repo root, two apps side by side:

- `frontend/` — Next.js 16.3.6 (App Router, Turbopack), React 19.2.8,
  TypeScript 5, Tailwind CSS 4, lucide-react icons. Runs on port 3000.
- `backend/` — Laravel 12, PHP 8.4, PostgreSQL 18. Laravel Sanctum
  (token auth) + spatie/laravel-permission (roles). Runs on port 8000.

Local dev: PostgreSQL database `sanem`, frontend reads
`NEXT_PUBLIC_API_URL=http://localhost:8000/api`.

**Deployment:** frontend → Vercel (Root Directory must be set to `frontend`).
Backend is **not deployed yet** — Vercel can't host PHP, so it needs a separate
host (Railway / Render / Fly.io / VPS).

## 3. IMPORTANT — language & code conventions

**The entire codebase is written in French.** Models, columns, enums, routes,
variables, validation messages and UI text are all French. Please follow this
exactly — do not introduce English names.

Examples of the existing naming:
- Models: `Inscription`, `Formation`, `Formateur`, `CategorieFormation`, `Edition`
- Columns: `nom`, `telephone`, `naissance`, `niveau`, `statut_pro`, `domaine`,
  `parcours`, `interets`, `consentement`, `places_liberees_le`
- Services: `GestionPlaces`, `Notificateur`
- Middleware: `VerifierRole`
- Concerns: `FiltreLesListes`

User-facing messages are French too, e.g.
`"Votre inscription a bien été enregistrée. Vous recevrez un email de confirmation."`

Other conventions in use:
- API Resources (`FormationResource`, `InscriptionResource`) shape every response
- FormRequest classes hold validation (`StoreInscriptionRequest`, `Admin/FormationRequest`)
- PHP enums back status/type columns
- Constructor property promotion + `readonly` for injected services
- Rate limiting on public write routes (`throttle:10,1` on registration,
  `throttle:5,1` on login)
- Postgres-specific features are used: `jsonb` column and `ilike` operators

## 4. Database schema (13 migrations, all applied)

```
users                  — Laravel default + telephone, role, statut, photo,
                         derniere_connexion_le
editions               — annee, nom, date_debut, date_fin, lieu, active,
                         inscriptions_ouvertes
categories_formation   — nom, slug, ordre
formateurs             — nom, email, telephone, fonction, organisation, bio, photo
formations             — edition_id, categorie_id, formateur_id, titre, slug,
                         description, prerequis, duree, lieu, niveau, format,
                         image, date_debut, date_fin, max_inscriptions,
                         inscriptions_count, publiee
inscriptions           — reference, edition_id, user_id, type_participation,
                         statut, nom, naissance, email, telephone, genre,
                         nationalite, ville, niveau, statut_pro, domaine,
                         experience, parcours, interets (jsonb), source,
                         newsletter, consentement, confirmee_le, confirmee_par,
                         note_admin, places_liberees, places_liberees_le
inscription_formation  — pivot: inscription_id, formation_id
documents_inscription  — inscription_id, type, nom_original, chemin, mime, taille
```

Plus Laravel/package tables: cache, jobs, personal_access_tokens, permission tables.

### PHP enums

```php
RoleUtilisateur:    participant | entreprise | recruteur | organisateur | administrateur
StatutInscription:  en_attente | confirmee | annulee
TypeParticipation:  visiteur | participant_formation | entreprise | recruteur
TypeDocument:       piece_identite | cv | lettre_motivation | photo
```

## 5. File structure

```
sane/
├── AGENTS.md / CLAUDE.md          # agent instructions
├── WORK_PLAN.md                   # detailed French work plan
│
├── backend/                       # Laravel 12
│   ├── app/
│   │   ├── Enums/                 # RoleUtilisateur, StatutInscription,
│   │   │                            TypeParticipation, TypeDocument
│   │   ├── Exceptions/            # PlacesEpuiseesException
│   │   ├── Http/
│   │   │   ├── Concerns/          # FiltreLesListes (shared list filtering)
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── FormationController.php
│   │   │   │   ├── InscriptionController.php
│   │   │   │   └── Admin/
│   │   │   │       ├── FormationAdminController.php
│   │   │   │       └── InscriptionAdminController.php
│   │   │   ├── Middleware/        # VerifierRole
│   │   │   ├── Requests/          # StoreInscriptionRequest, Admin/FormationRequest
│   │   │   └── Resources/         # FormationResource, InscriptionResource
│   │   ├── Mail/                  # InscriptionMail, InscriptionRecue,
│   │   │                            InscriptionConfirmee, InscriptionAnnulee
│   │   ├── Models/                # User, Edition, Formation, Formateur,
│   │   │                            CategorieFormation, Inscription,
│   │   │                            DocumentInscription
│   │   └── Services/              # GestionPlaces (seat/quota logic),
│   │                                Notificateur (notification dispatch)
│   ├── database/migrations/       # 13 migrations
│   ├── database/seeders/          # SanemSeeder
│   └── routes/api.php
│
└── frontend/                      # Next.js 16
    ├── app/                       # App Router pages (see below)
    ├── components/
    │   ├── sections/              # homepage sections (CountdownTimer, etc.)
    │   ├── shared/                # cross-page shared components
    │   ├── ui/                    # design-system primitives
    │   ├── layout/                # header, footer, nav
    │   ├── dashboard/             # dashboard UI
    │   └── {a-propos,actualites,connexion,contact,emploi,faq,formations,
    │         inscription,intervenants,partenaires,presse,programme}/
    └── lib/
        ├── api.ts                 # typed fetch client + ApiError
        ├── auth.tsx               # AuthProvider, session/token owner
        ├── types.ts               # shared TS types
        ├── constants.ts
        ├── adminNav.tsx
        └── utils.ts
```

### Frontend pages that exist

Public: `/`, `/a-propos`, `/actualites`, `/programme`, `/intervenants`,
`/formations`, `/partenaires`, `/faq`, `/contact`, `/presse`, `/emploi`,
`/inscription`, `/connexion`

Dashboards: `/dashboard`, `/dashboard/participant`, `/dashboard/organisateur`,
`/dashboard/admin` + 13 admin subpages (actualites, candidatures, emploi,
evenements, faq, formations, inscriptions, intervenants, notifications,
parametres, partenaires, presse, rapports, utilisateurs)

### API client pattern (`frontend/lib/api.ts`)

A small typed wrapper — please use it rather than raw `fetch`:

```ts
api.get<T>(path)           api.post<T>(path, body)
api.put<T>(path, body)     api.delete<T>(path)
```

It auto-attaches `Accept: application/json`, `Content-Type` and the
`Authorization: Bearer <token>` header (token held in memory, set via
`setAuthToken`, owned by `AuthProvider`). Non-2xx responses throw `ApiError`
carrying `status` and Laravel's `errors` object, with a `fieldError(field)`
helper for rendering messages under inputs.

**Note:** this client always JSON-encodes the body, so it cannot send
`multipart/form-data` as written — file uploads will need a small addition.

## 6. Existing API endpoints (18 routes)

```
Public
  GET    /api/formations
  GET    /api/formations/{formation}
  POST   /api/inscriptions                       (throttle 10/min)
  GET    /api/inscriptions/{reference}
  POST   /api/auth/login                         (throttle 5/min)

Authenticated (auth:sanctum)
  POST   /api/auth/logout
  GET    /api/auth/me

Admin / organisateur
  GET    /api/admin/formations
  POST   /api/admin/formations
  GET    /api/admin/formations/{formation}
  PUT    /api/admin/formations/{formation}
  DELETE /api/admin/formations/{formation}
  GET    /api/admin/formations/{formation}/inscrits
  GET    /api/admin/inscriptions
  GET    /api/admin/inscriptions/{inscription}
  PUT    /api/admin/inscriptions/{inscription}/statut
  DELETE /api/admin/inscriptions/{inscription}
  POST   /api/admin/inscriptions/suppression-multiple
```

## 7. Current status — honest assessment

| Phase | Status | Detail |
|---|---|---|
| 1 Architecture | **Done** | models, enums, migrations, auth, permissions |
| 2 UI/UX | **Done** | design system, responsive, 30+ pages |
| 3 Public site | **Done** | all public pages built |
| 4 Registration & courses | **~85%** | works end-to-end, one gap (below) |
| 5 Jobseeker space | **Not started** | no models, no API, UI shell only |
| 6 Recruiter space | **Not started** | same |
| 7 Matching & interviews | **Not started** | same |
| 8 Admin back-office | **~30%** | 13 admin pages exist; only formations + inscriptions wired to API, rest are static shells |
| 9 Security & deploy | **Not started** | nothing deployed yet |

### Phase 4 — what works (verified by live API test)

Submitting a registration successfully: generates reference `#INS2026-0001`,
reserves the seat (`inscriptions_count` increments), dispatches the confirmation
email ("Votre inscription au SANEM — #INS2026-0001"), and correctly rejects
course selection for `visiteur` participation type with a 422.

Built: multi-step registration wizard, participation types, course selection,
capacity/quota handling (`GestionPlaces`), validation, confirmation email,
admin validate/cancel notifications.

### Phase 4 — the remaining gap: document upload

The pieces exist but are **not connected**:
- `DocumentInscription` model — exists
- `documents_inscription` table — exists
- `TypeDocument` enum — exists
- `DocumentsSection.tsx` component — exists
- **No upload API endpoint** — `route:list` shows zero document routes

So the UI can show a file picker but nothing receives the file.
**This is what I want to finish to close Phase 4.**

## 8. What I want from you

Work **phase by phase**. Before writing code for a phase, help me understand
the scope and agree an approach; then implement it.

**Immediate task: close Phase 4 by implementing document upload.**

Roughly what's needed:
- `POST /api/inscriptions/{reference}/documents` endpoint
- Validation: allowed MIME types, max file size, allowed `TypeDocument` values
- Store the file and persist `nom_original`, `chemin`, `mime`, `taille`
- Wire `DocumentsSection.tsx` to it (the `api.ts` client needs multipart support)
- Let admins view/download uploaded documents
- Probably: delete a document, and guard who may upload/read

Please follow the existing French naming and the established patterns
(FormRequest for validation, API Resource for responses, enum-backed columns).

**After that: Phase 5 (Espace Demandeur d'emploi).**

## 9. Open questions I should settle with my client

My proposal document lists things to confirm before development, and some are
still unsettled. Flag these if they block you:
- Final event date/venue/content (the date changed twice recently)
- **Phase 7 matching approach: criteria-based or AI/intelligent?** — this is a
  big scope difference for the same 100 USD
- Final email/notification service and external integrations
- Production hosting/server and domain access

---

### A note for you, Ali (not part of the prompt — don't paste this)

Two things worth deciding before you send it:

1. **The Phase 7 matching question is a genuine commercial risk.** "Criteria-based
   or AI" is the difference between a few days and a few weeks of work, at the
   same 100 USD. Pin it down with the client in writing.
2. **Phases 5–7 are ~half the remaining contract and are at zero.** You're 3 of 9
   phases in but closer to 35% of the actual work. Worth knowing before you
   commit to a delivery date.
