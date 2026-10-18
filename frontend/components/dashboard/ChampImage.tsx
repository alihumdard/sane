"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { SpinnerOu } from "./Spinner";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** Where an uploaded file is served from, given the path the API returned. */
function urlPublique(chemin: string): string {
  // Content seeded with the site points at files shipped with the frontend;
  // only what this field uploaded lives under the API's storage folder.
  if (chemin.startsWith("http") || chemin.startsWith("/")) return chemin;

  return `${API.replace(/\/api$/, "")}/storage/${chemin}`;
}

/**
 * The image on an editorial record, uploaded from the admin's own machine.
 *
 * The field used to ask for a file path, which only someone with access to
 * the server could supply: an administrator looking at it had no way to put a
 * speaker's portrait online, and asked us what to do about the photo.
 *
 * Uploads immediately rather than on save. The file has to reach the server
 * either way, and a record that does not exist yet has nothing to attach it
 * to — so on a new record the field waits until it has been saved once.
 */
export function ChampImage({
  type,
  id,
  valeur,
  onChange,
  readOnly,
}: {
  /** The collection this record belongs to: formateurs, formations, actualites, partenaires. */
  type: string;
  /** Null while the record is being created and has no id yet. */
  id: number | null;
  valeur: string;
  onChange: (chemin: string) => void;
  readOnly?: boolean;
}) {
  const champ = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function televerser(fichier: File | undefined) {
    if (!fichier || id === null) return;

    const corps = new FormData();
    corps.append("image", fichier);

    setEnvoi(true);
    setErreur("");

    try {
      const res = await api.upload<{ chemin: string }>(`/admin/images/${type}/${id}`, corps);
      onChange(res.chemin);
    } catch (e) {
      setErreur(
        e instanceof ApiError
          ? (e.fieldError("image") ?? e.message)
          : "L'envoi de l'image a échoué."
      );
    } finally {
      setEnvoi(false);
      // Clears the input so choosing the same file again still fires onChange.
      if (champ.current) champ.current.value = "";
    }
  }

  async function retirer() {
    if (id === null) return;

    setEnvoi(true);
    setErreur("");

    try {
      await api.delete(`/admin/images/${type}/${id}`);
      onChange("");
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "La suppression a échoué.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-green-deep)]">Image</span>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--sane-border)] bg-[var(--sane-background)]">
          {valeur ? (
            <Image src={urlPublique(valeur)} alt="" fill sizes="64px" className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full items-center justify-center text-[var(--sane-text-light)]">
              <ImageUp size={18} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={champ}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={readOnly || envoi || id === null}
            onChange={(e) => televerser(e.target.files?.[0])}
            className="block w-full text-[12px] file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-[var(--sane-border)] file:bg-white file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-[var(--sane-green)] disabled:opacity-60"
          />

          <p className="mt-1 text-[11px] text-[var(--sane-text-light)]">
            {id === null
              ? "Enregistrez d'abord, puis ajoutez l'image."
              : "JPG, PNG ou WebP · 2 Mo maximum"}
          </p>

          <p className={`mt-1 text-[11px] text-[var(--sane-red-dark)] ${erreur ? "block" : "hidden"}`}>
            {erreur}
          </p>
        </div>

        <button
          type="button"
          onClick={retirer}
          disabled={readOnly || envoi || !valeur || id === null}
          aria-label="Retirer l'image"
          className="inline-flex shrink-0 items-center rounded-lg border border-[var(--sane-border)] p-2 text-[var(--sane-red-dark)] disabled:opacity-40"
        >
          <SpinnerOu actif={envoi} size={14}><Trash2 size={14} /></SpinnerOu>
        </button>
      </div>
    </div>
  );
}
