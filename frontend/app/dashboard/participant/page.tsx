"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Briefcase, Calendar, CheckCircle2, ExternalLink, FileText,
  Heart, Loader2, MessageSquareText, Sparkles, Trash2, UserRound,
} from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import Pagination from "@/components/dashboard/Pagination";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type {
  ApiCandidature,
  ApiCorrespondance,
  ApiEntretien,
  ApiOffre,
  ApiProfilDemandeur,
  CandidaturesResponse,
  PaginationMeta,
} from "@/lib/types";

const STATUT_COULEUR: Record<string, string> = {
  envoyee: "bg-[var(--sane-background)] text-[var(--sane-text-light)]",
  en_revue: "bg-[#eef4ff] text-[#0066b2]",
  preselectionnee: "bg-[#fff8ed] text-[var(--sane-orange)]",
  entretien: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  acceptee: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  refusee: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
};

function Contenu() {
  const { user } = useAuth();

  const [profil, setProfil] = useState<ApiProfilDemandeur | null>(null);
  const [candidatures, setCandidatures] = useState<ApiCandidature[]>([]);
  const [entretiens, setEntretiens] = useState<ApiEntretien[]>([]);
  const [favoris, setFavoris] = useState<ApiOffre[]>([]);
  const [correspondances, setCorrespondances] = useState<ApiCorrespondance[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [retrait, setRetrait] = useState<number | null>(null);
  const [lettreOuverte, setLettreOuverte] = useState<number | null>(null);
  const [pageCandidatures, setPageCandidatures] = useState(1);
  const [tailleCandidatures, setTailleCandidatures] = useState(10);
  const [metaCandidatures, setMetaCandidatures] = useState<PaginationMeta | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      // Fired together rather than in sequence: five independent reads
      // should cost one round trip of latency, not five.
      const [p, c, e, f, m] = await Promise.all([
        api.get<{ data: ApiProfilDemandeur }>("/profil"),
        api.get<CandidaturesResponse>(`/mes-candidatures?page=${pageCandidatures}&par_page=${tailleCandidatures}`),
        api.get<{ data: ApiEntretien[] }>("/mes-entretiens"),
        api.get<{ data: ApiOffre[] }>("/mes-favoris"),
        api.get<{ data: ApiCorrespondance[] }>("/mes-correspondances"),
      ]);

      setProfil(p.data);
      setCandidatures(c.data);
      setMetaCandidatures(c.meta);
      setEntretiens(e.data);
      setFavoris(f.data);
      setCorrespondances(m.data);
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de charger votre espace.");
    } finally {
      setChargement(false);
    }
  }, [pageCandidatures, tailleCandidatures]);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  /**
   * Withdrawing is refused by the server once a recruiter has acted on the
   * application, so the row only offers it while it is still untouched — and
   * reloads afterwards, because the offer's own counter moves with it.
   */
  async function retirer(c: ApiCandidature) {
    if (!confirm(`Retirer votre candidature ${c.reference} ?`)) return;

    try {
      setRetrait(c.id);
      await api.delete(`/mes-candidatures/${c.id}`);
      await charger();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de retirer cette candidature.");
    } finally {
      setRetrait(null);
    }
  }

  if (chargement) {
    return (
      <p className="flex items-center justify-center gap-2 py-16">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="sane-small">Chargement de votre espace…</span>
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

  const completion = profil?.taux_completion ?? 0;

  const manquePourPostuler = (profil?.manque_pour_postuler ?? []).map(
    (m) => ({ cv: "votre CV", formation: "au moins une formation" })[m] ?? m
  );
  const entretiensAVenir = entretiens.filter((e) => !e.est_final);

  return (
    <>
      <div className="mb-6 rounded-2xl bg-[var(--sane-green-deep)] p-6 text-white">
        <h1 className="text-[22px] font-extrabold leading-tight sm:text-[26px]">
          Bonjour {user?.nom?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-[13px] text-white/75">Voici où en sont vos candidatures et vos entretiens.</p>
      </div>

      {/*
        Hidden rather than unmounted: Google Translate holds references into
        this subtree, and removing a node under it kills the page.
      */}
      <section
        className={`mb-6 rounded-2xl border border-[var(--sane-orange)] bg-[#fff8ed] p-5 ${
          completion < 100 ? "block" : "hidden"
        }`}
      >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[14px] font-bold text-[var(--sane-text)]">
              Votre profil est complété à {completion}%
            </p>
            <Link href="/dashboard/profil" className="text-[13px] font-semibold text-[var(--sane-green)]">
              Compléter mon profil →
            </Link>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[var(--sane-orange)]" style={{ width: `${completion}%` }} />
          </div>
          {/*
            Naming the two the server actually refuses, rather than only a
            percentage: a candidate reading "complété à 40%" cannot tell which
            40% stops them applying.
          */}
          <p className="mt-2 text-[12px] text-[var(--sane-text-light)]">
            {manquePourPostuler.length > 0
              ? `Il vous manque ${manquePourPostuler.join(" et ")} pour pouvoir postuler.`
              : "Un profil complet et visible est proposé aux recruteurs et améliore vos correspondances."}
          </p>
        </section>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardStatCard icon={<FileText size={20} />} value={candidatures.length} label="Candidatures" accent="green" href="/emploi" />
        <DashboardStatCard icon={<Calendar size={20} />} value={entretiensAVenir.length} label="Entretiens à venir" accent="orange" href="/dashboard/entretiens" />
        <DashboardStatCard icon={<Heart size={20} />} value={favoris.length} label="Offres favorites" accent="blue" href="#favoris" />
        <DashboardStatCard icon={<Sparkles size={20} />} value={correspondances.length} label="Offres suggérées" accent="teal" href="#suggerees" />
      </div>

      {entretiensAVenir.length > 0 && (
        <section className="mb-6 rounded-2xl border border-[var(--sane-green)] bg-[var(--sane-green-light)] p-5">
          <h2 className="sane-h3 mb-3">Vos prochains entretiens</h2>
          <ul className="flex flex-col gap-2">
            {entretiensAVenir.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--sane-text)]">
                    {e.candidature?.offre?.titre}
                  </p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {e.creneau &&
                      new Date(e.creneau.debut).toLocaleString("fr-FR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
                <Link href="/dashboard/entretiens" className="text-[12px] font-semibold text-[var(--sane-green)]">
                  {e.statut === "en_attente" ? "Confirmer →" : "Voir →"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="sane-h3">Mes candidatures</h2>
          <Link href="/emploi" className="text-[13px] font-semibold text-[var(--sane-green)]">
            Voir les offres →
          </Link>
        </div>

        {candidatures.length === 0 ? (
          <div className="rounded-2xl border border-[var(--sane-border)] bg-white py-10 text-center">
            <Briefcase size={24} className="mx-auto mb-2 text-[var(--sane-text-light)]" />
            <p className="sane-small mb-3">Vous n&apos;avez pas encore postulé à une offre.</p>
            <Link
              href="/emploi"
              className="inline-block rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Parcourir les offres
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {candidatures.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-[var(--sane-border)] bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--sane-text)]">{c.offre?.titre}</p>
                    <p className="text-[12px] text-[var(--sane-text-light)]">
                      {c.offre?.entreprise?.nom} · {c.reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${STATUT_COULEUR[c.statut]}`}>
                      {c.statut_label}
                    </span>

                    {c.lettre_motivation && (
                      <button
                        type="button"
                        onClick={() => setLettreOuverte((id) => (id === c.id ? null : c.id))}
                        aria-label={`Voir ma lettre de motivation pour ${c.offre?.titre}`}
                        aria-expanded={lettreOuverte === c.id}
                        className={`inline-flex items-center rounded-lg border p-2 ${
                          lettreOuverte === c.id
                            ? "border-[var(--sane-green)] text-[var(--sane-green)]"
                            : "border-[var(--sane-border)] text-[var(--sane-text-light)] hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
                        }`}
                      >
                        <MessageSquareText size={14} />
                      </button>
                    )}

                    {c.offre?.slug && (
                      <Link
                        href={`/emploi/${c.offre.slug}`}
                        aria-label={`Voir l'offre ${c.offre.titre}`}
                        className="inline-flex items-center rounded-lg border border-[var(--sane-border)] p-2 text-[var(--sane-green)] hover:border-[var(--sane-green)]"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}

                    {/* Mirrors the server's rule: nothing to withdraw once decided. */}
                    {c.statut !== "acceptee" && c.statut !== "refusee" && (
                      <button
                        type="button"
                        onClick={() => retirer(c)}
                        disabled={retrait === c.id}
                        aria-label={`Retirer la candidature ${c.reference}`}
                        className="inline-flex items-center rounded-lg border border-[var(--sane-border)] p-2 text-[var(--sane-red-dark)] hover:border-[var(--sane-red-dark)] disabled:opacity-50"
                      >
                        <SpinnerOu actif={retrait === c.id} size={14}><Trash2 size={14} /></SpinnerOu>
                      </button>
                    )}
                  </div>
                </div>

                {/* Hidden rather than unmounted: toggling a subtree in and out
                    of the DOM is what breaks under a page-translation
                    extension, per the pattern used elsewhere in this app. */}
                <p className={`mt-3 whitespace-pre-wrap rounded-xl bg-[var(--sane-background)] p-3 text-[12px] text-[var(--sane-text)] ${lettreOuverte === c.id ? "block" : "hidden"}`}>
                  {c.lettre_motivation}
                </p>
              </li>
            ))}
          </ul>
        )}

        {metaCandidatures && metaCandidatures.last_page > 1 && (
          <div className="mt-2 rounded-2xl border border-[var(--sane-border)] bg-white">
            <Pagination
              current={metaCandidatures.page}
              totalPages={metaCandidatures.last_page}
              totalItems={metaCandidatures.total}
              pageSize={metaCandidatures.per_page}
              itemLabel="candidatures"
              onPageChange={setPageCandidatures}
              onPageSizeChange={(taille) => {
                setTailleCandidatures(taille);
                setPageCandidatures(1);
              }}
            />
          </div>
        )}
      </section>

      {favoris.length > 0 && (
        <section id="favoris" className="mb-8">
          <h2 className="sane-h3 mb-3">Mes offres favorites</h2>
          <ul className="flex flex-col gap-2">
            {favoris.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--sane-border)] bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--sane-text)]">{o.titre}</p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {o.entreprise?.nom}
                    {o.ville ? ` · ${o.ville}` : ""}
                  </p>
                </div>
                <Link
                  href={`/emploi/${o.slug}`}
                  className="text-[12px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]"
                >
                  Voir l&apos;offre →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {correspondances.length > 0 && (
        <section id="suggerees">
          <h2 className="sane-h3 mb-1">Offres qui vous correspondent</h2>
          <p className="sane-small mb-3">
            Classées selon votre secteur, vos compétences, votre ville et votre expérience.
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {correspondances.slice(0, 4).map((m) => (
              <li key={m.id} className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[var(--sane-text)]">{m.offre?.titre}</p>
                    <p className="text-[12px] text-[var(--sane-text-light)]">{m.offre?.entreprise?.nom}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--sane-green-light)] px-2.5 py-1 text-[12px] font-bold text-[var(--sane-green)]">
                    {m.score}%
                  </span>
                </div>
                {m.offre && (
                  <Link href={`/emploi/${m.offre.slug}`} className="text-[12px] font-semibold text-[var(--sane-green)]">
                    Voir l&apos;offre →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profil && !profil.visible && (
        <p className="mt-6 flex items-start gap-2 rounded-xl border border-[var(--sane-border)] bg-white p-4">
          <UserRound size={16} className="mt-0.5 shrink-0 text-[var(--sane-orange)]" />
          <span className="sane-small">
            Votre profil n&apos;est pas visible par les recruteurs.{" "}
            <Link href="/dashboard/profil" className="font-semibold text-[var(--sane-green)]">
              Le rendre visible
            </Link>{" "}
            vous permet d&apos;être contacté directement.
          </span>
        </p>
      )}

      {profil?.visible && completion === 100 && (
        <p className="mt-6 flex items-center gap-2 sane-small">
          <CheckCircle2 size={15} className="text-[var(--sane-green)]" />
          Votre profil est complet et visible par les recruteurs.
        </p>
      )}
    </>
  );
}

export default function ParticipantDashboardPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--sane-background)] py-10 sm:py-14">
        <Container>
          <RoleGuard roles={["demandeur", "participant"]} espace="votre espace candidat">
            <Contenu />
          </RoleGuard>
        </Container>
      </main>
      <Footer />
    </>
  );
}
