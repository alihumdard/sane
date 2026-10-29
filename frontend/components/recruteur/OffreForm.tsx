"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { ComboBox } from "@/components/ui/ComboBox";
import { api, ApiError } from "@/lib/api";
import { useReferentiels } from "@/lib/referentiels";
import type { ApiOffre, OffrePayload, TypeContrat } from "@/lib/types";

const CONTRATS: { value: TypeContrat; label: string }[] = [
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "stage", label: "Stage" },
  { value: "consultant", label: "Consultant" },
  { value: "alternance", label: "Alternance" },
];

const champ =
  "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";
const etiquette = "mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]";

/** Hoisted: defining it inside the form would remount the field on each render. */
function Erreur({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{message}</p>;
}

interface OffreFormProps {
  offre?: ApiOffre;
  onAnnuler: () => void;
  /** True once the offer is live on the public site. */
  onEnregistre: (publiee: boolean) => void;
}

/** Create or edit an offer; saving as draft and publishing are separate acts. */
export function OffreForm({ offre, onAnnuler, onEnregistre }: OffreFormProps) {
  const [form, setForm] = useState({
    titre: offre?.titre ?? "",
    description: offre?.description ?? "",
    missions: offre?.missions ?? "",
    profil_recherche: offre?.profil_recherche ?? "",
    question_1: offre?.question_1 ?? "",
    question_2: offre?.question_2 ?? "",
    type_contrat: (offre?.type_contrat ?? "cdi") as TypeContrat,
    secteur: offre?.secteur ?? "",
    ville: offre?.ville ?? "",
    salaire_min: offre?.salaire_min?.toString() ?? "",
    salaire_max: offre?.salaire_max?.toString() ?? "",
    experience_requise: offre?.experience_requise ?? "",
    niveau_etude: offre?.niveau_etude ?? "",
    date_limite: offre?.date_limite ?? "",
  });

  const [envoi, setEnvoi] = useState<"brouillon" | "publiee" | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [champsEnErreur, setChampsEnErreur] = useState<Record<string, string>>({});
  const listes = useReferentiels();

  const set = (cle: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [cle]: v }));
    setChampsEnErreur((champs) => {
      if (!(cle in champs)) return champs;
      const reste = { ...champs };
      delete reste[cle];
      return reste;
    });
    setErreur(null);
  };

  async function enregistrer(statut: "brouillon" | "publiee") {
    setEnvoi(statut);
    setErreur(null);
    setChampsEnErreur({});

    const payload: OffrePayload = {
      titre: form.titre,
      description: form.description,
      missions: form.missions || undefined,
      profil_recherche: form.profil_recherche || undefined,
      question_1: form.question_1 || undefined,
      question_2: form.question_2 || undefined,
      type_contrat: form.type_contrat,
      secteur: form.secteur,
      ville: form.ville,
      salaire_min: form.salaire_min ? Number(form.salaire_min) : undefined,
      salaire_max: form.salaire_max ? Number(form.salaire_max) : undefined,
      experience_requise: form.experience_requise || undefined,
      niveau_etude: form.niveau_etude || undefined,
      date_limite: form.date_limite || undefined,
      statut,
    };

    try {
      if (offre) await api.put(`/entreprise/offres/${offre.id}`, payload);
      else await api.post("/entreprise/offres", payload);

      onEnregistre(statut === "publiee");
    } catch (e) {
      if (e instanceof ApiError) {
        setErreur(e.message);
        setChampsEnErreur(
          Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]]))
        );
      } else {
        setErreur("Impossible d'enregistrer l'offre.");
      }
      setEnvoi(null);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enregistrer("brouillon");
      }}
      className="rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6"
    >
      <button
        type="button"
        onClick={onAnnuler}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)]"
      >
        <ArrowLeft size={14} /> Retour aux offres
      </button>

      <h2 className="mb-5 text-[16px] font-bold text-[var(--sane-text)]">
        {offre ? "Modifier l'offre" : "Nouvelle offre"}
      </h2>

      <Alerte texte={erreur} className="mb-4" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="titre" className={etiquette}>Intitulé du poste *</label>
          <input id="titre" required value={form.titre} onChange={(e) => set("titre")(e.target.value)} className={champ} />
          <Erreur message={champsEnErreur.titre} />
        </div>

        <div>
          <label htmlFor="type_contrat" className={etiquette}>Type de contrat *</label>
          <select
            id="type_contrat"
            value={form.type_contrat}
            onChange={(e) => set("type_contrat")(e.target.value)}
            className={champ}
          >
            {CONTRATS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ville" className={etiquette}>Lieu *</label>
          <ComboBox id="ville" required options={listes.ville} value={form.ville} onChange={set("ville")} placeholder="Choisissez une ville" />
          <Erreur message={champsEnErreur.ville} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="secteur" className={etiquette}>Secteur d&apos;activité *</label>
          <ComboBox id="secteur" required options={listes.domaine} value={form.secteur} onChange={set("secteur")} placeholder="Choisissez un secteur" />
          <Erreur message={champsEnErreur.secteur} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={etiquette}>Description du poste *</label>
          <textarea id="description" required rows={5} value={form.description} onChange={(e) => set("description")(e.target.value)} className={champ} />
          <Erreur message={champsEnErreur.description} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="missions" className={etiquette}>Missions</label>
          <textarea id="missions" rows={4} value={form.missions} onChange={(e) => set("missions")(e.target.value)} className={champ} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="profil_recherche" className={etiquette}>Profil recherché</label>
          <textarea id="profil_recherche" rows={4} value={form.profil_recherche} onChange={(e) => set("profil_recherche")(e.target.value)} className={champ} />
        </div>

        {/*
          Two questions, asked of everyone who applies. A CV says what someone
          has done; it does not say whether they hold a licence or can start on
          Monday, and recruiters were asking that in the description with
          nowhere to read the answer.
        */}
        <div className="sm:col-span-2">
          <label htmlFor="question_1" className={etiquette}>
            Question 1 <span className="font-normal opacity-70">(facultatif)</span>
          </label>
          <input
            id="question_1" type="text" maxLength={500}
            placeholder="Ex. : Avez-vous un permis de conduire ?"
            value={form.question_1} onChange={(e) => set("question_1")(e.target.value)}
            className={champ}
          />
          <p className="mt-1 text-[11px] text-[var(--sane-text-light)]">
            Posée à chaque candidat ; la réponse est obligatoire pour postuler.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="question_2" className={etiquette}>
            Question 2 <span className="font-normal opacity-70">(facultatif)</span>
          </label>
          <input
            id="question_2" type="text" maxLength={500}
            placeholder="Ex. : Êtes-vous disponible immédiatement ?"
            value={form.question_2} onChange={(e) => set("question_2")(e.target.value)}
            className={champ}
          />
        </div>

        <div>
          <label htmlFor="salaire_min" className={etiquette}>Salaire minimum (FCFA)</label>
          <input id="salaire_min" type="number" min={0} value={form.salaire_min} onChange={(e) => set("salaire_min")(e.target.value)} className={champ} />
          <Erreur message={champsEnErreur.salaire_min} />
        </div>

        <div>
          <label htmlFor="salaire_max" className={etiquette}>Salaire maximum (FCFA)</label>
          <input id="salaire_max" type="number" min={0} value={form.salaire_max} onChange={(e) => set("salaire_max")(e.target.value)} className={champ} />
          <Erreur message={champsEnErreur.salaire_max} />
        </div>

        <div>
          <label htmlFor="experience_requise" className={etiquette}>Expérience requise</label>
          <input id="experience_requise" placeholder="ex. 3 ans" value={form.experience_requise} onChange={(e) => set("experience_requise")(e.target.value)} className={champ} />
        </div>

        <div>
          <label htmlFor="niveau_etude" className={etiquette}>Niveau d&apos;étude</label>
          <input id="niveau_etude" placeholder="ex. Bac+3" value={form.niveau_etude} onChange={(e) => set("niveau_etude")(e.target.value)} className={champ} />
        </div>

        <div>
          <label htmlFor="date_limite" className={etiquette}>Date limite de candidature</label>
          <input id="date_limite" type="date" value={form.date_limite} onChange={(e) => set("date_limite")(e.target.value)} className={champ} />
          <Erreur message={champsEnErreur.date_limite} />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--sane-border)] pt-5 sm:flex-row sm:justify-end">
        {/* A way out beside the save, not only as a link above the first field. */}
        <button
          type="button"
          onClick={onAnnuler}
          className={"inline-flex items-center gap-1.5 rounded-xl border border-[var(--sane-border)] px-4 py-2.5 text-[13px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]" + " sm:mr-auto"}
        >
          <ArrowLeft size={15} /> Retour aux offres
        </button>

        <button
          type="submit"
          disabled={envoi !== null}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--sane-border)] px-5 py-2.5 text-[13px] font-semibold disabled:opacity-60"
        >
          <SpinnerOu actif={envoi === "brouillon"}><Save size={15} /></SpinnerOu>
          Enregistrer en brouillon
        </button>

        <button
          type="button"
          onClick={() => enregistrer("publiee")}
          disabled={envoi !== null}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
        >
          <SpinnerOu actif={envoi === "publiee"}><Send size={15} /></SpinnerOu>
          Publier l&apos;offre
        </button>
      </div>
    </form>
  );
}
