# SANEM — Testing Roadmap (Roman Urdu)

> Ye guide aapko step-by-step batata hai ke poori platform kaise test karni hai.
> Har step mein: **kya karna hai** aur **kya hona chahiye**.
> Agar expected result na aaye — wo bug hai, note kar lein.

---

## PEHLE: Setup (5 minute)

### 1. Dono server start karein

Do alag terminal kholein:

```bash
# Terminal 1 — Backend (API)
cd G:\sanem\backend
php artisan serve
```

```bash
# Terminal 2 — Frontend (website)
cd G:\sanem\frontend
npm run dev
```

### 2. Check karein ke chal rahe hain

Browser mein kholein:
- `http://localhost:3000` → website khulni chahiye
- `http://localhost:8000/api/offres` → JSON data aana chahiye

**Agar dono theek hain to aage barhein.**

### 3. Login ke accounts

| Kaun | Email | Password |
|---|---|---|
| Admin | `admin@sanem.ne` | `changeme` |
| Recruiter (GIZ) | `recrutement@giz.example.ne` | `sanem2026` |
| Recruiter (Enabel) | `recrutement@enabel.example.ne` | `sanem2026` |
| Job seeker | Aap khud banayenge (Test 3 mein) | — |

> **Zaroori:** Do recruiter accounts isliye diye hain taake aap check kar sakein
> ke ek company doosri ki information **nahi** dekh sakti.

### 4. Agar database khali ho

```bash
cd G:\sanem\backend
php artisan migrate:fresh --seed
php artisan db:seed --class=EmploiSeeder
php artisan db:seed --class=ContenuSeeder
```

### 5. ZAROORI: "Trop de requêtes" ka matlab

Testing ke dauran agar ye message aaye:

> `Trop de requêtes. Veuillez patienter quelques instants.` (HTTP 429)

**Ye bug nahi — security feature hai.** Login par limit hai: **5 koshish per minute**.
Brute-force attack rokne ke liye hai.

**Hal:** 1 minute ruk jaayen, phir dobara try karein.

Limits:
| Kya | Limit |
|---|---|
| Login | 5 / minute |
| Account banana | 5 / minute |
| Event registration | 10 / minute |
| File upload | 20 / minute |
| Job par apply | 20 / minute |

> Agar aap tez tez testing kar rahe hain to ye baar baar aayega — ghabrayen nahi,
> bas thoda ruk jaayen. Ye production mein zaroori hai.

---

## TEST 1 — Public website (bina login ke)

**Maqsad:** Dekhna ke aam visitor ko sab kuch theek dikhta hai.

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 1.1 | `localhost:3000` kholein | Homepage khule, countdown timer chale |
| 1.2 | `/emploi` par jaayen | 8 job offers dikhain, har ek ke saath company ka naam |
| 1.3 | Search box mein `developpeur` likhein | ~0.3 second baad list filter ho jaaye |
| 1.4 | Search clear karein, "Secteur" dropdown se koi secteur chunein | Sirf us secteur ki jobs dikhain |
| 1.5 | Dropdown mein numbers dekhein, jaise `Niamey (7)` | Number aur actual results match karein |
| 1.6 | "Réinitialiser les filtres" click karein | Saari 8 offers wapas aa jaayen |
| 1.7 | Kisi bhi job par click karein | Detail page khule — missions, salary, profile |
| 1.8 | Us page par "Postuler" dekhen | **Form nahi** — sirf "Se connecter" ka button |
| 1.9 | `/actualites` kholein | 4 news articles dikhain |
| 1.10 | `/formations` kholein | 8 formations dikhain |
| 1.11 | Mobile view test karein (F12 → phone icon) | Sab kuch theek dikhe, horizontal scroll na ho |

**Agar 1.8 mein form dikh raha hai → bug hai** (bina login postuler nahi karna chahiye).

---

## TEST 2 — Event registration (Phase 4)

