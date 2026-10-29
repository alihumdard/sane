"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { retourApresEnregistrement } from "@/components/dashboard/messageEnregistrement";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError } from "@/lib/api";

const BASE = "/dashboard/admin/utilisateurs";

const champClass =
  "w-full rounded-xl border border-[var(--sane-border)] bg-white px-3 py-2.5 text-[13px] text-[var(--sane-text)] outline-none transition-colors placeholder:text-[var(--sane-text-light)]/60 focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";

const ROLES = [
  { value: "participant", label: "Participant", aide: "Assiste au salon et s'inscrit aux formations." },
  { value: "demandeur", label: "Demandeur d'emploi", aide: "Dépose un CV et postule aux offres." },
  { value: "entreprise", label: "Entreprise", aide: "Gère une fiche entreprise et publie des offres." },
  { value: "recruteur", label: "Recruteur", aide: "Traite les candidatures d'une entreprise." },
  { value: "organisateur", label: "Organisateur", aide: "Accède au back-office, sauf la gestion des comptes." },
  { value: "administrateur", label: "Administrateur", aide: "Accès complet au back-office." },
];

/**
 * Create an account from the back-office.
 *
 * The menu offered "Ajouter un compte" and landed on the list, where nothing
 * opened: the endpoint existed and had no screen. Needed for the staff
 * accounts — organisers and administrators — which public signup cannot grant.
 */
export default function NouvelUtilisateurPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone: "",
    role: "participant",
    password: "",
  });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    setErreurs({});

    try {
      await api.post("/admin/utilisateurs", {
        ...form,
        telephone: form.telephone.trim() || null,
      });

      router.push(retourApresEnregistrement(BASE, "cree"));
    } catch (err) {
      if (err instanceof ApiError) {
        setErreurs(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
        setErreur(
          Object.keys(err.errors).length > 0 ? "Corrigez les champs signalés ci-dessous." : err.message
        );
      } else {
        setErreur("Création impossible. Vérifiez votre connexion et réessayez.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  const roleChoisi = ROLES.find((r) => r.value === form.role);

  return (
    <AdminPage
      titre="Ajouter un compte"
      description="Pour les comptes que l'inscription publique ne permet pas de créer : organisateurs et administrateurs."
      retour={{ href: BASE, label: "Retour aux utilisateurs" }}
    >
      <form onSubmit={enregistrer} className="max-w-[620px]">
        <Alerte texte={erreur} className="mb-4" />

        <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
                Nom complet<span className="text-[var(--sane-orange)]"> *</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={champClass}
              />
              <p className={"mt-1 text-[12px] font-medium text-[var(--sane-red-dark)] " + (erreurs.name ? "block" : "hidden")}>
                {erreurs.name}
              </p>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
                Email<span className="text-[var(--sane-orange)]"> *</span>
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="off"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={champClass}
              />
              <p className={"mt-1 text-[12px] font-medium text-[var(--sane-red-dark)] " + (erreurs.email ? "block" : "hidden")}>
                {erreurs.email}
              </p>
            </div>

            <div>
              <label htmlFor="telephone" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
                Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
                className={champClass}
              />
              <p className={"mt-1 text-[12px] font-medium text-[var(--sane-red-dark)] " + (erreurs.telephone ? "block" : "hidden")}>
                {erreurs.telephone}
              </p>
            </div>

            <div>
              <label htmlFor="role" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
                Rôle<span className="text-[var(--sane-orange)]"> *</span>
              </label>
              <select
                id="role"
                required
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className={champClass}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11.5px] text-[var(--sane-text-light)]">{roleChoisi?.aide}</p>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
                Mot de passe<span className="text-[var(--sane-orange)]"> *</span>
              </label>
              <input
                id="password"
                type="text"
                required
                autoComplete="new-password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={champClass}
              />
              <p
                className={
                  "mt-1 text-[11.5px] text-[var(--sane-text-light)] " + (erreurs.password ? "hidden" : "block")
                }
              >
                Au moins 8 caractères, avec des lettres et des chiffres. Lisible ici pour que vous puissiez le
                transmettre.
              </p>
              <p className={"mt-1 text-[12px] font-medium text-[var(--sane-red-dark)] " + (erreurs.password ? "block" : "hidden")}>
                {erreurs.password}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--sane-border)] pt-5">
            <button
              type="submit"
              disabled={envoi}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[var(--sane-orange-dark)] disabled:opacity-60"
            >
              <SpinnerOu actif={envoi}>
                <UserPlus size={15} />
              </SpinnerOu>
              Créer le compte
            </button>

            <Link
              href={BASE}
              className="text-[13px] font-semibold text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)]"
            >
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </AdminPage>
  );
}
