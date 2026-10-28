"use client";

import { useState } from "react";
import { BadgeCheck, Eye, Loader2, ShieldOff, Trash2 } from "lucide-react";
import { Spinner } from "@/components/dashboard/Spinner";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { DialogueConfirmation } from "@/components/dashboard/DialogueConfirmation";
import { Fait, PanneauDetail } from "@/components/dashboard/PanneauDetail";
import { api, ApiError } from "@/lib/api";
import type { ApiEntretien, ApiOffre } from "@/lib/types";

const STATUTS_ENTRETIEN = [
  { value: "en_attente", label: "En attente" },
  { value: "confirme", label: "Confirmé" },
  { value: "termine", label: "Terminé" },
  { value: "annule", label: "Annulé" },
];

interface AdminEntreprise {
  id: number;
  nom: string;
  secteur: string | null;
  ville: string | null;
  site_web: string | null;
  telephone: string | null;
  description: string | null;
  verifiee: boolean;
  offres_count: number;
  offres_publiees_count: number;
  /** The recruiter who owns it — who the moderator is really vouching for. */
  user: { id: number; name: string; email: string; telephone: string | null } | null;
  created_at: string;
}

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publiee", label: "Publiée" },
  { value: "pourvue", label: "Pourvue" },
  { value: "fermee", label: "Fermée" },
];

