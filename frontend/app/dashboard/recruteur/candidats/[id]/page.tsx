"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Briefcase, GraduationCap, Lock,
  Loader2, Mail, MapPin, Phone, UserRound,
} from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { api, ApiError } from "@/lib/api";
import type { ApiProfilDemandeur } from "@/lib/types";

function Contenu() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [profil, setProfil] = useState<ApiProfilDemandeur | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const res = await api.get<{ data: ApiProfilDemandeur }>(`/entreprise/candidats/${id}`);
      setProfil(res.data);
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de charger ce profil.");
    } finally {
      setChargement(false);
    }
  }, [id]);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  if (chargement) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
      </p>
    );
  }

  if (erreur || !profil) {
    return <Alerte texte={erreur ?? "Profil introuvable."} />;
  }

  // Present exactly when the resource decided to include them: once this
  // candidate has applied to one of the company's offers.
  const contactVisible = Boolean(profil.email || profil.telephone);

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]"
      >
        <ArrowLeft size={14} /> Retour aux profils
      </button>

      <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green-tint)] text-[var(--sane-green)]">
              <UserRound size={26} />
            </span>
            <div>
              <h1 className="text-[18px] font-bold text-[var(--sane-text)]">{profil.nom ?? "Candidat"}</h1>
              <p className="text-[13px] text-[var(--sane-text-light)]">{profil.titre_pro ?? "—"}</p>
              {profil.ville && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
                  <MapPin size={12} /> {profil.ville}
                </p>
              )}
            </div>
          </div>
        </div>

        {/*
          Contact unlocks only once this candidate has applied to one of the
          company's own offers — the search above is a directory of interest,
          never of phone numbers. Shown either way so a recruiter understands
          why it's missing rather than assuming the page is broken.
        */}
        <div className="mb-5 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-4">
          {contactVisible ? (
            <div className="flex flex-wrap gap-4">
              {profil.email && (
                <a href={`mailto:${profil.email}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)]">
                  <Mail size={14} /> {profil.email}
                </a>
              )}
              {profil.telephone && (
                <a href={`tel:${profil.telephone}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)]">
                  <Phone size={14} /> {profil.telephone}
                </a>
              )}
            </div>
          ) : (
            <p className="flex items-center gap-2 text-[12px] text-[var(--sane-text-light)]">
              <Lock size={13} />
              Les coordonnées seront visibles dès que ce candidat postulera à l&apos;une de vos offres.
            </p>
          )}
        </div>

        {profil.resume && (
          <section className="mb-5">
            <h2 className="mb-2 text-[13px] font-bold text-[var(--sane-text)]">Présentation</h2>
            <p className="whitespace-pre-wrap text-[13px] text-[var(--sane-text-light)]">{profil.resume}</p>
          </section>
        )}

        {profil.competences && profil.competences.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 text-[13px] font-bold text-[var(--sane-text)]">Compétences</h2>
            <ul className="flex flex-wrap gap-2">
              {profil.competences.map((c) => (
                <li key={c.id} className="rounded-full bg-[var(--sane-background)] px-3 py-1.5 text-[12px] text-[var(--sane-text)]">
                  {c.nom}
                  {c.niveau && <span className="ml-1 text-[var(--sane-text-light)]">· {c.niveau}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profil.experiences && profil.experiences.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-[var(--sane-text)]">
              <Briefcase size={14} /> Expérience
            </h2>
            <ul className="flex flex-col gap-2">
              {profil.experiences.map((x) => (
                <li key={x.id} className="rounded-xl bg-[var(--sane-background)] p-3">
                  <p className="text-[13px] font-semibold text-[var(--sane-text)]">{x.poste}</p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {x.entreprise}
                    {x.lieu && ` · ${x.lieu}`} ·{" "}
                    {new Date(x.date_debut).getFullYear()} –{" "}
                    {x.en_poste ? "aujourd'hui" : x.date_fin ? new Date(x.date_fin).getFullYear() : "—"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {profil.formations && profil.formations.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-[var(--sane-text)]">
              <GraduationCap size={14} /> Formation
            </h2>
            <ul className="flex flex-col gap-2">
              {profil.formations.map((f) => (
                <li key={f.id} className="rounded-xl bg-[var(--sane-background)] p-3">
                  <p className="text-[13px] font-semibold text-[var(--sane-text)]">{f.diplome}</p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {f.etablissement}
                    {f.domaine && ` · ${f.domaine}`}
                    {f.annee_debut && ` · ${f.annee_debut} – ${f.en_cours ? "en cours" : (f.annee_fin ?? "—")}`}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

export default function CandidatDetailPage() {
  return (
    <RecruteurLayout titre="Profil du candidat" description="Consultez le profil complet">
      <Contenu />
    </RecruteurLayout>
  );
}
