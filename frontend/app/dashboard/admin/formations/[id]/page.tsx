"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { ChampImage } from "@/components/dashboard/ChampImage";
import { Spinner, SpinnerOu } from "@/components/dashboard/Spinner";
import { retourApresEnregistrement } from "@/components/dashboard/messageEnregistrement";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError } from "@/lib/api";
import type { AdminFormationsResponse, ApiFormation, FormationPayload } from "@/lib/types";
import { FORMATS, NIVEAUX } from "../listes";

const BASE = "/dashboard/admin/formations";

const champClass =
  "w-full rounded-xl border border-[var(--sane-border)] bg-white px-3.5 py-3 text-[13px] text-[var(--sane-text)] outline-none transition-all placeholder:text-[var(--sane-text-light)]/60 hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8";

interface Formulaire {
  titre: string;
  categorie_id: string;
  formateur_id: string;
  duree: string;
  lieu: string;
  niveau: string;
  format: string;
  date_debut: string;
  date_fin: string;
  max_inscriptions: string;
  description: string;
  prerequis: string;
  image: string;
  publiee: boolean;
}

const VIERGE: Formulaire = {
  titre: "",
  categorie_id: "",
  formateur_id: "",
  duree: "",
  lieu: "Niamey",
  niveau: "Tous niveaux",
  format: "Présentiel",
  date_debut: "",
  date_fin: "",
  max_inscriptions: "30",
  description: "",
  prerequis: "",
  image: "",
  publiee: false,
};

