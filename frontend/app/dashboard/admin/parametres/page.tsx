"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Loader2, Save } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { api, ApiError } from "@/lib/api";

interface ApiParametres {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  site_web: string | null;
  description: string | null;
  logo: string | null;
  logo_url: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
}

/**
 * The accounts whose icons the footer and the contact page show.
 *
 * An account left blank shows no icon at all — the pages used to carry five
 * links to "#" apiece because nobody had the addresses.
 */
const RESEAUX = [
  { nom: "facebook", label: "Facebook", exemple: "https://facebook.com/sanem" },
  { nom: "twitter", label: "X / Twitter", exemple: "https://x.com/sanem" },
  { nom: "instagram", label: "Instagram", exemple: "https://instagram.com/sanem" },
  { nom: "linkedin", label: "LinkedIn", exemple: "https://linkedin.com/company/sanem" },
  { nom: "youtube", label: "YouTube", exemple: "https://youtube.com/@sanem" },
] as const;

export default function AdminParametresPage() {
  const [parametres, setParametres] = useState<ApiParametres | null>(null);
  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", adresse: "", site_web: "", description: "",
    facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoApercu, setLogoApercu] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const fichierRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get<{ data: ApiParametres }>("/admin/parametres")
      .then((res) => {
        setParametres(res.data);
        setForm({
          nom: res.data.nom,
          email: res.data.email,
          telephone: res.data.telephone ?? "",
          adresse: res.data.adresse ?? "",
          site_web: res.data.site_web ?? "",
          description: res.data.description ?? "",
          facebook: res.data.facebook ?? "",
          twitter: res.data.twitter ?? "",
          instagram: res.data.instagram ?? "",
          linkedin: res.data.linkedin ?? "",
          youtube: res.data.youtube ?? "",
        });
      })
      .catch((e) => setErreur(e instanceof ApiError ? e.message : "Chargement impossible."))
      .finally(() => setChargement(false));
  }, []);

  function choisirLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setLogo(fichier);
    setLogoApercu(URL.createObjectURL(fichier));
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setMessage(null);
    setErreur(null);

    try {
      const corps = new FormData();
      Object.entries(form).forEach(([cle, valeur]) => corps.append(cle, valeur));
      if (logo) corps.append("logo", logo);

      const res = await api.upload<{ message: string; data: ApiParametres }>("/admin/parametres", corps);
      setParametres(res.data);
      setMessage(res.message);
      setLogo(null);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? (err.fieldError("nom") ?? err.fieldError("email") ?? err.fieldError("logo") ?? err.message)
          : "Enregistrement impossible."
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <AdminPage section="Paramètres" titre="Paramètres" description="Informations générales de la plateforme">
        <p className="flex items-center gap-2 py-12">
          <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
          <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
        </p>
      </AdminPage>
    );
  }

  return (
    <AdminPage section="Paramètres" titre="Paramètres" description="Informations générales de la plateforme">
      {message && (
        <p className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--sane-green)] bg-[var(--sane-green-tint)] p-3 text-[13px] text-[var(--sane-green)]">
          <CheckCircle2 size={15} /> {message}
        </p>
      )}
      {erreur && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
          <span className="text-[13px] text-[var(--sane-red-dark)]">{erreur}</span>
        </p>
      )}

      <form onSubmit={enregistrer} className="rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-[15px] font-bold text-[var(--sane-text)]">Informations de l&apos;organisation</h2>

        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)]">
            {logoApercu || parametres?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoApercu ?? parametres!.logo_url!} alt="Logo" className="h-full w-full object-contain" />
            ) : (
              <span className="text-[18px] font-extrabold text-[var(--sane-green)]">{form.nom.charAt(0) || "S"}</span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fichierRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[12px] font-semibold text-[var(--sane-text)] hover:bg-[var(--sane-background)]"
            >
              <Camera size={13} /> Changer le logo
            </button>
            <input ref={fichierRef} type="file" accept="image/*" className="hidden" onChange={choisirLogo} />
            <p className="mt-1 text-[11px] text-[var(--sane-text-light)]">PNG ou JPG, 2 Mo maximum.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nom" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
              Nom de la plateforme <span className="text-[var(--sane-red-dark)]">*</span>
            </label>
            <input
              id="nom" required value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
              Email de contact <span className="text-[var(--sane-red-dark)]">*</span>
            </label>
            <input
              id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div>
            <label htmlFor="telephone" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">Téléphone</label>
            <input
              id="telephone" value={form.telephone} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div>
            <label htmlFor="adresse" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">Adresse</label>
            <input
              id="adresse" value={form.adresse} onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="site_web" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">Site web</label>
            <input
              id="site_web" type="url" placeholder="https://" value={form.site_web} onChange={(e) => setForm((f) => ({ ...f, site_web: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">Description</label>
            <textarea
              id="description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
        </div>

        <h2 className="mb-1 mt-7 text-[15px] font-bold text-[var(--sane-text)]">Réseaux sociaux</h2>
        <p className="mb-4 text-[12px] text-[var(--sane-text-light)]">
          Ces adresses alimentent les icônes du pied de page et de la page Contact.
          Un réseau laissé vide n&apos;affiche aucune icône.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESEAUX.map((r) => (
            <div key={r.nom}>
              <label htmlFor={r.nom} className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
                {r.label}
              </label>
              <input
                id={r.nom}
                type="url"
                placeholder={r.exemple}
                value={form[r.nom]}
                onChange={(e) => setForm((f) => ({ ...f, [r.nom]: e.target.value }))}
                className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
              />
            </div>
          ))}
        </div>

        <button
          type="submit" disabled={envoi}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--sane-green)] px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {envoi ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Enregistrer les modifications
        </button>
      </form>
    </AdminPage>
  );
}