**Maqsad:** Salon mein participate karne ka form check karna.

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 2.1 | `/inscription` kholein | 6-step wizard shuru ho |
| 2.2 | "Participant aux formations" chunein | Steps mein **"Formations"** step aa jaaye |
| 2.3 | Wapas jaa kar "Visiteur" chunein | **"Formations" step gayab ho jaaye** |
| 2.4 | Phir se "Participant aux formations" chunein, aage barhein | Formations step dobara aa jaaye |
| 2.5 | Naam, email, phone bharein | Aage barhne de |
| 2.6 | Email galat format mein likhein (jaise `abc`) | Error dikhe |
| 2.7 | Last step par consent **check na karein**, submit karein | Error: consent zaroori hai |
| 2.8 | Consent check kar ke submit karein | Reference mile: `#INS2026-XXXX` |
| 2.9 | Reference note kar lein | — |

### Document upload (confirmation screen par)

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 2.10 | "Choisir un fichier" se ek PDF upload karein | Accept ho, file ka size dikhe |
| 2.11 | Ek Word file (.docx) CV ke tor par upload karein | **Reject** — "doit être au format PDF" |
| 2.12 | 2 MB se bari file upload karein | **Reject** — "ne doit pas dépasser 2 Mo" |
| 2.13 | Doosra PDF usi type ka upload karein | Purana replace ho jaaye, do copies na banein |

---

## TEST 3 — Job seeker ka poora safar (Phase 5)

**Ye sabse important test hai.** Poora candidate journey.

### 3A — Account banana

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 3.1 | `/creer-compte` kholein | Do option dikhain: Demandeur / Recruteur |
| 3.2 | "Demandeur d'emploi" chunein | Card highlight ho jaaye |
| 3.3 | Password `abc` daal kar submit karein | **Reject** — 8 characters, letters + numbers chahiye |
| 3.4 | Sahi data bharein, password `sanem2026` | Account bane, `/dashboard/participant` par pohanch jaayen |
| 3.5 | Logout kar ke **wohi email** dobara use karein | **Reject** — "Un compte existe déjà" |

> **Email yaad rakhein** jo aapne banaya — aage use hoga.

### 3B — Profile banana

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 3.6 | `/dashboard/profil` kholein | Profile form khule, completion % dikhe |
| 3.7 | Titre: `Développeur Web`, Secteur: `Informatique & Digital`, Ville: `Niamey` bhar kar save karein | Completion % **barh jaaye** |
| 3.8 | 3 skills add karein: `PHP`, `JavaScript`, `SQL` | Teeno tags ban kar dikhain |
| 3.9 | **`PHP` dobara add karein** lekin level `Expert` chunein | Level badal jaaye, **do PHP na banein** |
| 3.10 | Ek experience add karein (date_debut 3 saal pehle, "Poste actuel" check) | List mein aa jaaye |
| 3.11 | Ek formation (degree) add karein | List mein aa jaaye |
| 3.12 | Ek PDF CV upload karein | File dikhe, download button kaam kare |
| 3.13 | "Rendre mon profil visible" check kar ke save karein | Badge: "Visible par les recruteurs" |
| 3.14 | Completion % dobara dekhein | Pehle se kaafi zyada ho |

### 3C — Job par apply karna

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 3.15 | `/emploi` par jaayen, koi job kholein | Ab "Postuler" ka **poora form** dikhe |
| 3.16 | Motivation letter likh kar submit karein | Reference mile: `#CAN2026-XXXX` |
| 3.17 | **Usi job** par dobara apply karein | **Reject** — "Vous avez déjà postulé" |
| 3.18 | `/dashboard/participant` kholein | Candidature list mein dikhe, status ke saath |
| 3.19 | Dashboard ke counters dekhein | Candidatures = 1 |

---

## TEST 4 — Recruiter ka safar (Phase 6)

**Login:** `recrutement@giz.example.ne` / `sanem2026`