function Offres() {
  const [aSupprimer, setASupprimer] = useState<ApiOffre | null>(null);
  const [suppression, setSuppression] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState("");
  const table = useApiTable<ApiOffre>("/admin/emploi/offres", { filtres: { statut: filtreStatut } });
  const [action, setAction] = useState<number | null>(null);

  async function changerStatut(offre: ApiOffre, statut: string) {
    setAction(offre.id);

    try {
      await api.put(`/admin/emploi/offres/${offre.id}/statut`, { statut });
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Modification impossible.");
    } finally {
      setAction(null);
    }
  }

  async function supprimer() {
    if (!aSupprimer) return;

    setSuppression(true);

    try {
      await api.delete(`/admin/emploi/offres/${aSupprimer.id}`);
      setASupprimer(null);
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Suppression impossible.");
      setASupprimer(null);
    } finally {
      setSuppression(false);
    }
  }

  const colonnes: Colonne<ApiOffre>[] = [
    {
      cle: "titre",
      entete: "Offre",
      rendu: (o) => (
        <>
          <p className="font-semibold">{o.titre}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{o.entreprise?.nom}</p>
        </>
      ),
    },
    { cle: "ville", entete: "Lieu", masquer: "sm", rendu: (o) => `${o.ville} · ${o.type_contrat_label ?? ""}` },
    {
      cle: "statut",
      entete: "Statut",
      masquer: "md",
      rendu: (o) => (
        <select
          value={o.statut ?? ""}
          disabled={action === o.id}
          onChange={(e) => changerStatut(o, e.target.value)}
          aria-label={`Statut de ${o.titre}`}
          className="rounded-lg border border-[var(--sane-border)] px-2 py-1 text-[12px] outline-none focus:border-[var(--sane-green)]"
        >
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      ),
    },
    { cle: "candidatures", entete: "Cand.", masquer: "lg", rendu: (o) => o.candidatures_count },
    {
      cle: "actions",
      entete: "",
      rendu: (o) => (
        <div className="flex items-center justify-end gap-1">
          <Spinner actif={action === o.id} size={14} className="text-[var(--sane-green)]" />
          <button type="button" onClick={() => setASupprimer(o)} title="Supprimer" className="rounded-lg p-2 text-[var(--sane-red-dark)] hover:bg-[#fdf1f1]">
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
        titre="Supprimer cette offre ?"
        message={`« ${aSupprimer?.titre ?? ""} » et les candidatures reçues seront retirées. Cette action est définitive.`}
        enCours={suppression}
        onConfirmer={supprimer}
        onAnnuler={() => setASupprimer(null)}
      />

    <AdminTable
      colonnes={colonnes}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={(o) => o.id}
      vide="Aucune offre."
      actions={
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          aria-label="Filtrer par statut"
          className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      }
      />
    </>
  );
}

function Entreprises() {
  // Named rather than a boolean: the dialog says which company it is about.
  const [aRetirer, setARetirer] = useState<AdminEntreprise | null>(null);
  const [ouverte, setOuverte] = useState<AdminEntreprise | null>(null);
  const table = useApiTable<AdminEntreprise>("/admin/emploi/entreprises");
  const [action, setAction] = useState<number | null>(null);

  async function verifier(e: AdminEntreprise, verifiee: boolean) {
    // Withdrawing closes the company's live offers and warns its recruiter,
    // so it is asked first; granting it takes nothing away.
    if (!verifiee) {
      setARetirer(e);

      return;
    }

    await appliquerVerification(e, true);
  }

  async function appliquerVerification(e: AdminEntreprise, verifiee: boolean) {
    setARetirer(null);
    setAction(e.id);

    try {
      await api.put(`/admin/emploi/entreprises/${e.id}/verification`, { verifiee });
      await table.recharger();
    } catch (err) {
      table.setErreur(err instanceof ApiError ? err.message : "Modification impossible.");
    } finally {
      setAction(null);
    }
  }

  const colonnes: Colonne<AdminEntreprise>[] = [
    {
      cle: "nom",
      entete: "Entreprise",
      rendu: (e) => (
        <>
          <p className="font-semibold">{e.nom}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">
            {[e.secteur, e.ville].filter(Boolean).join(" · ") || "—"}
          </p>
        </>
      ),
    },
    {
      cle: "offres",
      entete: "Offres",
      masquer: "sm",
      rendu: (e) => (
        <>
          <p>{e.offres_count}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{e.offres_publiees_count} publiée(s)</p>
        </>
      ),
    },
    {
      cle: "verifiee",
      entete: "Vérification",
      rendu: (e) => (
        <button
          type="button"
          onClick={() => verifier(e, !e.verifiee)}
          disabled={action === e.id}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
            e.verifiee
              ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
              : "bg-[#fff8ed] text-[var(--sane-orange)]"
          }`}
        >
          {action === e.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : e.verifiee ? (
            <BadgeCheck size={12} />
          ) : (
            <ShieldOff size={12} />
          )}
          {e.verifiee ? "Vérifiée" : "À vérifier"}
        </button>
      ),
    },
    {
      cle: "_detail",
      entete: "",
      rendu: (e) => (
        <button
          type="button"
          onClick={() => setOuverte(e)}
          title="Voir le détail"
          className="rounded-lg p-2 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)] hover:text-[var(--sane-green)]"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PanneauDetail
        ouvert={ouverte !== null}
        titre={ouverte?.nom ?? ""}
        sousTitre={[ouverte?.secteur, ouverte?.ville].filter(Boolean).join(" · ")}
        onFermer={() => setOuverte(null)}
        actions={
          <button
            type="button"
            onClick={() => {
              const e = ouverte!;
              setOuverte(null);
              void verifier(e, !e.verifiee);
            }}
            className={`w-full rounded-lg px-4 py-2.5 text-[13px] font-bold text-white ${
              ouverte?.verifiee ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"
            }`}
          >
            {ouverte?.verifiee ? "Retirer la vérification" : "Vérifier cette entreprise"}
          </button>
        }
      >
        <Fait label="Recruteur" valeur={ouverte?.user?.name} />
        <Fait
          label="Email"
          valeur={
            ouverte?.user?.email ? (
              <a href={`mailto:${ouverte.user.email}`} className="text-[var(--sane-green)] hover:underline">
                {ouverte.user.email}
              </a>
            ) : null
          }
        />
        <Fait label="Téléphone" valeur={ouverte?.telephone ?? ouverte?.user?.telephone} />
        <Fait
          label="Site web"
          valeur={
            ouverte?.site_web ? (
              <a
                href={ouverte.site_web}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[var(--sane-green)] hover:underline"
              >
                {ouverte.site_web}
              </a>
            ) : null
          }
        />
        <Fait label="Présentation" valeur={ouverte?.description} />
        <Fait
          label="Offres"
          valeur={`${ouverte?.offres_count ?? 0} au total, ${ouverte?.offres_publiees_count ?? 0} publiée(s)`}
        />
        <Fait
          label="Vérification"
          valeur={ouverte?.verifiee ? "Vérifiée" : "En attente — ses offres restent en brouillon"}
        />
        <Fait
          label="Inscrite le"
          valeur={
            ouverte?.created_at
              ? new Date(ouverte.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : null
          }
        />
      </PanneauDetail>

      <DialogueConfirmation
        ouvert={aRetirer !== null}
        titre="Retirer la vérification ?"
        message={`Les offres publiées de « ${aRetirer?.nom ?? ""} » seront fermées et son recruteur en sera informé. Les rétablir lui reviendra.`}
        confirmer="Retirer"
        enCours={action === aRetirer?.id}
        onConfirmer={() => aRetirer && appliquerVerification(aRetirer, false)}
        onAnnuler={() => setARetirer(null)}
      />

      <AdminTable
      colonnes={colonnes}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={(e) => e.id}
      vide="Aucune entreprise."
      />
    </>
  );
}

function Entretiens() {
  const [filtreStatut, setFiltreStatut] = useState("");
  const table = useApiTable<ApiEntretien>("/admin/emploi/entretiens", { filtres: { statut: filtreStatut } });

  const colonnes: Colonne<ApiEntretien>[] = [
    {
      cle: "candidat",
      entete: "Candidat",
      rendu: (e) => (
        <>
          <p className="font-semibold">{e.candidature?.profil?.nom ?? "—"}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{e.candidature?.offre?.titre}</p>
        </>
      ),
    },
    {
      cle: "entreprise",
      entete: "Entreprise",
      masquer: "sm",
      rendu: (e) => e.candidature?.offre?.entreprise?.nom ?? "—",
    },
    {
      cle: "creneau",
      entete: "Créneau",
      masquer: "md",
      rendu: (e) =>
        e.creneau
          ? `${new Date(e.creneau.debut).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} · ${e.creneau.mode_label}`
          : "—",
    },
    {
      cle: "statut",
      entete: "Statut",
      rendu: (e) => (
        <span className="rounded-full bg-[var(--sane-background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-text)]">
          {e.statut_label}
        </span>
      ),
    },
  ];

  return (
    <AdminTable
      colonnes={colonnes}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={(e) => e.id}
      vide="Aucun entretien."
      actions={
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          aria-label="Filtrer par statut"
          className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
        >
          <option value="">Tous les statuts</option>
          {STATUTS_ENTRETIEN.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      }
    />
  );
}

export default function EmploiAdminPage() {
  const [onglet, setOnglet] = useState<"offres" | "entreprises" | "entretiens">("offres");

  return (
    <AdminPage section="Emploi" titre="Emploi" description="Modération des offres, vérification des entreprises et suivi des entretiens">
      <div className="mb-4 flex gap-2">
        {([["offres", "Offres"], ["entreprises", "Entreprises"], ["entretiens", "Entretiens"]] as const).map(([cle, label]) => (
          <button
            key={cle}
            type="button"
            onClick={() => setOnglet(cle)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
              onglet === cle ? "bg-[var(--sane-green)] text-white" : "bg-white text-[var(--sane-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {onglet === "offres" ? <Offres /> : onglet === "entreprises" ? <Entreprises /> : <Entretiens />}
    </AdminPage>
  );
}
