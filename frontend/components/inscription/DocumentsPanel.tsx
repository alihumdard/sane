"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { ApiDocument, DocumentRequis, DocumentsResponse } from "@/lib/types";
import { DocumentUpload } from "./DocumentUpload";

interface DocumentsPanelProps {
  reference: string;
  email: string;
}

/**
 * Shown once the registration is saved: the participant still holds the page,
 * so this is the natural moment to collect their papers. Nothing here blocks
 * the registration itself — it is already recorded either way.
 */
export function DocumentsPanel({ reference, email }: DocumentsPanelProps) {
  const [requis, setRequis] = useState<DocumentRequis[]>([]);
  const [documents, setDocuments] = useState<Record<string, ApiDocument>>({});
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;

    async function charger() {
      try {
        const res = await api.get<DocumentsResponse>(
          `/inscriptions/${encodeURIComponent(reference)}/documents?email=${encodeURIComponent(email)}`
        );

        if (!actif) return;

        setRequis(res.requis);
        setDocuments(Object.fromEntries(res.data.map((d) => [d.type, d])));
      } catch (e) {
        if (!actif) return;
        setErreur(
          e instanceof ApiError
            ? e.message
            : "Impossible de charger la liste des documents."
        );
      } finally {
        if (actif) setChargement(false);
      }
    }

    charger();

    return () => {
      actif = false;
    };
  }, [reference, email]);

  const manquants = requis.filter((r) => r.obligatoire && !documents[r.value]).length;

  if (chargement) {
    return (
      <p className="flex items-center justify-center gap-2 py-6">
        <Loader2 size={16} className="animate-spin text-[var(--sane-green)]" />
        <span className="sane-small">Chargement des documents…</span>
      </p>
    );
  }

  if (erreur) {
    return (
      <p role="alert" className="flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-4">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
        <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
      </p>
    );
  }

  return (
    <div className="text-left">
      <h4 className="sane-h3 mb-1">Vos pièces justificatives</h4>
      <p className="sane-body mb-4">
        {manquants > 0
          ? `Il vous reste ${manquants} document${manquants > 1 ? "s" : ""} obligatoire${manquants > 1 ? "s" : ""} à envoyer. Vous pouvez aussi les envoyer plus tard avec votre référence.`
          : "Tous vos documents obligatoires ont bien été reçus. Merci !"}
      </p>

      <div className="flex flex-col gap-3">
        {requis.map((r) => (
          <DocumentUpload
            key={r.value}
            reference={reference}
            email={email}
            requis={r}
            document={documents[r.value]}
            onUploaded={(doc) => setDocuments((map) => ({ ...map, [doc.type]: doc }))}
          />
        ))}
      </div>

      <p className="sane-small mt-4 flex items-start gap-2 opacity-80">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--sane-green)]" />
        Vos documents sont stockés de manière sécurisée et ne sont consultables que par
        l&apos;équipe d&apos;organisation du SANEM.
      </p>
    </div>
  );
}
