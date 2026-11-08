"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { SpinnerOu } from "./Spinner";

/** La limite du serveur, en octets : au-dela, PHP refuse avant Laravel. */
const TAILLE_MAX = 2 * 1024 * 1024;

const TYPES_ACCEPTES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Où un fichier téléversé se lit, à partir du chemin que l'API a renvoyé.
 *
 * Un chemin relatif, et non une adresse construite sur NEXT_PUBLIC_API_URL :
 * cette variable nomme l'IP du serveur, derrière un certificat auto-signé, et
 * l'aperçu y était refusé par le navigateur alors que le fichier venait
 * d'être envoyé. nginx sert /storage/ sous les deux noms du site, donc un
 * chemin fonctionne d'où que vienne la page.
 */
function urlPublique(chemin: string): string {
  // Le contenu livré avec le site pointe vers ses propres fichiers ; seul ce
  // qu'un administrateur a téléversé vit sous /storage.
  if (chemin.startsWith("http") || chemin.startsWith("/")) return chemin;

  return `/storage/${chemin}`;
}

/**
 * The image on an editorial record, uploaded from the admin's own machine.
 *
 * The field used to ask for a file path, which only someone with access to
 * the server could supply: an administrator looking at it had no way to put a
 * speaker's portrait online, and asked us what to do about the photo.
 *
 * On an existing record the file is sent straight away. On a new one there is
 * nothing to attach it to yet, so the chosen file is held and `onFichier`
 * hands it to the form, which uploads it once the record has an id. Making the
 * admin save, reopen and only then choose a photo was a step too many.
 */
export function ChampImage({
  type,
  id,
  valeur,
  onChange,
  onFichier,
  readOnly,
}: {
  /** The collection this record belongs to: formateurs, formations, actualites, partenaires. */
  type: string;
  /** Null while the record is being created and has no id yet. */
  id: number | null;
  valeur: string;
  onChange: (chemin: string) => void;
  /** Called with the file held for a record that has no id yet. */
  onFichier?: (fichier: File | null) => void;
  readOnly?: boolean;
}) {
  const champ = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [enAttente, setEnAttente] = useState<string>("");

  async function televerser(fichier: File | undefined) {
    if (!fichier) return;

    /*
     * Mesure ici, avant d'envoyer.
     *
     * Au-dela de sa propre limite, PHP coupe la requete avant que Laravel ne
     * la voie : la reponse n'est pas du JSON, le message de validation
     * n'arrive jamais, et l'administrateur lisait « Erreur 413 » sans savoir
     * que sa photo etait simplement trop lourde. Meme limite que le serveur.
     */
    if (fichier.size > TAILLE_MAX) {
      setErreur(
        `Image trop lourde (${(fichier.size / 1024 / 1024).toFixed(1)} Mo). Maximum 2 Mo.`
      );
      if (champ.current) champ.current.value = "";

      return;
    }

    if (!TYPES_ACCEPTES.includes(fichier.type)) {
      setErreur("Format non accepté. Utilisez un fichier JPG, PNG ou WebP.");
      if (champ.current) champ.current.value = "";

      return;
    }

    // Nothing to attach it to yet: hold it for the form to send after the
    // record is created.
    if (id === null) {
      setErreur("");
      setEnAttente(fichier.name);
      onFichier?.(fichier);

      return;
    }

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
    if (id === null) {
      setEnAttente("");
      onFichier?.(null);

      return;
    }

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
            disabled={readOnly || envoi}
            onChange={(e) => televerser(e.target.files?.[0])}
            className="block w-full text-[12px] file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-[var(--sane-border)] file:bg-white file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-[var(--sane-green)] disabled:opacity-60"
          />

          <p className="mt-1 text-[11px] text-[var(--sane-text-light)]">
            {id === null && enAttente
              ? `${enAttente} — envoyée à l'enregistrement`
              : "JPG, PNG ou WebP · 2 Mo maximum"}
          </p>

          <p className={`mt-1 text-[11px] text-[var(--sane-red-dark)] ${erreur ? "block" : "hidden"}`}>
            {erreur}
          </p>
        </div>

        <button
          type="button"
          onClick={retirer}
          disabled={readOnly || envoi || (!valeur && !enAttente)}
          aria-label="Retirer l'image"
          className="inline-flex shrink-0 items-center rounded-lg border border-[var(--sane-border)] p-2 text-[var(--sane-red-dark)] disabled:opacity-40"
        >
          <SpinnerOu actif={envoi} size={14}><Trash2 size={14} /></SpinnerOu>
        </button>
      </div>
    </div>
  );
}
