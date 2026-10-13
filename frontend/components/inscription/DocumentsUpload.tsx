"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { api, ApiError } from "@/lib/api";
import type { DocumentAttendu, DocumentsResponse, DocumentUpload } from "@/lib/types";

interface Props {
  reference: string;
  /**
   * Email used at registration. References are sequential and therefore
   * guessable, so the API requires it before it will read or write the
   * documents attached to one.
   */
  email: string;
}

/**
 * Shown after a registration is submitted. Uploads are optional at this point:
 * the registration already exists, and someone on a phone may not have their
 * papers to hand — the admin can chase anything missing later.
 */
export function DocumentsUpload({ reference, email }: Props) {
  const [attendus, setAttendus] = useState<DocumentAttendu[]>([]);
  const [fournis, setFournis] = useState<DocumentUpload[]>([]);
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  useEffect(() => {
    let annule = false;

    api
      .get<DocumentsResponse>(
        `/inscriptions/${reference}/documents?email=${encodeURIComponent(email)}`
      )
      .then((res) => {
        if (!annule) {
          setAttendus(res.attendus);
          setFournis(res.data);
        }
      })
      .catch(() => {
        // The slots are informational until one is used; failing to list them
        // should not block the success screen the participant just reached.
      })
      .finally(() => {
        if (!annule) setChargement(false);
      });

    return () => {
      annule = true;
    };
  }, [reference, email]);

  async function televerser(type: string, fichier: File) {
    setEnCours(type);
    setErreurs((e) => ({ ...e, [type]: "" }));

    const corps = new FormData();
    corps.append("email", email);
    corps.append("type", type);
    corps.append("fichier", fichier);

    try {
      const res = await api.upload<{ data: DocumentUpload }>(
        `/inscriptions/${reference}/documents`,
        corps
      );
      setFournis((liste) => [...liste.filter((d) => d.type !== type), res.data]);
    } catch (e) {
      setErreurs((prev) => ({
        ...prev,
        [type]:
          e instanceof ApiError
            ? (e.fieldError("fichier") ?? e.message)
            : "L'envoi a échoué.",
      }));
    } finally {
      setEnCours(null);
    }
  }

  async function supprimer(doc: DocumentUpload) {
    setEnCours(doc.type);

    try {
      await api.delete(
        `/inscriptions/${reference}/documents/${doc.id}?email=${encodeURIComponent(email)}`
      );
      setFournis((liste) => liste.filter((d) => d.id !== doc.id));
    } catch (e) {
      setErreurs((prev) => ({
        ...prev,
        [doc.type]: e instanceof ApiError ? e.message : "La suppression a échoué.",
      }));
    } finally {
      setEnCours(null);
    }
  }

  if (chargement) {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        <Loader2 size={16} className="animate-spin text-[var(--sane-green)]" />
        <p className="sane-small">Chargement…</p>
      </div>
    );
  }

  if (attendus.length === 0) return null;

  return (
    <div className="mt-8 w-full border-t border-[var(--sane-border)] pt-6 text-left">
      <h4 className="sane-h3 mb-1 text-[15px]">Vos documents</h4>
      <p className="sane-small mb-5">
        Vous pouvez les envoyer maintenant ou plus tard, en gardant votre référence.
      </p>

      <div className="flex flex-col gap-2.5">
        {attendus.map((attendu) => (
          <Emplacement
            key={attendu.type}
            attendu={attendu}
            document={fournis.find((d) => d.type === attendu.type)}
            occupe={enCours === attendu.type}
            erreur={erreurs[attendu.type]}
            onTeleverser={(f) => televerser(attendu.type, f)}
            onSupprimer={supprimer}
          />
        ))}
      </div>
    </div>
  );
}

function Emplacement({
  attendu,
  document,
  occupe,
  erreur,
  onTeleverser,
  onSupprimer,
}: {
  attendu: DocumentAttendu;
  document?: DocumentUpload;
  occupe: boolean;
  erreur?: string;
  onTeleverser: (fichier: File) => void;
  onSupprimer: (doc: DocumentUpload) => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`rounded-xl border p-3.5 ${
        document ? "border-[var(--sane-green)] bg-[var(--sane-green-light)]" : "border-[var(--sane-border)] bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            document ? "bg-[var(--sane-green)] text-white" : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
          }`}
        >
          <SpinnerOu actif={occupe} size={16}>{document ? <Check size={16} /> : <FileText size={16} />}</SpinnerOu>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[length:var(--fs-small)] font-bold text-[var(--sane-text)]">
            {attendu.label}
            {!attendu.obligatoire && (
              <span className="ml-1.5 font-normal text-[var(--sane-text-light)]">(optionnelle)</span>
            )}
          </p>

          {document ? (
            <p className="sane-small mt-0.5 truncate text-[11px]" title={document.nom_original}>
              {document.nom_original}
            </p>
          ) : (
            <p className="sane-small mt-0.5 text-[11px]">
              {attendu.formats} · max {attendu.taille_max_mo} Mo
            </p>
          )}

          <p className={`mt-1.5 items-start gap-1 text-[11px] text-[var(--sane-red-dark)] ${erreur ? "flex" : "hidden"}`}>
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            {erreur}
          </p>
        </div>

        <input
          ref={input}
          type="file"
          className="hidden"
          accept={attendu.formats
            .split(", ")
            .map((f) => `.${f.toLowerCase()}`)
            .join(",")}
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) onTeleverser(fichier);
            // Clear it so picking the same file again still fires onChange.
            e.target.value = "";
          }}
        />

        {document ? (
          <button
            type="button"
            disabled={occupe}
            onClick={() => onSupprimer(document)}
            title="Supprimer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--sane-red-dark)] transition-colors hover:bg-white disabled:opacity-50"
          >
            <Trash2 size={15} />
          </button>
        ) : (
          <button
            type="button"
            disabled={occupe}
            onClick={() => input.current?.click()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--sane-green)] px-3 py-1.5 text-[11px] font-bold text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green-light)] disabled:opacity-50"
          >
            <Upload size={12} />
            Choisir
          </button>
        )}
      </div>
    </div>
  );
}
