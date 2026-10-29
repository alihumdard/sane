"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Save, ShieldAlert } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { ComboBox } from "@/components/ui/ComboBox";
import { api, ApiError } from "@/lib/api";
import { useReferentiels } from "@/lib/referentiels";
import type { ApiEntreprise, EntreprisePayload } from "@/lib/types";

const champ =
  "w-full rounded-xl border border-[var(--sane-border)] bg-white px-3.5 py-3 text-[13px] text-[var(--sane-text)] outline-none transition-all placeholder:text-[var(--sane-text-light)]/60 hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8";
const etiquette = "mb-2 block text-[12px] font-semibold text-[var(--sane-text)]";
const aide = "mt-1 text-[11.5px] text-[var(--sane-text-light)]";
const titreGroupe =
  "mb-1 mt-2 border-t border-[var(--sane-border)] pt-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--sane-green)] sm:col-span-2 xl:col-span-3";

function Contenu() {
  const [form, setForm] = useState<EntreprisePayload>({
    nom: "",
    secteur: "",
    taille: "",
    site_web: "",
    description: "",
    ville: "",
    telephone: "",
  });

  const [verifiee, setVerifiee] = useState(false);
  const [existe, setExiste] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [champsEnErreur, setChampsEnErreur] = useState<Record<string, string>>({});
  const listes = useReferentiels();

  useEffect(() => {
    let actif = true;

    api
      .get<{ data: ApiEntreprise | null }>("/entreprise")
      .then((res) => {
        if (!actif || !res.data) return;

        const e = res.data;
        setExiste(true);
        setVerifiee(e.verifiee);
        setForm({
          nom: e.nom,
          secteur: e.secteur ?? "",
          taille: e.taille ?? "",
          site_web: e.site_web ?? "",
          description: e.description ?? "",
          ville: e.ville ?? "",
          telephone: "",
        });
      })
      .catch((e) => actif && setErreur(e instanceof ApiError ? e.message : "Chargement impossible."))
      .finally(() => actif && setChargement(false));

    return () => {
      actif = false;
    };
  }, []);

  const set = (cle: keyof EntreprisePayload) => (v: string) => {
    setForm((f) => ({ ...f, [cle]: v }));
    setChampsEnErreur((champs) => {
      if (!(cle in champs)) return champs;
      const reste = { ...champs };
      delete reste[cle];
      return reste;
    });
    setErreur(null);
  };

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    setSucces(null);
    setChampsEnErreur({});

    try {
      const res = await api.post<{ message: string; data: ApiEntreprise }>("/entreprise", form);
      setSucces(res.message);
      setExiste(true);
      setVerifiee(res.data.verifiee);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(err.message);
        setChampsEnErreur(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
      } else {
        setErreur("Impossible d'enregistrer votre entreprise.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <p className="flex items-center gap-2 py-10">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
      </p>
    );
  }

  return (
    <form onSubmit={enregistrer} className="rounded-2xl border border-[var(--sane-border)] bg-white p-5 shadow-[0_1px_2px_rgba(16,35,26,0.04),0_8px_24px_-16px_rgba(16,99,45,0.18)] sm:p-7">
      {existe && (
        <p
          className={`mb-5 flex items-start gap-2.5 rounded-xl p-4 ${
            verifiee ? "bg-[var(--sane-green-light)]" : "border border-[var(--sane-orange)] bg-[#fff8ed]"
          }`}
        >
          {verifiee ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--sane-green)]" />
          ) : (
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[var(--sane-orange)]" />
          )}
          <span className="text-[13px] text-[var(--sane-text)]">
            {verifiee
              ? "Votre entreprise est vérifiée : vos offres peuvent être publiées et apparaître sur le site public."
              : "Votre entreprise est en attente de vérification par les organisateurs. Vous pouvez préparer vos offres dès maintenant : elles resteront en brouillon jusqu'à la validation."}
          </span>
        </p>
      )}

      <Alerte texte={erreur} className="mb-4" />

      <Alerte texte={succes} ton="succes" className="mb-4" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <p className={titreGroupe + " !mt-0 !border-t-0 !pt-0"}>Identité</p>

        <div className="sm:col-span-2 xl:col-span-3">
          <label htmlFor="nom" className={etiquette}>Nom de l&apos;entreprise *</label>
          <input id="nom" required value={form.nom} onChange={(e) => set("nom")(e.target.value)} className={champ} />
          {champsEnErreur.nom && <p className="mt-1 text-[12px] font-medium text-[var(--sane-red-dark)]">{champsEnErreur.nom}</p>}
        </div>

        <div>
          <label htmlFor="secteur" className={etiquette}>Secteur d&apos;activité</label>
          <ComboBox id="secteur" options={listes.domaine} value={form.secteur ?? ""} onChange={set("secteur")} placeholder="Choisissez un secteur" />
          <p className={aide}>Sert au rapprochement entre vos offres et les candidats.</p>
        </div>

        <div>
          <label htmlFor="ville" className={etiquette}>Ville</label>
          <ComboBox id="ville" options={listes.ville} value={form.ville ?? ""} onChange={set("ville")} placeholder="Choisissez une ville" />
        </div>

        <div>
          <label htmlFor="taille" className={etiquette}>Taille</label>
          <input id="taille" placeholder="ex. 10–50 salariés" value={form.taille} onChange={(e) => set("taille")(e.target.value)} className={champ} />
        </div>

        <div>
          <label htmlFor="telephone" className={etiquette}>Téléphone</label>
          <input id="telephone" value={form.telephone} onChange={(e) => set("telephone")(e.target.value)} className={champ} />
        </div>

        <div className="sm:col-span-2 xl:col-span-3">
          <label htmlFor="site_web" className={etiquette}>Site web</label>
          <input id="site_web" type="url" placeholder="https://" value={form.site_web} onChange={(e) => set("site_web")(e.target.value)} className={champ} />
          {champsEnErreur.site_web && <p className="mt-1 text-[12px] font-medium text-[var(--sane-red-dark)]">{champsEnErreur.site_web}</p>}
        </div>

        <p className={titreGroupe}>Présentation</p>

        <div className="sm:col-span-2 xl:col-span-3">
          <label htmlFor="description" className={etiquette}>Présentation</label>
          <textarea id="description" rows={6} value={form.description} onChange={(e) => set("description")(e.target.value)} className={champ} placeholder="Ce que fait votre entreprise, ce que vous cherchez, pourquoi y travailler." />
          <p className={aide}>Affichée aux candidats sous chacune de vos offres.</p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[var(--sane-border)] pt-6">
        <button
          type="submit"
          disabled={envoi}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--sane-orange)] px-6 py-3 text-[13px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(229,118,23,0.7)] transition-all hover:bg-[var(--sane-orange-dark)] hover:shadow-[0_8px_20px_-6px_rgba(229,118,23,0.8)] disabled:opacity-60 disabled:shadow-none"
        >
          <SpinnerOu actif={envoi}><Save size={15} /></SpinnerOu>
          {existe ? "Enregistrer les modifications" : "Créer mon entreprise"}
        </button>

        <Link href="/dashboard/recruteur" className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--sane-border)] px-5 py-3 text-[13px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]">
          <ArrowLeft size={15} /> Retour au tableau de bord
        </Link>
      </div>
    </form>
  );
}

export default function EntrepriseRecruteurPage() {
  return (
    <RecruteurLayout titre="Mon entreprise" description="Profil présenté aux candidats">
      <Contenu />
    </RecruteurLayout>
  );
}