### 4A — Dashboard aur offers

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 4.1 | Login ke baad | `/dashboard/recruteur` par pohanchein, counters dikhain |
| 4.2 | "Mes offres" kholein | **Sirf GIZ ki offer** dikhe (1 offer), Enabel ki nahi |
| 4.3 | "Nouvelle offre" click karein | Form khule |
| 4.4 | Salaire min `900000`, max `300000` daal kar save karein | **Reject** — max, min se bara hona chahiye |
| 4.5 | Sahi data bhar kar **"Enregistrer en brouillon"** | Status = Brouillon |
| 4.6 | Naya tab khol kar `/emploi` dekhein | **Brouillon wahan nahi dikhna chahiye** |
| 4.7 | Wapas aa kar offer "Publier" karein | Status = Publiée |
| 4.8 | `/emploi` refresh karein | Ab offer dikhe |

### 4B — Candidatures

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 4.9 | "Candidatures" kholein | Test 3 wali candidature dikhe (agar GIZ ki job thi) |
| 4.10 | Status buttons par click kar ke "Présélectionnée" karein | Status turant badal jaaye |
| 4.11 | "CV" button click karein | PDF download ho |

### 4C — Candidate search (privacy test)

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 4.12 | "Rechercher des profils" kholein | Jo profiles visible hain wo dikhain |
| 4.13 | **Ghaur se dekhein: email ya phone number dikh raha hai?** | **NAHI dikhna chahiye** |
| 4.14 | Search box mein `PHP` likhein | Jin candidates ke paas PHP skill hai wo dikhain |

---

## TEST 5 — Matching aur Entretiens (Phase 7)

**Recruiter account par hi rahein.**

### 5A — Matching

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 5.1 | "Candidats correspondants" kholein | Offer select karne ka dropdown |
| 5.2 | Apni offer chunein, "Recalculer" click karein | Message: kitne candidates mile |
| 5.3 | Result dekhein | Har candidate ka **score (0-100)** aur **rang (circle)** |
| 5.4 | Score ke neeche detail dekhein | **5 criteria ke saath wajah likhi ho**, jaise "Même secteur : Informatique" |
| 5.5 | Total check karein | 5 criteria ke points mil kar score banta ho |

> **Ye sabse important point hai:** Score sirf number nahi — **wajah bhi dikhti hai**.
> Isi liye humne AI ki jagah criteria-based matching chuna tha.

### 5B — Créneaux (interview slots)

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 5.6 | "Entretiens" kholein | Créneau add karne ka form |
| 5.7 | Mode "Présentiel" chunein, **lieu khali chhorein**, submit | **Reject** — lieu zaroori hai |
| 5.8 | Mode "Visioconférence", kal ki date/time daal kar add karein | Créneau list mein aa jaaye |
| 5.9 | **Wohi time** dobara add karein | **Reject** — "chevauche un autre" (overlap) |
| 5.10 | Guzri hui date ka créneau banayein | **Reject** — future mein hona chahiye |

### 5C — Interview propose karna

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 5.11 | "Candidatures" mein jaa kar candidate ko interview propose karein (créneau chunein) | Entretien bane, reference `#ENT2026-XXXX` |
| 5.12 | Candidature ka status dekhein | Khud-ba-khud **"Entretien"** ho jaaye |
| 5.13 | "Entretiens" mein créneau dekhein | Ab **"réservé"** likha ho |
| 5.14 | **Usi créneau** ko doosre candidate ko dein | **Reject** — already reserved |

### 5D — Candidate side

**Ab job seeker account par logout/login karein.**

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 5.15 | `/dashboard/entretiens` kholein | Interview dikhe, status "En attente" |
| 5.16 | Date, time, mode sahi dikh raha hai? | Haan |
| 5.17 | "Confirmer ma présence" click karein | Status "Confirmé" ho jaaye |
| 5.18 | Neeche "Offres qui vous correspondent" dekhein | Matched offers score ke saath |

### 5E — Cancel karna

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 5.19 | Recruiter par wapas jaa kar entretien "Annuler" karein | Status "Annulé" |
| 5.20 | Créneaux list dekhein | Wo créneau **phir se available** ho jaaye |
| 5.21 | Candidate par jaa kar cancelled interview "Confirmer" karein | **Reject** — cancel ho chuka hai |

