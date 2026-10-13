"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle, Download, Eye, EyeOff,
  FileText, Loader2, Plus, Save, Trash2, Upload,
} from "lucide-react";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { api, ApiError, telecharger } from "@/lib/api";
import type {
  ApiCompetence,
  ApiDocumentCandidature,
  ApiExperience,
  ApiFormationAcademique,
  ApiProfilDemandeur,
  NiveauCompetence,
} from "@/lib/types";

const champ =
  "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";
const etiquette = "mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]";
const carte = "rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6";

const NIVEAUX: { value: NiveauCompetence; label: string }[] = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "avance", label: "Avancé" },
  { value: "expert", label: "Expert" },
];

function Contenu() {
  const [profil, setProfil] = useState<ApiProfilDemandeur | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);

      const res = await api.get<{ data: ApiProfilDemandeur }>("/profil");
      const p = res.data;

      setProfil(p);
      setForm({
        titre_pro: p.titre_pro ?? "",
        resume: p.resume ?? "",
        secteur: p.secteur ?? "",
        ville: p.ville ?? "",
        type_emploi: p.type_emploi ?? "",
        disponibilite: p.disponibilite ?? "",
        linkedin: p.linkedin ?? "",
        portfolio: p.portfolio ?? "",
        visible: p.visible,
      });
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Chargement impossible.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  const set = (cle: string) => (v: string | boolean) => setForm((f) => ({ ...f, [cle]: v }));

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setMessage(null);
    setErreur(null);

    try {
      // Empty strings would fail the `url` rule, so they are sent as absent.
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== "")
      );

      const res = await api.put<{ message: string; data: ApiProfilDemandeur }>("/profil", payload);
      setProfil(res.data);
      setMessage(res.message);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? (err.fieldError("linkedin") ?? err.fieldError("portfolio") ?? err.message)
          : "Enregistrement impossible."
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <p className="flex items-center justify-center gap-2 py-16">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="sane-small">Chargement de votre profil…</span>
      </p>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="sane-h2 mb-1">Mon profil</h1>
          <p className="sane-body">
            Complété à {profil?.taux_completion ?? 0}% — un profil complet est mieux classé.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
            profil?.visible
              ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
              : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
          }`}
        >
          {profil?.visible ? <Eye size={13} /> : <EyeOff size={13} />}
          {profil?.visible ? "Visible par les recruteurs" : "Profil masqué"}
        </span>
      </div>

      {message && (
        <p role="status" className="mb-4 rounded-xl bg-[var(--sane-green-light)] p-3 sane-small text-[var(--sane-green)]">
          {message}
        </p>
      )}

      {erreur && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
          <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
        </p>
      )}

      <form onSubmit={enregistrer} className={`${carte} mb-5`}>
        <h2 className="sane-h3 mb-4">Informations professionnelles</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="titre_pro" className={etiquette}>Titre professionnel</label>
            <input
              id="titre_pro" placeholder="ex. Développeur web"
              value={String(form.titre_pro ?? "")} onChange={(e) => set("titre_pro")(e.target.value)}
              className={champ}
            />
          </div>

          <div>
            <label htmlFor="secteur" className={etiquette}>Secteur</label>
            <input id="secteur" value={String(form.secteur ?? "")} onChange={(e) => set("secteur")(e.target.value)} className={champ} />
          </div>

          <div>
            <label htmlFor="ville" className={etiquette}>Ville</label>
            <input id="ville" value={String(form.ville ?? "")} onChange={(e) => set("ville")(e.target.value)} className={champ} />
          </div>

          <div>
            <label htmlFor="type_emploi" className={etiquette}>Type d&apos;emploi recherché</label>
            <input id="type_emploi" placeholder="ex. CDI" value={String(form.type_emploi ?? "")} onChange={(e) => set("type_emploi")(e.target.value)} className={champ} />
          </div>

          <div>
            <label htmlFor="disponibilite" className={etiquette}>Disponibilité</label>
            <input id="disponibilite" placeholder="ex. Immédiate" value={String(form.disponibilite ?? "")} onChange={(e) => set("disponibilite")(e.target.value)} className={champ} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="resume" className={etiquette}>Présentation</label>
            <textarea id="resume" rows={4} value={String(form.resume ?? "")} onChange={(e) => set("resume")(e.target.value)} className={champ} />
          </div>

          <div>
            <label htmlFor="linkedin" className={etiquette}>LinkedIn</label>
            <input id="linkedin" type="url" placeholder="https://" value={String(form.linkedin ?? "")} onChange={(e) => set("linkedin")(e.target.value)} className={champ} />
          </div>

          <div>
            <label htmlFor="portfolio" className={etiquette}>Portfolio</label>
            <input id="portfolio" type="url" placeholder="https://" value={String(form.portfolio ?? "")} onChange={(e) => set("portfolio")(e.target.value)} className={champ} />
          </div>

          <label className="flex items-start gap-2.5 rounded-xl bg-[var(--sane-background)] p-3 sm:col-span-2">
            <input
              type="checkbox" checked={Boolean(form.visible)}
              onChange={(e) => set("visible")(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--sane-green)]"
            />
            <span className="sane-small">
              <strong>Rendre mon profil visible aux recruteurs.</strong> Vos coordonnées ne sont
              communiquées à une entreprise que lorsque vous postulez à l&apos;une de ses offres.
            </span>
          </label>
        </div>

        <button type="submit" disabled={envoi} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60">
          <SpinnerOu actif={envoi}><Save size={15} /></SpinnerOu>
          Enregistrer
        </button>
      </form>

      <Cv documents={profil?.documents ?? []} onChange={charger} />
      <Competences competences={profil?.competences ?? []} onChange={charger} />
      <Experiences experiences={profil?.experiences ?? []} onChange={charger} />
      <Formations formations={profil?.formations ?? []} onChange={charger} />
    </>
  );
}

/* ─── CV ─── */

function Cv({ documents, onChange }: { documents: ApiDocumentCandidature[]; onChange: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function televerser(fichier: File | undefined) {
    if (!fichier) return;

    setErreur(null);

    if (!fichier.name.toLowerCase().endsWith(".pdf")) {
      setErreur("Le CV doit être au format PDF.");
      return;
    }

    if (fichier.size > 2 * 1024 * 1024) {
      setErreur("Le fichier ne doit pas dépasser 2 Mo.");
      return;
    }

    const corps = new FormData();
    corps.append("type", "cv");
    corps.append("fichier", fichier);

    setEnvoi(true);

    try {
      await api.post("/profil/documents", corps);
      onChange();
    } catch (e) {
      setErreur(e instanceof ApiError ? (e.fieldError("fichier") ?? e.message) : "Envoi impossible.");
    } finally {
      setEnvoi(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function supprimer(id: number) {
    try {
      await api.delete(`/profil/documents/${id}`);
      onChange();
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Suppression impossible.");
    }
  }

  return (
    <section className={`${carte} mb-5`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="sane-h3">Mon CV</h2>
        <label
          htmlFor="cv"
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[13px] font-semibold hover:border-[var(--sane-green)] ${envoi ? "pointer-events-none opacity-60" : ""}`}
        >
          <SpinnerOu actif={envoi}><Upload size={15} /></SpinnerOu>
          {documents.length ? "Remplacer" : "Déposer mon CV"}
        </label>
        <input
          ref={inputRef} id="cv" type="file" accept=".pdf" className="sr-only"
          disabled={envoi} onChange={(e) => televerser(e.target.files?.[0])}
        />
      </div>

      {erreur && <p role="alert" className="mb-3 sane-small text-[var(--sane-red-dark)]">{erreur}</p>}

      {documents.length === 0 ? (
        <p className="sane-small">
          Aucun CV déposé. Les recruteurs reçoivent votre CV avec chaque candidature. PDF, 2 Mo maximum.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {documents.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-xl bg-[var(--sane-background)] p-3">
              <FileText size={16} className="shrink-0 text-[var(--sane-green)]" />
              <span className="min-w-0 flex-1 truncate text-[13px]">{d.nom_original}</span>
              <span className="shrink-0 text-[12px] text-[var(--sane-text-light)]">{d.taille_lisible}</span>
              <button
                type="button"
                onClick={() => telecharger(`/documents-candidature/${d.id}/telecharger`, d.nom_original)}
                title="Télécharger"
                className="shrink-0 text-[var(--sane-green)]"
              >
                <Download size={15} />
              </button>
              <button type="button" onClick={() => supprimer(d.id)} title="Supprimer" className="shrink-0 text-[var(--sane-red-dark)]">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─── Compétences ─── */

function Competences({ competences, onChange }: { competences: ApiCompetence[]; onChange: () => void }) {
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState<NiveauCompetence>("intermediaire");
  const [envoi, setEnvoi] = useState(false);

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    if (!nom.trim()) return;

    setEnvoi(true);

    try {
      await api.post("/profil/competences", { nom: nom.trim(), niveau });
      setNom("");
      onChange();
    } finally {
      setEnvoi(false);
    }
  }

  async function retirer(id: number) {
    await api.delete(`/profil/competences/${id}`);
    onChange();
  }

  return (
    <section className={`${carte} mb-5`}>
      <h2 className="sane-h3 mb-1">Mes compétences</h2>
      <p className="sane-small mb-4">
        Elles comptent pour 25% du score de correspondance avec les offres.
      </p>

      <form onSubmit={ajouter} className="mb-4 flex flex-wrap gap-2">
        <input
          value={nom} onChange={(e) => setNom(e.target.value)}
          placeholder="ex. PHP" aria-label="Nouvelle compétence"
          className={`${champ} max-w-[220px] flex-1`}
        />
        <select value={niveau} onChange={(e) => setNiveau(e.target.value as NiveauCompetence)} aria-label="Niveau" className={`${champ} max-w-[180px]`}>
          {NIVEAUX.map((n) => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
        <button type="submit" disabled={envoi} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sane-green)] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60">
          <SpinnerOu actif={envoi} size={14}><Plus size={14} /></SpinnerOu> Ajouter
        </button>
      </form>

      {competences.length === 0 ? (
        <p className="sane-small">Aucune compétence renseignée.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {competences.map((c) => (
            <li key={c.id} className="inline-flex items-center gap-2 rounded-full bg-[var(--sane-background)] px-3 py-1.5 text-[12px]">
              <span className="font-semibold">{c.nom}</span>
              <span className="text-[var(--sane-text-light)]">
                {NIVEAUX.find((n) => n.value === c.niveau)?.label}
              </span>
              <button type="button" onClick={() => retirer(c.id)} aria-label={`Retirer ${c.nom}`} className="text-[var(--sane-red-dark)]">
                <Trash2 size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─── Expériences ─── */

function Experiences({ experiences, onChange }: { experiences: ApiExperience[]; onChange: () => void }) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({ poste: "", entreprise: "", lieu: "", date_debut: "", date_fin: "", en_poste: false });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);

    try {
      await api.post("/profil/experiences", {
        ...form,
        date_fin: form.en_poste ? undefined : form.date_fin || undefined,
        lieu: form.lieu || undefined,
      });
      setForm({ poste: "", entreprise: "", lieu: "", date_debut: "", date_fin: "", en_poste: false });
      setOuvert(false);
      onChange();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Ajout impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(id: number) {
    await api.delete(`/profil/experiences/${id}`);
    onChange();
  }

  return (
    <section className={`${carte} mb-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="sane-h3">Mon expérience</h2>
        <button type="button" onClick={() => setOuvert((o) => !o)} className="text-[13px] font-semibold text-[var(--sane-green)]">
          {ouvert ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {ouvert && (
        <form onSubmit={ajouter} className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-[var(--sane-background)] p-4 sm:grid-cols-2">
          <input required placeholder="Poste *" value={form.poste} onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))} aria-label="Poste" className={champ} />
          <input required placeholder="Entreprise *" value={form.entreprise} onChange={(e) => setForm((f) => ({ ...f, entreprise: e.target.value }))} aria-label="Entreprise" className={champ} />
          <input placeholder="Lieu" value={form.lieu} onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))} aria-label="Lieu" className={champ} />
          <input required type="date" value={form.date_debut} onChange={(e) => setForm((f) => ({ ...f, date_debut: e.target.value }))} aria-label="Date de début" className={champ} />
          {!form.en_poste && (
            <input type="date" value={form.date_fin} onChange={(e) => setForm((f) => ({ ...f, date_fin: e.target.value }))} aria-label="Date de fin" className={champ} />
          )}
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={form.en_poste} onChange={(e) => setForm((f) => ({ ...f, en_poste: e.target.checked }))} className="h-4 w-4 accent-[var(--sane-green)]" />
            Poste actuel
          </label>
          {erreur && <p className="sm:col-span-2 sane-small text-[var(--sane-red-dark)]">{erreur}</p>}
          <button type="submit" disabled={envoi} className="rounded-lg bg-[var(--sane-green)] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60 sm:col-span-2">
            {envoi ? "Enregistrement…" : "Ajouter cette expérience"}
          </button>
        </form>
      )}

      {experiences.length === 0 ? (
        <p className="sane-small">Aucune expérience renseignée.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {experiences.map((x) => (
            <li key={x.id} className="flex items-start justify-between gap-3 rounded-xl bg-[var(--sane-background)] p-3">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">{x.poste}</p>
                <p className="text-[12px] text-[var(--sane-text-light)]">
                  {x.entreprise}
                  {x.lieu && ` · ${x.lieu}`} ·{" "}
                  {new Date(x.date_debut).getFullYear()} –{" "}
                  {x.en_poste ? "aujourd'hui" : x.date_fin ? new Date(x.date_fin).getFullYear() : "—"}
                </p>
              </div>
              <button type="button" onClick={() => supprimer(x.id)} aria-label="Supprimer" className="shrink-0 text-[var(--sane-red-dark)]">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─── Formations ─── */

function Formations({ formations, onChange }: { formations: ApiFormationAcademique[]; onChange: () => void }) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({ diplome: "", etablissement: "", domaine: "", annee_debut: "", annee_fin: "", en_cours: false });
  const [envoi, setEnvoi] = useState(false);

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);

    try {
      await api.post("/profil/formations", {
        diplome: form.diplome,
        etablissement: form.etablissement,
        domaine: form.domaine || undefined,
        annee_debut: form.annee_debut ? Number(form.annee_debut) : undefined,
        annee_fin: form.en_cours || !form.annee_fin ? undefined : Number(form.annee_fin),
        en_cours: form.en_cours,
      });
      setForm({ diplome: "", etablissement: "", domaine: "", annee_debut: "", annee_fin: "", en_cours: false });
      setOuvert(false);
      onChange();
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(id: number) {
    await api.delete(`/profil/formations/${id}`);
    onChange();
  }

  return (
    <section className={carte}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="sane-h3">Ma formation</h2>
        <button type="button" onClick={() => setOuvert((o) => !o)} className="text-[13px] font-semibold text-[var(--sane-green)]">
          {ouvert ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {ouvert && (
        <form onSubmit={ajouter} className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-[var(--sane-background)] p-4 sm:grid-cols-2">
          <input required placeholder="Diplôme *" value={form.diplome} onChange={(e) => setForm((f) => ({ ...f, diplome: e.target.value }))} aria-label="Diplôme" className={champ} />
          <input required placeholder="Établissement *" value={form.etablissement} onChange={(e) => setForm((f) => ({ ...f, etablissement: e.target.value }))} aria-label="Établissement" className={champ} />
          <input placeholder="Domaine" value={form.domaine} onChange={(e) => setForm((f) => ({ ...f, domaine: e.target.value }))} aria-label="Domaine" className={champ} />
          <input type="number" placeholder="Année de début" min={1950} max={2040} value={form.annee_debut} onChange={(e) => setForm((f) => ({ ...f, annee_debut: e.target.value }))} aria-label="Année de début" className={champ} />
          {!form.en_cours && (
            <input type="number" placeholder="Année de fin" min={1950} max={2040} value={form.annee_fin} onChange={(e) => setForm((f) => ({ ...f, annee_fin: e.target.value }))} aria-label="Année de fin" className={champ} />
          )}
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={form.en_cours} onChange={(e) => setForm((f) => ({ ...f, en_cours: e.target.checked }))} className="h-4 w-4 accent-[var(--sane-green)]" />
            En cours
          </label>
          <button type="submit" disabled={envoi} className="rounded-lg bg-[var(--sane-green)] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60 sm:col-span-2">
            {envoi ? "Enregistrement…" : "Ajouter cette formation"}
          </button>
        </form>
      )}

      {formations.length === 0 ? (
        <p className="sane-small">Aucune formation renseignée.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {formations.map((f) => (
            <li key={f.id} className="flex items-start justify-between gap-3 rounded-xl bg-[var(--sane-background)] p-3">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">{f.diplome}</p>
                <p className="text-[12px] text-[var(--sane-text-light)]">
                  {f.etablissement}
                  {f.domaine && ` · ${f.domaine}`}
                  {f.annee_debut && ` · ${f.annee_debut} – ${f.en_cours ? "en cours" : (f.annee_fin ?? "—")}`}
                </p>
              </div>
              <button type="button" onClick={() => supprimer(f.id)} aria-label="Supprimer" className="shrink-0 text-[var(--sane-red-dark)]">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ProfilPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--sane-background)] py-10 sm:py-14">
        <Container>
          <RoleGuard roles={["demandeur", "participant"]} espace="votre profil">
            <Contenu />
          </RoleGuard>
        </Container>
      </main>
      <Footer />
    </>
  );
}
