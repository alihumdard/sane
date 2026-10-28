n56ZmOGNWvAk@!

# Livraison — Phase 5
## Espace Demandeur d'Emploi

**Projet :** SANEM — Salon National de l'Emploi
**Date :** 12 octobre 2026
**Statut :** Livré, prêt pour recette

---

## 1. Ce que la phase couvre

La phase 5 ouvre la plateforme aux demandeurs d'emploi : ils créent un compte,
constituent un profil professionnel complet, consultent les offres publiées par
les entreprises et postulent en ligne en suivant l'avancement de chaque
candidature.

Le portail est distinct de l'inscription au salon (phase 4) : une personne peut
s'inscrire à l'événement sans créer de compte, et inversement.

---

## 2. Fonctionnalités livrées

### 2.1 Création de compte et connexion

| Fonction | Détail |
|---|---|
| Création de compte autonome | Nom, email, téléphone, mot de passe. Deux types : **Demandeur d'emploi** ou **Recruteur** |
| Connexion / déconnexion | Email + mot de passe, redirection automatique vers l'espace correspondant |
| Comptes désactivés | Refusés avec un message explicite |
| Protection contre les attaques | 5 tentatives par minute maximum |

Les rôles administrateur et organisateur ne peuvent pas être choisis à
l'inscription : ils sont créés uniquement depuis le back-office.

### 2.2 Le profil professionnel

Le demandeur renseigne et modifie lui-même :

**Informations professionnelles**
- Titre professionnel
- Secteur d'activité
- Ville
- Type d'emploi recherché
- Disponibilité
- Présentation (texte libre)
- LinkedIn et portfolio
- **Visibilité aux recruteurs** — désactivée par défaut, le candidat choisit d'apparaître ou non dans l'annuaire

**CV**
- Téléversement, téléchargement et suppression
- Format PDF uniquement, 2 Mo maximum
- Le fichier est vérifié à l'ouverture : un fichier renommé en `.pdf` est refusé
- Stockage privé : le CV n'est jamais accessible par une adresse devinable

**Compétences**
- Ajout avec un niveau : Débutant, Intermédiaire, Avancé, Expert
- Suppression en un clic

**Formation académique**
- Diplôme, établissement, domaine, années de début et de fin
- Case « en cours » pour une formation non terminée

**Expérience professionnelle**
- Poste, entreprise, lieu, dates
- Case « poste actuel »

**Taux de complétion**
Un pourcentage calculé sur huit critères (titre, présentation, secteur, ville,
au moins une compétence, une formation, une expérience et un CV) guide le
candidat vers un profil complet.

### 2.3 Le portail des offres

**Consultation sans compte** — les offres sont publiques ; le compte n'est
exigé qu'au moment de postuler.

| Fonction | Détail |
|---|---|
| Liste des offres | 12 par page, triées de la plus récente à la plus ancienne |
| Recherche par mots-clés | Porte sur l'intitulé, la description **et le nom de l'entreprise** |
| Filtre par secteur | Avec le nombre d'offres pour chaque valeur |
| Filtre par ville | Idem |
| Filtre par type de contrat | Idem |
| Réinitialisation | Un lien efface tous les filtres |

Seules les offres publiées et dont la date limite n'est pas dépassée
apparaissent. Les brouillons, offres closes et offres expirées sont exclus
automatiquement.

**Fiche de l'offre**
Intitulé, entreprise (avec mention « Vérifiée » le cas échéant), lieu, contrat,
secteur, expérience requise, niveau d'étude, rémunération, date limite, puis
description du poste, missions, profil recherché et présentation de
l'entreprise.

Chaque fiche a sa propre adresse, partageable et référençable par les moteurs
de recherche.

### 2.4 Candidater

Depuis la fiche de l'offre, le candidat connecté envoie sa candidature avec une
**lettre de motivation facultative** (5 000 caractères). Son profil et son CV
sont transmis automatiquement.

En retour il reçoit immédiatement une **référence de suivi** à l'écran.

