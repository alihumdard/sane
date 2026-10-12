# SANEM — French ka matlab (testing ke liye)

> Site French mein hai kyunki **Niger ki official language French hai**.
> Ye galti nahi — contract document bhi French mein tha, aur client Niger ka hai.
> Ye file sirf aapki testing aasan karne ke liye hai.

---

## 1. Upar ka menu (Header)

| French | Urdu/English | Kahan le jaata hai |
|---|---|---|
| **Accueil** | Home / Mukhya safha | `/` |
| **À propos** | Hamaray baare mein | `/a-propos` |
| **Programme** | Event ka program | `/programme` |
| **Formations** | Training courses | `/formations` |
| **Emploi** | Jobs / Naukri | `/emploi` |
| **Intervenants** | Speakers / Mehmaan | `/intervenants` |
| **Partenaires** | Partners | `/partenaires` |
| **Actualités** | News / Khabrein | `/actualites` |
| **Contact** | Raabta | `/contact` |
| **Se connecter** | **Login** | `/connexion` |
| **S'inscrire** | **Register (event ke liye)** | `/inscription` |

> **Dhyan dein:** Do alag registration hain —
> - **S'inscrire** (`/inscription`) = **event** mein shirkat ke liye
> - **Créer un compte** (`/creer-compte`) = **job portal** ka account

---

## 2. Buttons (sabse zyada nazar aane wale)

| French | Matlab |
|---|---|
| **Enregistrer** | Save karein |
| **Envoyer** | Bhejein / Submit |
| **Valider** | Confirm karein |
| **Annuler** | Cancel karein |
| **Supprimer** | Delete karein |
| **Modifier** | Edit karein |
| **Ajouter** | Add karein |
| **Choisir un fichier** | File chunein |
| **Remplacer** | Replace karein |
| **Télécharger** | Download karein |
| **Rechercher** | Search karein |
| **Réinitialiser les filtres** | Filters reset karein |
| **Suivant / Précédent** | Next / Previous |
| **Étape suivante** | Agla step |
| **Se déconnecter** | Logout |
| **Publier** | Publish karein |
| **Enregistrer en brouillon** | Draft mein save karein |
| **Postuler** | Job par apply karein |
| **Confirmer ma présence** | Apni hazri confirm karein |
| **Recalculer** | Dobara calculate karein |
| **Exporter** | Export / Download CSV |

---

## 3. Registration form ke fields (Phase 4)

| French | Matlab |
|---|---|
| **Type de participation** | Kis tarah shirkat karenge |
| **Visiteur** | Sirf dekhne aayenge |
| **Participant aux formations** | Training mein hissa lenge |
| **Entreprise** | Company ki taraf se |
| **Recruteur** | Recruiter ki taraf se |
| **Nom** | Naam |
| **Email** | Email |
| **Téléphone** | Phone number |
| **Naissance** | Date of birth |
| **Genre** | Gender (Homme = Mard, Femme = Aurat) |
| **Nationalité** | Qaumiyat |
| **Ville** | Sheher |
| **Niveau** | Taleem ka level |
| **Statut professionnel** | Pesha / job ki soorat-e-haal |
| **Domaine** | Field / shoba |
| **Expérience** | Tajurba |
| **Parcours** | Taleemi/pesha-warana safar |
| **Centres d'intérêt** | Dilchaspi ke shobe |
| **Source** | Aap ko SANEM ka kaise pata chala |
| **Newsletter** | Email updates chahiye? |
| **Consentement** | Shara'it manzoor hain (**zaroori hai**) |

---

## 4. Documents (Phase 4 ka upload section)

| French | Matlab |
|---|---|
| **Vos documents** | Aapke documents |
| **Pièce d'identité** | Shanakhti card / ID |
| **CV à jour** | Updated CV |
| **Lettre de motivation** | Cover letter |
| **Photo d'identité** | Passport size photo |
| **(optionnelle)** | Marzi se — zaroori nahi |
| **max 2 Mo** | Zyada se zyada 2 MB |
| **Vous pouvez les envoyer maintenant ou plus tard** | Abhi bhejein ya baad mein |

---

## 5. Status / halat ke alfaz

### Inscription (registration)
| French | Matlab |
|---|---|
| **En attente** | Intezaar mein (abhi approve nahi hui) |
| **Confirmée** | Confirm ho gayi |
| **Annulée** | Cancel ho gayi |

### Candidature (job application)
| French | Matlab |
|---|---|
| **Envoyée** | Bhej di gayi |
| **En revue** | Dekhi ja rahi hai |
| **Présélectionnée** | Shortlist ho gayi |
| **Entretien** | Interview ke liye chuni gayi |
| **Acceptée** | Qabool ho gayi |
| **Refusée** | Mustarad ho gayi |