---

## TEST 6 — Admin back-office (Phase 8)

**Login:** `admin@sanem.ne` / `changeme`

### 6A — Statistics aur Export

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 6.1 | `/dashboard/admin/rapports` kholein | Real numbers dikhain (fake nahi) |
| 6.2 | Numbers verify karein | Offers 8, entreprises 8, etc. |
| 6.3 | "Inscriptions" export button click karein | `.csv` file download ho |
| 6.4 | **CSV ko Excel mein kholein** | **Accents sahi dikhne chahiye** (é, à, ç) — `Ã©` nahi |
| 6.5 | "Candidatures" aur "Offres" bhi export karein | Dono download hon |

### 6B — Users management

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 6.6 | `/dashboard/admin/utilisateurs` | 9+ users dikhain |
| 6.7 | Kisi user ka role dropdown se badlein | Turant save ho |
| 6.8 | Kisi user ko "Suspendu" karein | Status badal jaaye |
| 6.9 | Us suspended user se login try karein | **Login na ho** |
| 6.10 | **Apna hi role "participant" karne ki koshish karein** | **REJECT** — "Vous ne pouvez pas retirer vos propres droits" |
| 6.11 | **Apna hi account delete karne ki koshish** | **REJECT** |

> 6.10 aur 6.11 bohot zaroori hain — warna ek galti se poora back-office band ho sakta hai.

### 6C — Content management

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 6.12 | `/dashboard/admin/actualites` → "Ajouter" | Form khule |
| 6.13 | Title, category, content bhar kar **"Publier" check** kar ke save | List mein aa jaaye |
| 6.14 | Naya tab: `/actualites` | **Nayi news wahan dikhe** |
| 6.15 | Admin mein wapas jaa kar "Publier" **uncheck** karein | — |
| 6.16 | `/actualites` refresh karein | **News gayab ho jaaye** |
| 6.17 | `/dashboard/admin/faq`, `/partenaires`, `/presse` bhi test karein | Sab mein add/edit/delete chale |

### 6D — Company verification (important)

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 6.18 | `/dashboard/admin/emploi` → "Entreprises" tab | 8 companies, sab "Vérifiée" |
| 6.19 | `/emploi` par offers ginein | 8 offers |
| 6.20 | Kisi company ki verification **hata dein** | Warning aaye, phir confirm |
| 6.21 | `/emploi` refresh karein | **Us company ki offers band ho jaayen** (count kam ho) |
| 6.22 | Verification wapas dein | Message aaye |

---

## TEST 7 — Security tests (zaroor karein)

Ye wo tests hain jo **sabse zyada nuqsan** kar sakte hain agar fail hon.

### 7A — Browser se

| # | Kya karein | Kya hona chahiye |
|---|---|---|
| 7.1 | Do alag browser (ya normal + incognito) mein **do alag recruiter** login karein | — |
| 7.2 | GIZ wale mein offer ka ID note karein (URL se) | — |
| 7.3 | Enabel wale mein wohi URL kholein | **403 / access denied** |
| 7.4 | Enabel ki candidatures list dekhein | GIZ ki candidature **na dikhe** |
| 7.5 | Logout kar ke `/dashboard/admin` kholein | Login maange, data na dikhaye |

### 7B — Command line se

Terminal kholein aur ye commands chalayein:

```bash
# Test 1: Kya koi khud ko admin bana sakta hai?
curl -X POST http://127.0.0.1:8000/api/auth/inscription \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"nom":"Hacker","email":"hack@test.ne","password":"sanem2026","password_confirmation":"sanem2026","role":"administrateur"}'
```
**Expected:** `422` — "Ce type de compte ne peut pas être créé"

```bash
# Test 2: Bina login profile khul sakta hai?
curl http://127.0.0.1:8000/api/profil -H "Accept: application/json"
```
**Expected:** `{"message":"Authentification requise."}` — HTML error page **nahi**

