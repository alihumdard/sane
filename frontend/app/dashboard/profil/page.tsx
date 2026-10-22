"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle, Download, Eye, EyeOff,
  FileText, Loader2, Pencil, Plus, Save, Trash2, Upload,
} from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { ComboBox } from "@/components/ui/ComboBox";
import { api, ApiError, telecharger } from "@/lib/api";
import { NIVEAUX_DIPLOME, TYPES_EMPLOI, useReferentiels } from "@/lib/referentiels";
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
  const listes = useReferentiels();

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

      <Alerte texte={message} ton="succes" className="mb-4" />

      <Alerte texte={erreur} className="mb-4" />

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

          {/*
            Dropdowns, not free text: the search filters offers on an exact
            string and the matching engine compares these as text, so "Informatique"
            typed by hand never meets "Informatique & Numérique" on a posting.
          */}
          <div>
            <label htmlFor="secteur" className={etiquette}>Secteur</label>
            <ComboBox id="secteur" options={listes.domaine} value={String(form.secteur ?? "")} onChange={set("secteur")} placeholder="Choisissez un secteur" />
          </div>

          <div>
            <label htmlFor="ville" className={etiquette}>Ville</label>
            <ComboBox id="ville" options={listes.ville} value={String(form.ville ?? "")} onChange={set("ville")} placeholder="Choisissez une ville" />
          </div>

          <div>
            <label htmlFor="type_emploi" className={etiquette}>Type d&apos;emploi recherché</label>
            <ComboBox id="type_emploi" options={TYPES_EMPLOI} value={String(form.type_emploi ?? "")} onChange={set("type_emploi")} placeholder="Choisissez un type" />
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

      <p role="alert" className={`mb-3 sane-small text-[var(--sane-red-dark)] ${erreur ? "" : "hidden"}`}>{erreur}</p>

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

const EXPERIENCE_VIDE = { poste: "", entreprise: "", lieu: "", date_debut: "", date_fin: "", en_poste: false };

function Experiences({ experiences, onChange }: { experiences: ApiExperience[]; onChange: () => void }) {
  const listes = useReferentiels();

  const [ouvert, setOuvert] = useState(false);
  // null = creating a new one; a number = editing that experience's id.
  const [edition, setEdition] = useState<number | null>(null);
  const [form, setForm] = useState(EXPERIENCE_VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function ouvrirAjout() {
    setEdition(null);
    setForm(EXPERIENCE_VIDE);
    setOuvert(true);
  }

  function ouvrirEdition(x: ApiExperience) {
    setEdition(x.id);
    setForm({
      poste: x.poste,
      entreprise: x.entreprise,
      lieu: x.lieu ?? "",
      date_debut: x.date_debut.slice(0, 10),
      date_fin: x.date_fin ? x.date_fin.slice(0, 10) : "",
      en_poste: x.en_poste,
    });
    setOuvert(true);
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);

    const payload = {
      ...form,
      date_fin: form.en_poste ? undefined : form.date_fin || undefined,
      lieu: form.lieu || undefined,
    };

    try {
      if (edition === null) {
        await api.post("/profil/experiences", payload);
      } else {
        await api.put(`/profil/experiences/${edition}`, payload);
      }
      setForm(EXPERIENCE_VIDE);
      setEdition(null);
      setOuvert(false);
      onChange();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.allErrors() : "Enregistrement impossible.");
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
        <button type="button" onClick={() => (ouvert ? setOuvert(false) : ouvrirAjout())} className="text-[13px] font-semibold text-[var(--sane-green)]">
          {ouvert ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {ouvert && (
        <form onSubmit={enregistrer} className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-[var(--sane-background)] p-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Poste *
            <input required placeholder="ex. Développeuse web" value={form.poste} onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))} className={champ} />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Entreprise *
            <input required placeholder="ex. Tech Solutions" value={form.entreprise} onChange={(e) => setForm((f) => ({ ...f, entreprise: e.target.value }))} className={champ} />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Lieu
            <ComboBox id="lieu_experience" options={listes.ville} value={form.lieu} onChange={(v) => setForm((f) => ({ ...f, lieu: v }))} placeholder="Choisissez une ville" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Date de début *
            <input required type="date" value={form.date_debut} onChange={(e) => setForm((f) => ({ ...f, date_debut: e.target.value }))} className={champ} />
          </label>
          {!form.en_poste && (
            <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
              Date de fin
              <input type="date" value={form.date_fin} onChange={(e) => setForm((f) => ({ ...f, date_fin: e.target.value }))} className={champ} />
            </label>
          )}
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={form.en_poste} onChange={(e) => setForm((f) => ({ ...f, en_poste: e.target.checked, date_fin: e.target.checked ? "" : f.date_fin }))} className="h-4 w-4 accent-[var(--sane-green)]" />
            Poste actuel
          </label>
          <p className={`sm:col-span-2 sane-small text-[var(--sane-red-dark)] ${erreur ? "" : "hidden"}`}>{erreur}</p>
          <button type="submit" disabled={envoi} className="rounded-lg bg-[var(--sane-green)] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60 sm:col-span-2">
            {envoi ? "Enregistrement…" : edition === null ? "Ajouter cette expérience" : "Enregistrer les modifications"}
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
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => ouvrirEdition(x)} aria-label="Modifier" className="text-[var(--sane-text-light)] hover:text-[var(--sane-green)]">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => supprimer(x.id)} aria-label="Supprimer" className="text-[var(--sane-red-dark)]">
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─── Formations ─── */

