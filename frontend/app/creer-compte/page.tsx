"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Briefcase, Loader2, UserRound } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const champ =
  "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";
const etiquette = "mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]";

const TYPES = [
  {
    value: "demandeur" as const,
    titre: "Demandeur d'emploi",
    description: "Créer un profil, déposer un CV et postuler aux offres.",
    icone: UserRound,
    // Straight to the profile form, not the dashboard: a brand-new account
    // can reach an offer and send a candidature holding a name and nothing
    // else, which is no use to the recruiter who opens it.
    accueil: "/dashboard/profil",
  },
  {
    value: "recruteur" as const,
    titre: "Recruteur",
    description: "Publier des offres et recevoir des candidatures.",
    icone: Briefcase,
    accueil: "/dashboard/recruteur",
  },
];

/**
 * Account creation for the job portal.
 *
 * Distinct from /inscription, which registers attendance at the event: a
 * visitor may want a job without attending, and an attendee may never use the
 * job portal.
 */
function Contenu() {
  const router = useRouter();
  const { inscrire } = useAuth();
  const params = useSearchParams();

  const [role, setRole] = useState<"demandeur" | "recruteur">(
    params.get("role") === "recruteur" ? "recruteur" : "demandeur"
  );
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    password: "",
    password_confirmation: "",
  });

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [champsEnErreur, setChampsEnErreur] = useState<Record<string, string>>({});

  const set = (cle: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [cle]: v }));
    setChampsEnErreur((champs) => {
      if (!(cle in champs)) return champs;
      const reste = { ...champs };
      delete reste[cle];
      return reste;
    });
    setErreur(null);
  };

  async function creer(e: React.FormEvent) {
    e.preventDefault();

    setEnvoi(true);
    setErreur(null);
    setChampsEnErreur({});

    try {
      const user = await inscrire({
        ...form,
        telephone: form.telephone || undefined,
        role,
      });

      router.push(TYPES.find((t) => t.value === user.role)?.accueil ?? "/dashboard/participant");
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(err.message);
        setChampsEnErreur(
          Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]]))
        );
      } else {
        setErreur("Impossible de joindre le serveur. Vérifiez votre connexion.");
      }
      setEnvoi(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bg-[var(--sane-background)] py-10 sm:py-16">
        <Container>
          <div className="mx-auto max-w-[560px]">
            <h1 className="sane-h2 mb-1">Créer un compte</h1>
            <p className="sane-body mb-6">
              Accédez au portail emploi du SANEM. La création de compte est gratuite.
            </p>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TYPES.map(({ value, titre, description, icone: Icone }) => {
                const actif = role === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    aria-pressed={actif}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      actif
                        ? "border-[var(--sane-green)] bg-[var(--sane-green-light)]"
                        : "border-[var(--sane-border)] bg-white hover:border-[var(--sane-green)]/40"
                    }`}
                  >
                    <Icone
                      size={20}
                      className={`mb-2 ${actif ? "text-[var(--sane-green)]" : "text-[var(--sane-text-light)]"}`}
                    />
                    <p className="text-[14px] font-bold text-[var(--sane-text)]">{titre}</p>
                    <p className="mt-0.5 text-[12px] text-[var(--sane-text-light)]">{description}</p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={creer} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <Alerte texte={erreur} className="mb-4" />

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="nom" className={etiquette}>Nom complet *</label>
                  <input id="nom" required autoComplete="name" value={form.nom} onChange={(e) => set("nom")(e.target.value)} className={champ} />
                  {champsEnErreur.nom && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.nom}</p>}
                </div>

                <div>
                  <label htmlFor="email" className={etiquette}>Email *</label>
                  <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set("email")(e.target.value)} className={champ} />
                  {champsEnErreur.email && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.email}</p>}
                </div>

                <div>
                  <label htmlFor="telephone" className={etiquette}>Téléphone</label>
                  <input id="telephone" type="tel" autoComplete="tel" value={form.telephone} onChange={(e) => set("telephone")(e.target.value)} className={champ} />
                </div>

                <div>
                  <label htmlFor="password" className={etiquette}>Mot de passe *</label>
                  <input
                    id="password" type="password" required autoComplete="new-password" minLength={8}
                    value={form.password} onChange={(e) => set("password")(e.target.value)} className={champ}
                  />
                  <p className="mt-1 text-[12px] text-[var(--sane-text-light)]">
                    Au moins 8 caractères, avec des lettres et des chiffres.
                  </p>
                  {champsEnErreur.password && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.password}</p>}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className={etiquette}>Confirmer le mot de passe *</label>
                  <input
                    id="password_confirmation" type="password" required autoComplete="new-password"
                    value={form.password_confirmation} onChange={(e) => set("password_confirmation")(e.target.value)} className={champ}
                  />
                </div>

                <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
                  {envoi ? (
                    <>
                      Création… <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Créer mon compte <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <p className="sane-small mt-5 text-center">
                Vous avez déjà un compte ?{" "}
                <Link href="/connexion" className={textLink}>
                  Se connecter <ArrowRight size={11} />
                </Link>
              </p>
            </form>

            <p className="sane-small mt-4 text-center">
              Vous souhaitez participer à l&apos;événement ?{" "}
              <Link href="/inscription" className={textLink}>
                Inscrivez-vous au salon <ArrowRight size={11} />
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function CreerComptePage() {
  return (
    <Suspense>
      <Contenu />
    </Suspense>
  );
}
