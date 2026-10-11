"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { ApiDocument, DocumentRequis, DocumentUploadResponse } from "@/lib/types";

interface DocumentUploadProps {
  /** Printable reference, e.g. "#INS2026-0001". */
  reference: string;
  /** Email given at registration — the server checks it before accepting anything. */
  email: string;
  requis: DocumentRequis;
  document?: ApiDocument;
  onUploaded: (document: ApiDocument) => void;
}

/** "pdf,jpg,jpeg" → ".pdf,.jpg,.jpeg" for the file picker's accept attribute. */
function accept(formats: string): string {
  return formats
    .split(",")
    .map((f) => `.${f.trim()}`)
    .join(",");
}

/**
 * One row per expected document: pick a file, send it, see what was received.
 *
 * The size and extension rules are mirrored from the API so an obviously wrong
 * file is rejected before it is uploaded over a slow connection — the server
 * still re-checks everything, including the file's real bytes.
 */
export function DocumentUpload({ reference, email, requis, document, onUploaded }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const extensions = requis.formats.split(",").map((f) => f.trim().toLowerCase());

  async function choisir(fichier: File | undefined) {
    if (!fichier) return;

    setErreur(null);

    const extension = fichier.name.split(".").pop()?.toLowerCase() ?? "";

    if (!extensions.includes(extension)) {
      setErreur(`Format accepté : ${requis.formats.toUpperCase().replace(/,/g, ", ")}.`);
      return;
    }

    if (fichier.size > requis.taille_max_ko * 1024) {
      setErreur(`Le fichier ne doit pas dépasser ${Math.round(requis.taille_max_ko / 1024)} Mo.`);
      return;
    }

    const corps = new FormData();
    corps.append("email", email);
    corps.append("type", requis.value);
    corps.append("fichier", fichier);

    setEnvoi(true);

    try {
      const res = await api.post<DocumentUploadResponse>(
        `/inscriptions/${encodeURIComponent(reference)}/documents`,
        corps
      );
      onUploaded(res.data);
    } catch (e) {
      setErreur(
        e instanceof ApiError
          ? e.fieldError("fichier") ?? e.fieldError("email") ?? e.message
          : "Impossible d'envoyer le document. Vérifiez votre connexion et réessayez."
      );
    } finally {
      setEnvoi(false);
      // Lets the same file be re-picked after a failure.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const champId = `document-${requis.value}`;

  return (
    <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="sane-small font-semibold text-[var(--sane-text)]">
            {requis.label}
            {requis.obligatoire ? (
              <span className="ml-1 text-[var(--sane-red-dark)]">*</span>
            ) : (
              <span className="ml-1 font-normal opacity-70">(facultatif)</span>
            )}
          </p>
          <p className="sane-small opacity-70">
            {requis.formats.toUpperCase().replace(/,/g, ", ")} · max{" "}
            {Math.round(requis.taille_max_ko / 1024)} Mo
          </p>
        </div>

        <label
          htmlFor={champId}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-[length:var(--fs-small)] font-semibold transition-colors ${
            envoi
              ? "pointer-events-none border-[var(--sane-border)] opacity-60"
              : "border-[var(--sane-border)] hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
          }`}
        >
          {envoi ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Envoi…
            </>
          ) : (
            <>
              <Upload size={15} /> {document ? "Remplacer" : "Choisir un fichier"}
            </>
          )}
        </label>

        <input
          ref={inputRef}
          id={champId}
          type="file"
          className="sr-only"
          accept={accept(requis.formats)}
          disabled={envoi}
          onChange={(e) => choisir(e.target.files?.[0])}
        />
      </div>

      {document && !erreur && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--sane-background)] px-3 py-2">
          <CheckCircle2 size={15} className="shrink-0 text-[var(--sane-green)]" />
          <FileText size={15} className="shrink-0 opacity-60" />
          <span className="sane-small min-w-0 flex-1 truncate">{document.nom_original}</span>
          <span className="sane-small shrink-0 opacity-70">{document.taille_lisible}</span>
        </p>
      )}

      {erreur && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-[var(--sane-red-dark)]">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
        </p>
      )}
    </div>
  );
}