**Règles appliquées**
- Une seule candidature par offre et par candidat
- Impossible de postuler à une offre close ou expirée
- Un recruteur ne peut pas postuler (message explicite)
- Un visiteur non connecté est invité à se connecter et revient sur l'offre

### 2.5 Suivi des candidatures

Le tableau de bord du candidat affiche chaque candidature avec l'intitulé du
poste, l'entreprise, la référence et le statut :

**Envoyée → En revue → Présélectionnée → Entretien → Acceptée / Refusée**

Les notes internes du recruteur ne sont jamais visibles par le candidat.

### 2.6 Entretiens

Le candidat dispose d'un espace entretiens où il consulte les entretiens
proposés (poste, entreprise, date, heure, mode et lieu), puis **confirme** ou
**annule**. Un email part à chaque étape, plus un rappel automatique avant la
date.

### 2.7 Offres recommandées

En complément du cahier des charges, le tableau de bord suggère au candidat des
offres correspondant à son profil, avec un pourcentage de correspondance calculé
sur le secteur, les compétences, la ville et l'expérience.

---

## 3. Sécurité

- Chaque action est résolue à partir du compte connecté, jamais d'un
  identifiant passé dans l'adresse : un candidat ne peut pas consulter ni
  modifier le dossier d'un autre.
- Les CV ne sont téléchargeables que par leur propriétaire, par l'équipe
  d'organisation, et par un recruteur **uniquement si le candidat a postulé à
  une de ses offres**. Consulter l'annuaire des candidats ne donne pas accès
  aux CV.
- Les mots de passe exigent au minimum 8 caractères dont une lettre et un
  chiffre.
- Les envois de fichiers et les candidatures sont limités en fréquence pour
  prévenir les abus.

**173 tests automatisés** couvrent l'ensemble des phases livrées, dont le
cloisonnement entre entreprises et les règles d'accès aux documents.

---

## 4. Points à finaliser

Par souci de transparence, voici ce qui n'est pas encore utilisable :

| Élément | État | Charge estimée |
|---|---|---|
| **Réinitialisation du mot de passe** | Non développé. Un utilisateur ayant oublié son mot de passe doit passer par l'administrateur | 1 jour |
| **Notifications par email au candidat** | Aucun email n'est envoyé à la création du compte, à l'envoi d'une candidature, ni au changement de statut. Le candidat doit se connecter pour voir l'évolution | 1 jour |
| **Centre de notifications dans l'interface** | Non développé | 2 jours |
| **Offres favorites** | Développé côté serveur et testé, mais **aucun bouton dans l'interface** — la fonction est inatteignable en l'état | 0,5 jour |
| **Retrait d'une candidature** | Disponible côté serveur, bouton absent de l'interface | 0,5 jour |
| **Détail d'une candidature** | Le candidat ne peut pas relire la lettre qu'il a envoyée | 0,5 jour |
| **Modification d'une formation ou d'une expérience** | Ajout et suppression uniquement ; pas de bouton « Modifier » | 0,5 jour |
| **Liste des candidatures au-delà de 15** | Les 15 premières seulement sont affichées, sans pagination | 0,5 jour |
| **Filtre par salaire et tri des offres** | Prêts côté serveur, non exposés dans l'interface | 0,5 jour |

**Total des finitions : 7 jours.**

Ces points sont pour la plupart des ajouts d'interface sur des fonctions déjà
développées et testées côté serveur — ils ne remettent pas en cause
l'architecture livrée.

---

## 5. Recette

Pour valider la livraison, nous suggérons ce parcours :

1. Créer un compte demandeur d'emploi sur `/creer-compte`
2. Compléter le profil : informations, CV, compétences, formation, expérience —
   vérifier que le taux de complétion progresse
3. Consulter `/emploi` sans être connecté, utiliser la recherche et les trois
   filtres
4. Ouvrir une offre, postuler avec une lettre de motivation
5. Vérifier la référence reçue et le suivi sur le tableau de bord
6. Tenter de postuler une seconde fois à la même offre — l'action doit être
   refusée

Nous restons disponibles pour accompagner cette recette.