function Champ({
  id,
  label,
  requis,
  aide,
  erreur,
  large,
  children,
}: {
  id: string;
  label: string;
  requis?: boolean;
  aide?: string;
  erreur?: string;
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={large ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-2 block text-[12px] font-semibold text-[var(--sane-text)]">
        {label}
        <span className={"text-[var(--sane-orange)] " + (requis ? "inline" : "hidden")}> *</span>
      </label>
      {children}
      <p className={"mt-1 text-[11.5px] text-[var(--sane-text-light)] " + (aide && !erreur ? "block" : "hidden")}>
        {aide}
      </p>
      <p className={"mt-1 text-[12px] font-medium text-[var(--sane-red-dark)] " + (erreur ? "block" : "hidden")}>
        {erreur}
      </p>
    </div>
  );
}

/**
 * One course, at its own address.
 *
 * The form used to be a dialog that built its own inputs by reflecting over
 * the table row, which is why the description and the prerequisites — both
 * accepted by the API from the start, both named in the contract — had no
 * field at all, and why the category had to be typed by name against an API
 * that takes an id.
 */
export default function FormationFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const nouveau = id === "nouveau" || !/^\d+$/.test(id);
  const numero = nouveau ? null : Number(id);

  const [form, setForm] = useState<Formulaire>(VIERGE);
  const [categories, setCategories] = useState<{ id: number; nom: string }[]>([]);
  const [formateurs, setFormateurs] = useState<{ id: number; libelle: string }[]>([]);
  const [editionId, setEditionId] = useState<number | null>(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [imageEnAttente, setImageEnAttente] = useState<File | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      // One call brings the dropdown contents and the edition a new course
      // belongs to; a second only for the record being edited.
      const [listes, enregistrement] = await Promise.all([
        api.get<AdminFormationsResponse & { edition_active?: { id: number } | null }>(
          "/admin/formations?per_page=1"
        ),
        numero === null ? Promise.resolve(null) : api.get<{ data: ApiFormation }>("/admin/formations/" + numero),
      ]);

      setCategories(listes.categories ?? []);
      setFormateurs(listes.formateurs ?? []);
      setEditionId(listes.edition_active?.id ?? null);

      if (enregistrement) {
        const f = enregistrement.data;

        setForm({
          titre: f.titre,
          categorie_id: f.categorie ? String(f.categorie.id) : "",
          formateur_id: f.formateur ? String(f.formateur.id) : "",
          duree: f.duree,
          lieu: f.lieu,
          niveau: f.niveau,
          format: f.format,
          date_debut: f.date_debut?.slice(0, 10) ?? "",
          date_fin: f.date_fin?.slice(0, 10) ?? "",
          max_inscriptions: String(f.max_inscriptions),
          description: f.description ?? "",
          prerequis: f.prerequis ?? "",
          image: f.image ?? "",
          publiee: f.publiee,
        });

        if (f.edition) setEditionId(f.edition.id);
      }
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Chargement impossible.");
    } finally {
      setChargement(false);
    }
  }, [numero]);

  useEffect(() => {
    // Deferred to a microtask so the first state update lands outside the
    // effect's synchronous body, avoiding a cascading render.
    void Promise.resolve().then(charger);
  }, [charger]);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();

    if (editionId === null) {
      setErreur(
        "Aucune édition active : ouvrez Événements, créez une édition et activez-la avant d'ajouter une formation."
      );

      return;
    }

    setEnvoi(true);
    setErreur(null);
    setErreurs({});

    const payload: FormationPayload = {
      edition_id: editionId,
      categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
      formateur_id: form.formateur_id ? Number(form.formateur_id) : null,
      titre: form.titre,
      duree: form.duree,
      lieu: form.lieu,
      niveau: form.niveau,
      format: form.format,
      description: form.description.trim() || null,
      prerequis: form.prerequis.trim() || null,
      date_debut: form.date_debut || null,
      date_fin: form.date_fin || null,
      max_inscriptions: Number(form.max_inscriptions) || 0,
      publiee: form.publiee,
    };

    try {
      if (numero === null) {
        const cree = await api.post<{ data?: { id?: number } }>("/admin/formations", payload);
        const nouvelId = cree.data?.id;

        if (imageEnAttente && nouvelId) {
          const corps = new FormData();
          corps.append("image", imageEnAttente);

          await api.upload("/admin/images/formations/" + nouvelId, corps);
          setImageEnAttente(null);
        }
      } else {
        await api.put("/admin/formations/" + numero, payload);
      }

      // Back to the catalogue, which announces the save and shows the course.
      router.push(retourApresEnregistrement(BASE, numero === null ? "cree" : "modifie"));
    } catch (err) {
      if (err instanceof ApiError) {
        setErreurs(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
        setErreur(
          Object.keys(err.errors).length > 0 ? "Corrigez les champs signalés ci-dessous." : err.message
        );
      } else {
        setErreur("Enregistrement impossible. Vérifiez votre connexion et réessayez.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  const lier = (cle: keyof Formulaire) => ({
    id: cle,
    value: String(form[cle] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [cle]: e.target.value })),
    className: champClass,
  });

  return (
    <AdminPage
      titre={nouveau ? "Ajouter une formation" : "Modifier la formation"}
      description={
        nouveau ? "Elle apparaîtra sur la page Formations dès qu'elle sera publiée." : undefined
      }
      retour={{ href: BASE, label: "Retour au catalogue" }}
    >
      <form onSubmit={enregistrer} className="max-w-[820px]">
        <Alerte texte={erreur} className="mb-4" />

        <p className={"items-center gap-2 py-10 " + (chargement ? "flex" : "hidden")}>
          <Spinner actif className="text-[var(--sane-green)]" size={18} />
          <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
        </p>

        <div
          className={
            "rounded-2xl border border-[var(--sane-border)] bg-white p-5 shadow-[0_1px_2px_rgba(16,35,26,0.04),0_8px_24px_-16px_rgba(16,99,45,0.18)] sm:p-7 " +
            (chargement ? "hidden" : "block")
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Champ id="titre" label="Titre" requis erreur={erreurs.titre} large>
              <input type="text" required {...lier("titre")} placeholder="ex. Initiation à la bureautique" />
            </Champ>

            <Champ
              id="categorie_id"
              label="Catégorie"
              erreur={erreurs.categorie_id}
              aide={categories.length === 0 ? "Aucune catégorie enregistrée pour le moment." : undefined}
            >
              <select {...lier("categorie_id")}>
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </Champ>

            <Champ
              id="formateur_id"
              label="Intervenant"
              erreur={erreurs.formateur_id}
              aide={
                formateurs.length === 0
                  ? "Aucun intervenant enregistré : ajoutez-en un dans la section Intervenants."
                  : undefined
              }
            >
              <select {...lier("formateur_id")}>
                <option value="">—</option>
                {formateurs.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.libelle}
                  </option>
                ))}
              </select>
            </Champ>

            <Champ id="duree" label="Durée" requis erreur={erreurs.duree}>
              <input type="text" required {...lier("duree")} placeholder="ex. 2 jours, 8 heures" />
            </Champ>

            <Champ id="lieu" label="Lieu" requis erreur={erreurs.lieu}>
              <input type="text" required {...lier("lieu")} placeholder="ex. Palais des Congrès, Niamey" />
            </Champ>

            <Champ id="niveau" label="Niveau" requis erreur={erreurs.niveau}>
              <select required {...lier("niveau")}>
                {NIVEAUX.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Champ>

            <Champ id="format" label="Format" requis erreur={erreurs.format}>
              <select required {...lier("format")}>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Champ>

            <Champ id="date_debut" label="Date de début" erreur={erreurs.date_debut}>
              <input type="date" {...lier("date_debut")} />
            </Champ>

            <Champ id="date_fin" label="Date de fin" erreur={erreurs.date_fin}>
              <input type="date" {...lier("date_fin")} />
            </Champ>

            <Champ
              id="max_inscriptions"
              label="Places"
              requis
              erreur={erreurs.max_inscriptions}
              aide="La formation s'affiche comme « complète » dès que ce nombre est atteint."
            >
              <input type="number" min={0} required {...lier("max_inscriptions")} />
            </Champ>

            <Champ id="description" label="Description" erreur={erreurs.description} large>
              <textarea rows={7} {...lier("description")} />
            </Champ>

            <Champ
              id="prerequis"
              label="Prérequis"
              erreur={erreurs.prerequis}
              aide="Ce qu'un participant doit déjà savoir ou apporter."
              large
            >
              <textarea rows={4} {...lier("prerequis")} />
            </Champ>

            <div className="sm:col-span-2">
              <ChampImage
                type="formations"
                id={numero}
                valeur={form.image}
                onChange={(chemin) => setForm((f) => ({ ...f, image: chemin }))}
                onFichier={setImageEnAttente}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-3.5 transition-colors hover:border-[var(--sane-green-muted)]">
                <input
                  type="checkbox"
                  checked={form.publiee}
                  onChange={(e) => setForm((f) => ({ ...f, publiee: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--sane-green)]"
                />
                <span className="text-[12.5px] font-semibold text-[var(--sane-text)]">
                  Publier cette formation sur le site public
                </span>
              </label>
            </div>
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

            <Link
              href={BASE}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--sane-border)] px-5 py-3 text-[13px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]"
            >
              <ArrowLeft size={15} /> Retour au catalogue
            </Link>
          </div>
        </div>
      </form>
    </AdminPage>
  );
}
