"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Eye, Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { OffreForm } from "@/components/recruteur/OffreForm";
import { api, ApiError } from "@/lib/api";
import type { ApiOffre, OffresEntrepriseResponse, StatutOffre } from "@/lib/types";

const COULEUR_STATUT: Record<string, string> = {
  publiee: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  brouillon: "bg-[var(--sane-background)] text-[var(--sane-text-light)]",
  pourvue: "bg-[#eef4ff] text-[#0066b2]",
  expiree: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
  fermee: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
};

function Contenu() {
  const [offres, setOffres] = useState<ApiOffre[]>([]);
  const [resume, setResume] = useState<OffresEntrepriseResponse["resume"] | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [edition, setEdition] = useState<ApiOffre | null | "nouvelle">(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const res = await api.get<OffresEntrepriseResponse>("/entreprise/offres");
      setOffres(res.data);
      setResume(res.resume);
    } catch (e) {
      setErreur(
        e instanceof ApiError
          ? e.message
          : "Impossible de charger vos offres."
      );
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  async function changerStatut(offre: ApiOffre, statut: StatutOffre) {
    try {
      await api.put(`/entreprise/offres/${offre.id}/statut`, { statut });
      await charger();
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Changement de statut impossible.");
    }
  }

  async function supprimer(offre: ApiOffre) {
    if (!confirm(`Supprimer l'offre « ${offre.titre} » ? Cette action est définitive.`)) return;

    try {
      await api.delete(`/entreprise/offres/${offre.id}`);
      await charger();
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Suppression impossible.");
    }
  }

  if (edition !== null) {
    return (
      <OffreForm
        offre={edition === "nouvelle" ? undefined : edition}
        onAnnuler={() => setEdition(null)}
        onEnregistre={() => {
          setEdition(null);
          void charger();
        }}
      />
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-[13px] text-[var(--sane-text-light)]">
          {resume && (
            <>
              <span><strong className="text-[var(--sane-text)]">{resume.total}</strong> offre(s)</span>
              <span><strong className="text-[var(--sane-text)]">{resume.publiees}</strong> publiée(s)</span>
              <span><strong className="text-[var(--sane-text)]">{resume.brouillons}</strong> brouillon(s)</span>
              <span><strong className="text-[var(--sane-text)]">{resume.candidatures}</strong> candidature(s)</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setEdition("nouvelle")}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          <Plus size={15} /> Nouvelle offre
        </button>
      </div>

      <Alerte texte={erreur} className="mb-4" />

      {chargement ? (
        <p className="flex items-center gap-2 py-10">
          <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
          <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
        </p>
      ) : offres.length === 0 ? (
        <p className="rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center text-[13px] text-[var(--sane-text-light)]">
          Vous n&apos;avez pas encore créé d&apos;offre.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
              <tr>
                <th scope="col" className="px-4 py-3 text-[12px] font-semibold text-[var(--sane-text-light)]">Poste</th>
                <th scope="col" className="hidden px-4 py-3 text-[12px] font-semibold text-[var(--sane-text-light)] sm:table-cell">Statut</th>
                <th scope="col" className="hidden px-4 py-3 text-[12px] font-semibold text-[var(--sane-text-light)] md:table-cell">Candidatures</th>
                <th scope="col" className="px-4 py-3 text-right text-[12px] font-semibold text-[var(--sane-text-light)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sane-border)]">
              {offres.map((offre) => (
                <tr key={offre.id}>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-[var(--sane-text)]">{offre.titre}</p>
                    <p className="text-[12px] text-[var(--sane-text-light)]">
                      {offre.ville} · {offre.type_contrat_label}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${COULEUR_STATUT[offre.statut ?? ""] ?? ""}`}>
                      {offre.statut_label}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--sane-text)]">
                      <Users size={14} className="text-[var(--sane-text-light)]" />
                      {offre.candidatures_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {offre.statut === "brouillon" && (
                        <button
                          type="button"
                          onClick={() => changerStatut(offre, "publiee")}
                          title="Publier"
                          className="rounded-lg p-2 text-[var(--sane-green)] hover:bg-[var(--sane-green-light)]"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEdition(offre)}
                        title="Modifier"
                        className="rounded-lg p-2 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => supprimer(offre)}
                        title="Supprimer"
                        className="rounded-lg p-2 text-[var(--sane-red-dark)] hover:bg-[#fdf1f1]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function OffresRecruteurPage() {
  return (
    <RoleGuard roles={["recruteur", "entreprise"]} espace="l'espace recruteur">
      <RecruteurLayout titre="Mes offres" description="Créez et gérez vos offres d'emploi">
        <Contenu />
      </RecruteurLayout>
    </RoleGuard>
  );
}