```bash
# Test 3: Galat URL par kya aata hai?
curl http://127.0.0.1:8000/api/offres/koi-bhi-galat-naam -H "Accept: application/json"
```
**Expected:** `{"message":"Ressource introuvable."}` — stack trace **nahi**

```bash
# Test 4: Security headers lagay hain?
curl -I http://127.0.0.1:8000/api/offres
```
**Expected:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`

### 7C — File upload security (bohot important)

```bash
# Ek fake PDF banayein jo asal mein executable hai
cd /tmp
printf 'MZ\x90\x00 ye asal mein exe hai' > fake.pdf
```

Ab is file ko CV ke tor par upload karne ki koshish karein (`/dashboard/profil`).

**Expected:** **Reject** — system file ke **andar ka content** check karta hai, sirf naam nahi.

---

## TEST 8 — Automated tests (har delivery se pehle)

```bash
# Backend — 154 tests
cd G:\sanem\backend
php artisan test
```
**Expected:** `Tests: 154 passed`

```bash
# Frontend — types check
cd G:\sanem\frontend
npx tsc --noEmit
```
**Expected:** koi output nahi (matlab sab theek)

```bash
# Frontend — production build (SABSE ZAROORI)
npm run build
```
**Expected:** build complete, 40 routes.

> **Ye build test zaroor chalayein.** `npm run dev` mein kuch errors chupe rehte hain
> jo sirf production build mein pakde jaate hain.

---

## Kya abhi baqi hai (delivery se pehle jaan lein)

| # | Masla | Kitna zaroori |
|---|---|---|
| 1 | **Email bilkul nahi jaata** (`MAIL_MAILER=log`) | **BLOCKING** — registration confirmation, interview proposal, reminder — sab sirf log file mein likhe jaate hain. Candidate ko kabhi pata nahi chalega ke uska interview hai. |
| 2 | Backend deploy nahi hua | Vercel PHP nahi chalata — Railway/Render/VPS chahiye |
| 3 | 4 admin pages abhi static | Événements, intervenants, notifications, paramètres |
| 4 | Public FAQ page abhi build data se chalta hai | Admin aur API dono kaam karte hain, sirf ye page connect nahi |
| 5 | "Password bhool gaye" feature nahi | Email service par depend karta hai (point 1) |
| 6 | Google Analytics aur map | Contract Phase 9 mein hai, abhi nahi laga |

---

## Masla aaye to kya karein

| Masla | Wajah | Hal |
|---|---|---|
| "Impossible de joindre le serveur" | Backend band hai | Terminal 1 check karein |
| Login ke baad blank page | Token reject hua | F12 → Console dekhein |
| CORS error | Origin allowed nahi | `backend/.env` mein `FRONTEND_URL` |
| Koi offer nahi dikhti | Database khali | `php artisan db:seed --class=EmploiSeeder` |
| Email nahi aaya | `MAIL_MAILER=log` | `tail backend/storage/logs/laravel.log` |
| Koi count galat lag raha | Counter out of sync | `php artisan sanem:reconcilier-compteurs --dry-run` |
| Build fail ho raha | Dev mein chupi error | `npm run build` ki poori output parhein |

---

## Testing ka sahi order

```
1. Setup (servers + data)        →  5 min
2. TEST 1  Public website        → 10 min
3. TEST 2  Event registration    → 10 min
4. TEST 3  Job seeker journey    → 20 min  ← sabse important
5. TEST 4  Recruiter             → 15 min
6. TEST 5  Matching + Entretiens → 20 min
7. TEST 6  Admin                 → 15 min
8. TEST 7  Security              → 15 min
9. TEST 8  Automated             →  5 min
                                   ────────
                            Total ~2 ghante
```

**Order important hai** — Test 3 ka data Test 4 aur 5 mein use hota hai.

Har test ke baad agar koi cheez expected se alag ho, to note kar lein:
- Kaunsa step tha (jaise 5.14)
- Kya hona chahiye tha
- Kya hua
- Screenshot agar ho sake
