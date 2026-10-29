"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Eye, ShieldCheck, Trash2, Users, UserPlus } from "lucide-react";
import { Spinner } from "@/components/dashboard/Spinner";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { useMessageEnregistrement } from "@/components/dashboard/messageEnregistrement";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError } from "@/lib/api";
import { DialogueConfirmation } from "@/components/dashboard/DialogueConfirmation";
import { Fait, PanneauDetail } from "@/components/dashboard/PanneauDetail";

interface AdminUtilisateur {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  role: string;
  role_label: string;
  statut: string;
  inscriptions_count: number;
  derniere_connexion_le: string | null;
  created_at: string;
}

const ROLES = [
  { value: "participant", label: "Participant" },
  { value: "demandeur", label: "Demandeur d'emploi" },
  { value: "entreprise", label: "Entreprise" },
  { value: "recruteur", label: "Recruteur" },
  { value: "organisateur", label: "Organisateur" },
  { value: "administrateur", label: "Administrateur" },
];

function Contenu() {
  const [aSupprimer, setASupprimer] = useState<AdminUtilisateur | null>(null);
  const [ouvert, setOuvert] = useState<AdminUtilisateur | null>(null);
  const [filtreRole, setFiltreRole] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");

  const table = useApiTable<AdminUtilisateur>("/admin/utilisateurs", {
    filtres: { role: filtreRole, statut: filtreStatut },
  });
  const enregistre = useMessageEnregistrement("/dashboard/admin/utilisateurs");

  const [action, setAction] = useState<number | null>(null);

  async function changerStatut(u: AdminUtilisateur) {
    setAction(u.id);

    try {
      await api.put(`/admin/utilisateurs/${u.id}`, {
        statut: u.statut === "actif" ? "suspendu" : "actif",
      });
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Modification impossible.");
    } finally {
      setAction(null);
    }
  }

  async function changerRole(u: AdminUtilisateur, role: string) {
    setAction(u.id);

    try {
      await api.put(`/admin/utilisateurs/${u.id}`, { role });
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Modification impossible.");
    } finally {
      setAction(null);
    }
  }

  async function supprimer() {
    const u = aSupprimer;

    if (!u) return;

    setASupprimer(null);
    setAction(u.id);

    try {
      await api.delete(`/admin/utilisateurs/${u.id}`);
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Suppression impossible.");
    } finally {
      setAction(null);
    }
  }

  const colonnes: Colonne<AdminUtilisateur>[] = [
    {
      cle: "nom",
      entete: "Utilisateur",
      rendu: (u) => (
        <>
          <p className="font-semibold">{u.nom}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{u.email}</p>
        </>
      ),
    },
    {
      cle: "role",
      entete: "Rôle",
      masquer: "sm",
      rendu: (u) => (
        <select
          value={u.role}
          disabled={action === u.id}
          onChange={(e) => changerRole(u, e.target.value)}
          aria-label={`Rôle de ${u.nom}`}
          className="rounded-lg border border-[var(--sane-border)] px-2 py-1 text-[12px] outline-none focus:border-[var(--sane-green)]"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      ),
    },
    {
      cle: "statut",
      entete: "Statut",
      masquer: "md",
      rendu: (u) => (
        <button
          type="button"
          onClick={() => changerStatut(u)}
          disabled={action === u.id}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            u.statut === "actif"
              ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
              : "bg-[#fdf1f1] text-[var(--sane-red-dark)]"
          }`}
        >
          {u.statut === "actif" ? "Actif" : "Suspendu"}
        </button>
      ),
    },
    {
      cle: "connexion",
      entete: "Dernière connexion",
      masquer: "lg",
      rendu: (u) =>
        u.derniere_connexion_le
          ? new Date(u.derniere_connexion_le).toLocaleDateString("fr-FR")
          : "—",
    },
    {
      cle: "actions",
      entete: "Actions",
      fin: true,
      rendu: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Spinner actif={action === u.id} size={14} className="text-[var(--sane-green)]" />
          <button
            type="button"
            onClick={() => setOuvert(u)}
            title="Voir le détail"
            className="rounded-lg p-2 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            onClick={() => setASupprimer(u)}
            title="Supprimer"
            className="rounded-lg p-2 text-[var(--sane-red-dark)] hover:bg-[#fdf1f1]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PanneauDetail
        ouvert={ouvert !== null}
        titre={ouvert?.nom ?? ""}
        sousTitre={ouvert?.role_label}
        onFermer={() => setOuvert(null)}
        actions={
          <button
            type="button"
            onClick={() => {
              const u = ouvert!;
              setOuvert(null);
              void changerStatut(u);
            }}
            className={`w-full rounded-lg px-4 py-2.5 text-[13px] font-bold text-white ${
              ouvert?.statut === "actif" ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"
            }`}
          >
            {ouvert?.statut === "actif" ? "Suspendre ce compte" : "Réactiver ce compte"}
          </button>
        }
      >
        <Fait
          label="Email"
          valeur={
            ouvert?.email ? (
              <a href={`mailto:${ouvert.email}`} className="text-[var(--sane-green)] hover:underline">
                {ouvert.email}
              </a>
            ) : null
          }
        />
        <Fait label="Téléphone" valeur={ouvert?.telephone} />
        <Fait label="Rôle" valeur={ouvert?.role_label} />
        <Fait
          label="Statut"
          valeur={ouvert?.statut === "actif" ? "Actif" : "Suspendu — ne peut plus se connecter"}
        />
        <Fait label="Inscriptions à l'événement" valeur={ouvert?.inscriptions_count ?? 0} />
        <Fait
          label="Dernière connexion"
          valeur={
            ouvert?.derniere_connexion_le
              ? new Date(ouvert.derniere_connexion_le).toLocaleString("fr-FR")
              : "Jamais"
          }
        />
        <Fait
          label="Compte créé le"
          valeur={
            ouvert?.created_at
              ? new Date(ouvert.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : null
          }
        />
      </PanneauDetail>

      <DialogueConfirmation
        ouvert={aSupprimer !== null}
        titre="Supprimer ce compte ?"
        message={`Le compte de ${aSupprimer?.nom ?? ""} sera supprimé définitivement, avec son profil et ses candidatures.`}
        enCours={action === aSupprimer?.id}
        onConfirmer={supprimer}
        onAnnuler={() => setASupprimer(null)}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardStatCard icon={<Users size={20} />} value={table.resume.total ?? 0} label="Comptes au total" accent="green" />
        <DashboardStatCard icon={<ShieldCheck size={20} />} value={table.resume.actifs ?? 0} label="Comptes actifs" accent="blue" />
        <DashboardStatCard icon={<Briefcase size={20} />} value={table.resume.recruteur ?? 0} label="Recruteurs" accent="orange" />
        <DashboardStatCard icon={<UserPlus size={20} />} value={table.resume.demandeur ?? 0} label="Demandeurs d'emploi" accent="teal" />
      </div>

      <Alerte texte={enregistre} ton="succes" className="mb-3" />

      <AdminTable
        colonnes={colonnes}
        lignes={table.lignes}
        meta={table.meta}
        chargement={table.chargement}
        erreur={table.erreur}
        recherche={table.recherche}
        onRecherche={table.setRecherche}
        onPage={table.setPage}
        cle={(u) => u.id}
        vide="Aucun utilisateur."
        rechercheLabel="Rechercher un nom, un email…"
        actions={
          <Link
            href="/dashboard/admin/utilisateurs/nouveau"
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--sane-orange)] px-5 text-[13px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(229,118,23,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[var(--sane-orange-dark)] hover:shadow-[0_10px_22px_-6px_rgba(229,118,23,0.85)]"
          >
            <UserPlus size={15} /> Ajouter un compte
          </Link>
        }
        filtres={
          <>
            <select
              value={filtreRole}
              onChange={(e) => setFiltreRole(e.target.value)}
              aria-label="Filtrer par rôle"
              className="h-11 rounded-xl border border-[var(--sane-border)] bg-white px-3.5 text-[12.5px] font-medium text-[var(--sane-text)] outline-none transition-all hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8"
            >
              <option value="">Tous les rôles</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              aria-label="Filtrer par statut"
              className="h-11 rounded-xl border border-[var(--sane-border)] bg-white px-3.5 text-[12.5px] font-medium text-[var(--sane-text)] outline-none transition-all hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8"
            >
              <option value="">Tous</option>
              <option value="actif">Actifs</option>
              <option value="suspendu">Suspendus</option>
            </select>
          </>
        }
      />
    </>
  );
}

export default function UtilisateursAdminPage() {
  return (
    <AdminPage
      titre="Utilisateurs"
      description="Comptes, rôles et accès à la plateforme. Suspendre un compte l'empêche de se connecter sans supprimer ses données."
    >
      <Contenu />
    </AdminPage>
  );
}
