# SANEM — Guide de test et de mise en route

> Pour : Ali (développeur) et toute personne qui vérifie la plateforme avant livraison.
> Dernière vérification : 11 octobre 2026 · 154 tests backend au vert · build de production OK.

---

## 1. Démarrer la plateforme

Deux serveurs, deux terminaux. Les deux doivent tourner en même temps.

```bash
# Terminal 1 — API (port 8000)
cd backend
php artisan serve

# Terminal 2 — site (port 3000)
cd frontend
npm run dev
```

Vérification rapide : [http://localhost:3000](http://localhost:3000) doit s'afficher, et
[http://localhost:8000/api/offres](http://localhost:8000/api/offres) doit renvoyer du JSON.

### Si la base est vide

```bash
cd backend
php artisan migrate:fresh --seed          # structure + données de base
php artisan db:seed --class=EmploiSeeder  # 8 entreprises, 8 offres
php artisan db:seed --class=ContenuSeeder # actualités, FAQ, partenaires, presse
```

### Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@sanem.ne` | *(voir `SanemSeeder`)* |
| Recruteur | `recrutement@giz.example.ne` | `sanem2026` |
| Demandeur d'emploi | à créer via `/creer-compte` | — |

---

## 2. Les cinq parcours à tester

Testez dans cet ordre : chacun prépare le suivant.

### Parcours A — Visiteur (sans compte)

| # | Action | Résultat attendu |
|---|---|---|
| A1 | Ouvrir `/` | La page d'accueil s'affiche, le compte à rebours tourne |
| A2 | Ouvrir `/emploi` | Les offres s'affichent avec leur entreprise |
| A3 | Taper « développeur » dans la recherche | La liste se filtre après ~0,3 s |
| A4 | Choisir un secteur, puis une ville | Les compteurs entre parenthèses correspondent aux résultats |
| A5 | Cliquer « Réinitialiser les filtres » | Toutes les offres reviennent |
| A6 | Cliquer sur une offre | La page détail s'affiche avec missions, profil, salaire |
| A7 | Cliquer « Postuler » sans être connecté | Invitation à se connecter, **pas** de formulaire |
| A8 | Ouvrir `/actualites`, `/formations` | Contenus affichés depuis la base |

### Parcours B — Inscription à l'événement (Phase 4)

| # | Action | Résultat attendu |
|---|---|---|
| B1 | `/inscription`, choisir « Participant aux formations » | L'étape Formations apparaît dans le parcours |
| B2 | Choisir « Visiteur » à la place | L'étape Formations **disparaît** |
| B3 | Remplir les étapes, cocher le consentement, valider | Référence `#INS2026-XXXX` affichée |
| B4 | Sur l'écran de confirmation, déposer un CV en PDF | Fichier accepté, taille affichée |
| B5 | Essayer de déposer un `.docx` comme CV | Refus : « doit être au format PDF » |
| B6 | Essayer un fichier de plus de 2 Mo | Refus : « ne doit pas dépasser 2 Mo » |
| B7 | Re-déposer un autre CV | Remplace le premier, pas de doublon |

### Parcours C — Demandeur d'emploi (Phases 5 et 7)

| # | Action | Résultat attendu |
|---|---|---|
| C1 | `/creer-compte`, type « Demandeur d'emploi » | Compte créé, redirection vers `/dashboard/participant` |
| C2 | Mot de passe « abc » | Refus : minimum 8 caractères avec lettres et chiffres |
| C3 | Même email une seconde fois | Refus : « Un compte existe déjà » |
| C4 | `/dashboard/profil` : remplir titre, secteur, ville | Le taux de complétion augmente |
| C5 | Ajouter 3 compétences | Elles apparaissent sous forme d'étiquettes |
| C6 | Ré-ajouter la même compétence à un autre niveau | Le niveau change, **pas** de doublon |
| C7 | Ajouter une expérience et une formation | Listées avec leurs dates |
| C8 | Déposer un CV (PDF) | Visible, téléchargeable |
| C9 | Cocher « Rendre mon profil visible » | Badge « Visible par les recruteurs » |
| C10 | `/emploi`, postuler à une offre | Référence `#CAN2026-XXXX` |
| C11 | Re-postuler à la **même** offre | Refus : « Vous avez déjà postulé » |
| C12 | `/dashboard/participant` | Candidature listée avec son statut |

### Parcours D — Recruteur (Phases 6 et 7)

Connectez-vous avec `recrutement@giz.example.ne` / `sanem2026`.

| # | Action | Résultat attendu |
|---|---|---|
| D1 | `/dashboard/recruteur` | Compteurs : offres, candidatures, vues |
| D2 | « Mes offres » | **Uniquement** les offres de GIZ |
| D3 | Créer une offre, « Enregistrer en brouillon » | Statut Brouillon |
| D4 | Vérifier sur `/emploi` (autre onglet) | Le brouillon **n'apparaît pas** |
| D5 | Publier l'offre | Elle apparaît sur `/emploi` |
| D6 | Salaire min 900 000 / max 300 000 | Refus : le maximum doit dépasser le minimum |
| D7 | « Candidatures » | Les candidatures reçues par GIZ uniquement |
| D8 | Faire avancer une candidature | Le statut change immédiatement |
| D9 | Télécharger le CV d'un candidat | Le PDF se télécharge |
| D10 | « Candidats correspondants », choisir une offre, « Recalculer » | Scores avec **le détail** : secteur, compétences, ville… |
| D11 | « Rechercher des profils » | Aucun email ni téléphone affiché |
| D12 | « Entretiens » : créer un créneau visio | Créneau listé comme disponible |
| D13 | Créer un créneau présentiel **sans lieu** | Refus : un lieu est nécessaire |
| D14 | Créer un créneau qui en chevauche un autre | Refus : chevauchement |
| D15 | Depuis une candidature, proposer ce créneau | Entretien créé, créneau marqué réservé |
| D16 | Proposer **le même** créneau à un autre candidat | Refus : déjà réservé |

### Parcours E — Entretien côté candidat (Phase 7)

Revenez sur le compte demandeur.

| # | Action | Résultat attendu |
|---|---|---|
| E1 | `/dashboard/entretiens` | L'entretien proposé apparaît, statut « En attente » |
| E2 | « Confirmer ma présence » | Statut « Confirmé » |
| E3 | Côté recruteur, annuler l'entretien | Le créneau redevient disponible |
| E4 | Côté candidat, essayer de confirmer l'entretien annulé | Refus |
| E5 | Sur `/dashboard/entretiens`, section « Offres qui vous correspondent » | Offres avec score et raisons |

### Parcours F — Administrateur (Phase 8)

Connectez-vous avec le compte administrateur.

| # | Action | Résultat attendu |
|---|---|---|
| F1 | `/dashboard/admin/rapports` | Statistiques réelles : inscriptions, formations, emploi |
| F2 | « Exporter » inscriptions / candidatures / offres | Un `.csv` se télécharge |
| F3 | Ouvrir le CSV dans Excel | **Les accents s'affichent correctement** (é, à, ç) |
| F4 | `/dashboard/admin/utilisateurs` | Liste réelle avec rôles et statuts |
| F5 | Changer le rôle d'un utilisateur | Appliqué immédiatement |
| F6 | Suspendre un compte, puis tenter de s'y connecter | Connexion refusée |
| F7 | **Essayer de changer son propre rôle en « participant »** | **Refus** : droits non retirables |
| F8 | **Essayer de supprimer son propre compte** | **Refus** |
| F9 | `/dashboard/admin/actualites` : créer une actualité publiée | Visible immédiatement sur `/actualites` |
| F10 | La dé-publier | Elle disparaît du site public |
| F11 | `/dashboard/admin/emploi` → Entreprises : retirer une vérification | Ses offres publiées sont **fermées** |
| F12 | `/dashboard/admin/faq` : ajouter une question publiée | Visible sur `/faq` *(voir réserve §5)* |

---

## 3. Tests de sécurité à refaire vous-même

Ce sont les points qui coûtent cher s'ils cèdent. Tous passent aujourd'hui.

| # | Test | Attendu |
|---|---|---|
| S1 | Créer un compte avec `"role": "administrateur"` via l'API | **422** — rôle non attribuable |
| S2 | Avec le compte A, ouvrir une candidature du compte B | **403** |
| S3 | Avec l'entreprise A, modifier une offre de l'entreprise B | **403** |
| S4 | Avec l'entreprise A, lister les entretiens de B | **0 résultat** |
| S5 | Renommer un `.exe` en `.pdf` et le déposer en CV | **422** — le contenu est analysé, pas l'extension |
| S6 | Appeler `/api/profil` sans jeton | **401** JSON, pas de page HTML |
| S7 | Appeler `/api/offres/nimportequoi` | **404** générique, sans nom de modèle |
| S8 | Chercher un CV par URL directe | Impossible : disque privé, route authentifiée |

Exemple pour S1 :

```bash
curl -X POST http://127.0.0.1:8000/api/auth/inscription \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"nom":"X","email":"x@y.ne","password":"sanem2026","password_confirmation":"sanem2026","role":"administrateur"}'
```

---

## 4. Tests automatisés

```bash
cd backend
php artisan test                      # 154 tests
php artisan test --filter=EmploiApi   # un fichier en particulier
```

```bash
cd frontend
npx tsc --noEmit    # types
npm run build       # build de production — doit réussir
```

**Faites-les tourner avant chaque livraison.** Le build de production attrape des erreurs
que `npm run dev` masque : c'est ainsi qu'a été trouvé le blocage de `/connexion`.

### Commandes de maintenance

```bash
php artisan sanem:rappels-entretiens              # rappels J-1 (planifié toutes les heures)
php artisan sanem:reconcilier-compteurs --dry-run # détecte les compteurs désynchronisés
php artisan sanem:reconcilier-compteurs           # les corrige
```

En production, une seule ligne de cron fait tourner le planificateur :

```
* * * * * cd /chemin/du/projet/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 5. Ce qui n'est pas terminé — à savoir avant de livrer

| # | Point | Impact |
|---|---|---|
| 1 | **Aucun email ne part réellement** (`MAIL_MAILER=log`) | **Bloquant.** Confirmations d'inscription, propositions d'entretien, rappels : tout est écrit dans `storage/logs/laravel.log` au lieu d'être envoyé. Un candidat ne saura jamais qu'il a un entretien. À régler avant toute mise en ligne. |
| 2 | Backend non déployé | Vercel n'exécute pas PHP. Prévoir Railway, Render, Fly.io ou un VPS. |
| 3 | 4 pages admin encore statiques | Événements, intervenants, notifications, paramètres. |
| 4 | FAQ publique lit encore ses données de build | L'API et l'admin fonctionnent ; seule cette page ne les consomme pas, car ses données structurées SEO en dépendent. |
| 5 | Pas de « mot de passe oublié » | Un utilisateur qui oublie son mot de passe doit passer par un administrateur. Dépend du point 1. |
| 6 | Google Analytics et carte interactive | Prévus au contrat (Phase 9), pas encore intégrés. |
| 7 | Pas de CSP | À écrire contre les vraies origines de production, pas avant. |

### Vérifications avant mise en ligne

- [ ] Service email configuré et **testé** avec un vrai envoi
- [ ] `APP_DEBUG=false` et `APP_ENV=production`
- [ ] `APP_KEY` généré sur le serveur, jamais recopié
- [ ] `FRONTEND_URL_PROD` renseigné (CORS)
- [ ] `NEXT_PUBLIC_API_URL` pointant vers l'API de production
- [ ] HTTPS actif des deux côtés
- [ ] Sauvegarde quotidienne base + `storage/app/private`, **restauration testée**
- [ ] Vercel : *Root Directory* réglé sur `frontend`
- [ ] `php artisan migrate --force` sur le serveur
- [ ] Cron du planificateur en place

---

## 6. En cas de problème

| Symptôme | Cause probable | Vérification |
|---|---|---|
| « Impossible de joindre le serveur » | API arrêtée | `curl http://127.0.0.1:8000/api/offres` |
| Page blanche après connexion | Jeton rejeté | Console du navigateur, onglet Réseau |
| Erreur CORS | Origine non autorisée | `FRONTEND_URL` dans `backend/.env` |
| Aucune offre affichée | Base non alimentée | `php artisan db:seed --class=EmploiSeeder` |
| Email jamais reçu | `MAIL_MAILER=log` | `tail storage/logs/laravel.log` |
| Un compteur semble faux | Désynchronisation | `php artisan sanem:reconcilier-compteurs --dry-run` |
| Le build échoue | Erreur masquée en dev | Lire la sortie de `npm run build` en entier |
