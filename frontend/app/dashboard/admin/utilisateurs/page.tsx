"use client";

import { useState } from "react";
import {Pencil, ShieldCheck, Trash2, UserPlus} from "lucide-react";
import { Spinner } from "@/components/dashboard/Spinner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { AdminGuard } from "@/components/dashboard/AdminGuard";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { adminNav } from "@/lib/adminNav";
import { api, ApiError } from "@/lib/api";
import { DialogueConfirmation } from "@/components/dashboard/DialogueConfirmation";

const sidebarItems = adminNav("Utilisateurs", 0);

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
  const [filtreRole, setFiltreRole] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");

  const table = useApiTable<AdminUtilisateur>("/admin/utilisateurs", {
    filtres: { role: filtreRole, statut: filtreStatut },
  });

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
      entete: "",
      rendu: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Spinner actif={action === u.id} size={14} className="text-[var(--sane-green)]" />
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
      <DialogueConfirmation
        ouvert={aSupprimer !== null}
        titre="Supprimer ce compte ?"
        message={`Le compte de ${aSupprimer?.nom ?? ""} sera supprimé définitivement, avec son profil et ses candidatures.`}
        enCours={action === aSupprimer?.id}
        onConfirmer={supprimer}
        onAnnuler={() => setASupprimer(null)}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total", valeur: table.resume.total ?? 0, icone: UserPlus },
          { label: "Actifs", valeur: table.resume.actifs ?? 0, icone: ShieldCheck },
          { label: "Recruteurs", valeur: table.resume.recruteur ?? 0, icone: Pencil },
          { label: "Demandeurs", valeur: table.resume.demandeur ?? 0, icone: UserPlus },
        ].map(({ label, valeur }) => (
          <div key={label} className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
            <p className="text-[22px] font-bold leading-none text-[var(--sane-text)]">{valeur}</p>
            <p className="mt-1 text-[12px] text-[var(--sane-text-light)]">{label}</p>
          </div>
        ))}
      </div>

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
        actions={
          <div className="flex gap-2">
            <select
              value={filtreRole}
              onChange={(e) => setFiltreRole(e.target.value)}
              aria-label="Filtrer par rôle"
              className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
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
              className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
            >
              <option value="">Tous</option>
              <option value="actif">Actifs</option>
              <option value="suspendu">Suspendus</option>
            </select>
          </div>
        }
      />
    </>
  );
}

export default function UtilisateursAdminPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[var(--sane-background)]">
        <DashboardSidebar items={sidebarItems} />
        <div className="min-w-0 flex-1">
          <DashboardNavbar />
          <main className="p-5 sm:p-8">
            <h1 className="mb-1 text-[18px] font-bold text-[var(--sane-green-deep)]">Utilisateurs</h1>
            <p className="mb-5 text-[12px] text-[var(--sane-text-light)]">
              Comptes, rôles et accès à la plateforme
            </p>
            <Contenu />
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
