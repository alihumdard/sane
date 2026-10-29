"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { ChampImage } from "./ChampImage";
import { Spinner, SpinnerOu } from "./Spinner";
import { estNouveau, formulaireVierge, type ChampFormulaire, type DefinitionRessource } from "./ressource";
import { retourApresEnregistrement } from "./messageEnregistrement";
import { api, ApiError } from "@/lib/api";

const champClass =
  "w-full rounded-xl border border-[var(--sane-border)] bg-white px-3.5 py-3 text-[13px] text-[var(--sane-text)] outline-none transition-all placeholder:text-[var(--sane-text-light)]/60 hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8";

/**
 * Create or edit one editorial record, as its own page.
 *
 * `id` is the URL segment: "nouveau", or the record's number. An unreadable
 * segment is treated as a new record rather than fetched, so a mistyped URL
 * does not strand the admin on a spinner.
 */
export function FormulaireRessource<T>({ def, id }: { def: DefinitionRessource<T>; id: string }) {
  const router = useRouter();
  const nouveau = estNouveau(id);
  const numero = nouveau ? null : Number(id);

  const [form, setForm] = useState<Record<string, unknown>>(() => formulaireVierge(def.champs));
  const [chargement, setChargement] = useState(!nouveau);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  // Chosen on a record that does not exist yet; sent once it does.
  const [imageEnAttente, setImageEnAttente] = useState<File | null>(null);

  const charger = useCallback(async () => {
    if (numero === null) return;

    try {
      setChargement(true);
      setErreur(null);

      const res = await api.get<{ data: T }>(def.endpoint + "/" + numero);

      setForm({ ...def.versFormulaire(res.data), id: numero });
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Cet élément est introuvable.");
    } finally {
      setChargement(false);
    }
    // The definition is a module constant; only the record can change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero]);

  useEffect(() => {
    // Deferred to a microtask so the first state update lands outside the
    // effect's synchronous body, avoiding a cascading render.
    void Promise.resolve().then(charger);
  }, [charger]);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    setErreurs({});

    try {
      // The id is carried for the image field's benefit, not for the server,
      // which takes it from the URL.
      const payload = { ...form };
      delete payload.id;

      if (numero === null) {
        const cree = await api.post<{ data?: { id?: number } }>(def.endpoint, payload);
        const nouvelId = cree.data?.id;

        // The picker could not upload before the record existed, so it held
        // the file; now there is an id to attach it to.
        if (imageEnAttente && def.typeImage && nouvelId) {
          const corps = new FormData();
          corps.append("image", imageEnAttente);

          await api.upload("/admin/images/" + def.typeImage + "/" + nouvelId, corps);
          setImageEnAttente(null);
        }
      } else {
        await api.put(def.endpoint + "/" + numero, payload);
      }

      /*
       * Back to the list, which announces the save and shows the record among
       * the others. Staying here left the admin looking at the fields they
       * had just filled in, with nothing to say where the record had gone.
       */
      router.push(retourApresEnregistrement(def.base, numero === null ? "cree" : "modifie"));
    } catch (err) {
      if (err instanceof ApiError) {
        setErreurs(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
        setErreur(
          Object.keys(err.errors).length > 0
            ? "Corrigez les champs signalés ci-dessous."
            : err.message
        );
      } else {
        setErreur("Enregistrement impossible. Vérifiez votre connexion et réessayez.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  function rendre(c: ChampFormulaire) {
    const valeur = form[c.nom];

    if (c.type === "image") {
      return (
        <ChampImage
          type={def.typeImage ?? ""}
          id={typeof form.id === "number" ? form.id : null}
          valeur={String(valeur ?? "")}
          onChange={(chemin) => setForm((f) => ({ ...f, [c.nom]: chemin }))}
          onFichier={setImageEnAttente}
        />
      );
    }

    if (c.type === "textarea") {
      return (
        <textarea
          id={c.nom}
          rows={c.lignes ?? 5}
          required={c.requis}
          placeholder={c.placeholder}
          value={String(valeur ?? "")}
          onChange={(e) => setForm((f) => ({ ...f, [c.nom]: e.target.value }))}
          className={champClass}
        />
      );
    }

    if (c.type === "select") {
      return (
        <select
          id={c.nom}
          required={c.requis}
          value={String(valeur ?? "")}
          onChange={(e) => setForm((f) => ({ ...f, [c.nom]: e.target.value }))}
          className={champClass}
        >
          <option value="">—</option>
          {c.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }

    if (c.type === "checkbox") {
      return (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-3.5 transition-colors hover:border-[var(--sane-green-muted)]">
          <input
            id={c.nom}
            type="checkbox"
            checked={Boolean(valeur)}
            onChange={(e) => setForm((f) => ({ ...f, [c.nom]: e.target.checked }))}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--sane-green)]"
          />
          <span className="text-[12.5px] font-semibold text-[var(--sane-text)]">{c.label}</span>
        </label>
      );
    }

    return (
      <input
        id={c.nom}
        type={c.type ?? "text"}
        required={c.requis}
        placeholder={c.placeholder}
        value={String(valeur ?? "")}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [c.nom]: c.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value,
          }))
        }
        className={champClass}
      />
    );
  }

  return (
    <form onSubmit={enregistrer} className="max-w-[820px]">
      <Alerte texte={erreur} className="mb-4" />

      <p className={"items-center gap-2 py-10 " + (chargement ? "flex" : "hidden")}>
        <Spinner actif className="text-[var(--sane-green)]" size={18} />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
      </p>

      <div
        className={
          "sane-apparait rounded-2xl border border-[var(--sane-border)] bg-white p-5 shadow-[0_1px_2px_rgba(16,35,26,0.04),0_8px_24px_-16px_rgba(16,99,45,0.18)] sm:p-7 " +
          (chargement ? "hidden" : "block")
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {def.champs.map((c) => (
            <div
              key={c.nom}
              className={c.pleineLargeur || c.type === "textarea" || c.type === "image" ? "sm:col-span-2" : ""}
            >
              <p
                className={
                  "mb-2 mt-2 border-t border-[var(--sane-border)] pt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--sane-green)] " +
                  (c.groupe ? "block" : "hidden")
                }
              >
                {c.groupe}
              </p>

              <label
                htmlFor={c.nom}
                className={
                  "mb-2 block text-[12px] font-semibold text-[var(--sane-text)] " +
                  (c.type === "checkbox" ? "hidden" : "")
                }
              >
                {c.label}
                <span className={"text-[var(--sane-orange)] " + (c.requis ? "inline" : "hidden")}> *</span>
              </label>

              {rendre(c)}

              <p
                className={
                  "mt-1 text-[11.5px] text-[var(--sane-text-light)] " + (c.aide && !erreurs[c.nom] ? "block" : "hidden")
                }
              >
                {c.aide}
              </p>
              <p
                className={
                  "mt-1 text-[12px] font-medium text-[var(--sane-red-dark)] " + (erreurs[c.nom] ? "block" : "hidden")
                }
              >
                {erreurs[c.nom]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[var(--sane-border)] pt-6">
          <button
            type="submit"
            disabled={envoi}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--sane-orange)] px-6 py-3 text-[13px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(229,118,23,0.7)] transition-all hover:bg-[var(--sane-orange-dark)] hover:shadow-[0_8px_20px_-6px_rgba(229,118,23,0.8)] disabled:opacity-60 disabled:shadow-none"
          >
            <SpinnerOu actif={envoi}>
              <Save size={15} />
            </SpinnerOu>
            {nouveau ? "Créer" : "Enregistrer"}
          </button>

          {/* A way back that says so, for when nothing is to be saved. */}
          <Link
            href={def.base}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--sane-border)] px-5 py-3 text-[13px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]"
          >
            <ArrowLeft size={15} /> Retour à la liste
          </Link>
        </div>
      </div>
    </form>
  );
}