const FORMATION_VIDE = { diplome: "", etablissement: "", domaine: "", annee_debut: "", annee_fin: "", en_cours: false };

function Formations({ formations, onChange }: { formations: ApiFormationAcademique[]; onChange: () => void }) {
  const listes = useReferentiels();

  const [ouvert, setOuvert] = useState(false);
  const [edition, setEdition] = useState<number | null>(null);
  const [form, setForm] = useState(FORMATION_VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function ouvrirAjout() {
    setEdition(null);
    setForm(FORMATION_VIDE);
    setOuvert(true);
  }

  function ouvrirEdition(f: ApiFormationAcademique) {
    setEdition(f.id);
    setForm({
      diplome: f.diplome,
      etablissement: f.etablissement,
      domaine: f.domaine ?? "",
      annee_debut: f.annee_debut ? String(f.annee_debut) : "",
      annee_fin: f.annee_fin ? String(f.annee_fin) : "",
      en_cours: f.en_cours,
    });
    setOuvert(true);
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);

    const payload = {
      diplome: form.diplome,
      etablissement: form.etablissement,
      domaine: form.domaine || undefined,
      annee_debut: form.annee_debut ? Number(form.annee_debut) : undefined,
      annee_fin: form.en_cours || !form.annee_fin ? undefined : Number(form.annee_fin),
      en_cours: form.en_cours,
    };

    try {
      if (edition === null) {
        await api.post("/profil/formations", payload);
      } else {
        await api.put(`/profil/formations/${edition}`, payload);
      }
      setForm(FORMATION_VIDE);
      setEdition(null);
      setOuvert(false);
      onChange();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.allErrors() : "Enregistrement impossible.");
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
        <button type="button" onClick={() => (ouvert ? setOuvert(false) : ouvrirAjout())} className="text-[13px] font-semibold text-[var(--sane-green)]">
          {ouvert ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {ouvert && (
        <form onSubmit={enregistrer} className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-[var(--sane-background)] p-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Diplôme *
            <ComboBox id="diplome" options={NIVEAUX_DIPLOME} value={form.diplome} onChange={(v) => setForm((f) => ({ ...f, diplome: v }))} placeholder="Choisissez un diplôme" required />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Établissement *
            <input required placeholder="ex. Université de Niamey" value={form.etablissement} onChange={(e) => setForm((f) => ({ ...f, etablissement: e.target.value }))} className={champ} />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Domaine
            <ComboBox id="domaine_formation" options={listes.domaine} value={form.domaine} onChange={(v) => setForm((f) => ({ ...f, domaine: v }))} placeholder="Choisissez un domaine" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
            Année de début
            <input type="number" placeholder="ex. 2018" min={1950} max={2040} value={form.annee_debut} onChange={(e) => setForm((f) => ({ ...f, annee_debut: e.target.value }))} className={champ} />
          </label>
          {!form.en_cours && (
            <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--sane-text-light)]">
              Année de fin
              <input type="number" placeholder="ex. 2021" min={1950} max={2040} value={form.annee_fin} onChange={(e) => setForm((f) => ({ ...f, annee_fin: e.target.value }))} className={champ} />
            </label>
          )}
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={form.en_cours} onChange={(e) => setForm((f) => ({ ...f, en_cours: e.target.checked, annee_fin: e.target.checked ? "" : f.annee_fin }))} className="h-4 w-4 accent-[var(--sane-green)]" />
            En cours
          </label>
          <p className={`sm:col-span-2 sane-small text-[var(--sane-red-dark)] ${erreur ? "" : "hidden"}`}>{erreur}</p>
          <button type="submit" disabled={envoi} className="rounded-lg bg-[var(--sane-green)] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60 sm:col-span-2">
            {envoi ? "Enregistrement…" : edition === null ? "Ajouter cette formation" : "Enregistrer les modifications"}
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
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => ouvrirEdition(f)} aria-label="Modifier" className="text-[var(--sane-text-light)] hover:text-[var(--sane-green)]">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => supprimer(f.id)} aria-label="Supprimer" className="text-[var(--sane-red-dark)]">
                  <Trash2 size={14} />
                </button>
              </div>
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