### Offre (job posting)
| French | Matlab |
|---|---|
| **Brouillon** | Draft (abhi publish nahi hui) |
| **Publiée** | Publish ho gayi |
| **Pourvue** | Post bhar gayi |
| **Expirée** | Tareekh guzar gayi |
| **Fermée** | Band kar di gayi |

### Entretien (interview)
| French | Matlab |
|---|---|
| **En attente** | Candidate ke jawab ka intezaar |
| **Confirmé** | Candidate ne confirm kar diya |
| **Terminé** | Ho chuka |
| **Annulé** | Cancel ho gaya |

---

## 6. Error messages — kya kehna chah rahe hain

| French message | Matlab | Kya karein |
|---|---|---|
| **Trop de requêtes. Veuillez patienter…** | Bohat zyada requests — thoda rukein | 1 minute wait karein (rate limit) |
| **Authentification requise.** | Login zaroori hai | Login karein |
| **Ressource introuvable.** | Cheez nahi mili | URL check karein |
| **Vous avez déjà postulé à cette offre.** | Is job par pehle hi apply kar chuke hain | Normal — dobara apply nahi hota |
| **L'adresse email ne correspond pas…** | Email match nahi kar raha | Wohi email dein jo registration mein tha |
| **doit être au format PDF** | File PDF honi chahiye | Sahi format ki file dein |
| **ne doit pas dépasser 2 Mo** | 2 MB se bari nahi ho sakti | Chhoti file dein |
| **Vous devez accepter les conditions** | Shara'it manzoor karni hongi | Consent checkbox tick karein |
| **Une inscription existe déjà avec cette adresse email** | Is email se pehle registration ho chuki | Doosra email use karein |
| **Un compte existe déjà avec cette adresse email** | Is email ka account pehle se hai | Login karein ya doosra email |
| **Ce créneau vient d'être réservé** | Ye time slot abhi book ho gaya | Doosra slot chunein |
| **Votre entreprise doit être vérifiée…** | Company verify honi chahiye | Admin se verify karwayein |
| **Vous ne pouvez pas retirer vos propres droits** | Apne admin rights khud nahi hata sakte | Ye security feature hai — sahi hai |

---

## 7. Success messages

| French | Matlab |
|---|---|
| **Votre inscription a bien été enregistrée** | Aapki registration ho gayi |
| **a bien été envoyé** | Kamyabi se bhej diya gaya |
| **Profil mis à jour** | Profile update ho gayi |
| **Offre publiée** | Job publish ho gayi |
| **Votre candidature a bien été envoyée** | Application bhej di gayi |
| **Votre présence est confirmée** | Aapki hazri confirm ho gayi |
| **Élément créé / supprimé** | Cheez ban gayi / delete ho gayi |
| **Entreprise vérifiée** | Company verify ho gayi |

---

## 8. Dashboard / Admin ke alfaz

| French | Matlab |
|---|---|
| **Tableau de bord** | Dashboard |
| **Utilisateurs** | Users |
| **Mes offres** | Meri job postings |
| **Candidatures** | Job applications |
| **Candidats correspondants** | Matching candidates |
| **Rechercher des profils** | Profiles search karein |
| **Mon entreprise** | Meri company |
| **Entretiens** | Interviews |
| **Créneaux** | Time slots |
| **Rapports** | Reports |
| **Paramètres** | Settings |
| **Inscriptions** | Registrations |
| **Mon profil** | Meri profile |
| **Mes candidatures** | Meri applications |
| **Mes favoris** | Mere favourites |
| **Taux de remplissage** | Kitni seats bhar gayin |
| **Places restantes** | Baqi seats |
| **Vues** | Kitni baar dekha gaya |
| **Vérifiée** | Verified |
| **Visible par les recruteurs** | Recruiters ko nazar aayega |

---

## 9. Kya language change ho sakti hai?

**Abhi site sirf French mein hai.** Multi-language (French + English) **contract mein nahi tha**, is liye nahi banaya gaya.

Agar client baad mein chahe to:
- Next.js ka built-in i18n use ho sakta hai
- Lekin **poori site ke saare texts** translate karne honge (30+ pages)
- Backend ke messages bhi (validation, emails)
- Ye alag kaam hai — naya quote banega

**Testing ke liye language change karne ki zaroorat nahi** — ye file har French word ka matlab deti hai.

---

## 10. Browser se translate karna (sirf dekhne ke liye)

Agar aap jaldi se samajhna chahein:

**Chrome:** Page par right-click → **"Translate to English"**

> **Lekin testing ke waqt original French hi rakhein** — warna aap check nahi kar sakenge ke
> asal message sahi aa raha hai ya nahi. Translation ke liye ye file behtar hai.
