"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Briefcase, Calendar, CheckCircle2, FileText,
  Heart, Loader2, Sparkles, UserRound,
} from "lucide-react";
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
} from "@/lib/types";

const STATUT_COULEUR: Record<string, string> = {
  envoyee: "bg-[var(--sane-background)] text-[var(--sane-text-light)]",
  en_revue: "bg-[#eef4ff] text-[#0066b2]",
  preselectionnee: "bg-[#fff8ed] text-[var(--sane-orange)]",
  entretien: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  acceptee: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  refusee: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
};

function Tuile({
  icone: Icone,
  valeur,
  label,
  href,
}: {
  icone: typeof Briefcase;
  valeur: number;
  label: string;
  href?: string;
}) {
  const contenu = (
    <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sane-green-light)] text-[var(--sane-green)]">
        <Icone size={19} />
      </span>
      <p className="text-[24px] font-bold leading-none text-[var(--sane-text)]">{valeur}</p>
      <p className="mt-1 text-[12px] text-[var(--sane-text-light)]">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{contenu}</Link> : contenu;
}

function Contenu() {
  const { user } = useAuth();

  const [profil, setProfil] = useState<ApiProfilDemandeur | null>(null);
  const [candidatures, setCandidatures] = useState<ApiCandidature[]>([]);
  const [entretiens, setEntretiens] = useState<ApiEntretien[]>([]);
  const [favoris, setFavoris] = useState<ApiOffre[]>([]);
  const [correspondances, setCorrespondances] = useState<ApiCorrespondance[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      // Fired together rather than in sequence: five independent reads
      // should cost one round trip of latency, not five.
      const [p, c, e, f, m] = await Promise.all([
        api.get<{ data: ApiProfilDemandeur }>("/profil"),
        api.get<CandidaturesResponse>("/mes-candidatures"),
        api.get<{ data: ApiEntretien[] }>("/mes-entretiens"),
        api.get<{ data: ApiOffre[] }>("/mes-favoris"),
        api.get<{ data: ApiCorrespondance[] }>("/mes-correspondances"),
      ]);

      setProfil(p.data);
      setCandidatures(c.data);
      setEntretiens(e.data);
      setFavoris(f.data);
      setCorrespondances(m.data);
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de charger votre espace.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

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
  const entretiensAVenir = entretiens.filter((e) => !e.est_final);

  return (
    <>
      <div className="mb-6">
        <h1 className="sane-h2 mb-1">Bonjour {user?.nom?.split(" ")[0]}</h1>
        <p className="sane-body">Voici où en sont vos candidatures et vos entretiens.</p>
      </div>

      {completion < 100 && (
        <section className="mb-6 rounded-2xl border border-[var(--sane-orange)] bg-[#fff8ed] p-5">
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
          <p className="mt-2 text-[12px] text-[var(--sane-text-light)]">
            Un profil complet et visible est proposé aux recruteurs et améliore vos correspondances.
          </p>
        </section>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tuile icone={FileText} valeur={candidatures.length} label="Candidatures" />
        <Tuile icone={Calendar} valeur={entretiensAVenir.length} label="Entretiens à venir" href="/dashboard/entretiens" />
        <Tuile icone={Heart} valeur={favoris.length} label="Offres favorites" />
        <Tuile icone={Sparkles} valeur={correspondances.length} label="Offres suggérées" href="/dashboard/entretiens" />
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
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--sane-border)] bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--sane-text)]">{c.offre?.titre}</p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {c.offre?.entreprise?.nom} · {c.reference}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${STATUT_COULEUR[c.statut]}`}>
                  {c.statut_label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {correspondances.length > 0 && (
        <section>
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
