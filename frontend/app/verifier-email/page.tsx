"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleCheck, CircleX, Loader2 } from "lucide-react";
import { RenvoiVerification } from "@/components/auth/RenvoiVerification";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";

type Etat =
  | { phase: "chargement" }
  | { phase: "confirme"; message: string }
  | { phase: "echec"; message: string; renvoyable: boolean };

/**
 * Où atterrit le lien de confirmation reçu par email.
 *
 * L'URL signée que le backend a produite voyage ici en paramètre `url`, et
 * cette page la rejoue. C'est un détour, mais il évite que quelqu'un qui
 * clique un lien dans son courrier tombe sur une réponse JSON nue : il arrive
 * sur le site, avec son en-tête, son pied de page et une phrase en français.
 */
function Contenu() {
  const params = useSearchParams();
  const [etat, setEtat] = useState<Etat>({ phase: "chargement" });

  // React monte deux fois en développement ; sans ce garde la confirmation
  // part en double et la seconde réponse écrase la première par un
  // « déjà confirmé » déroutant.
  const lance = useRef(false);

  useEffect(() => {
    if (lance.current) return;

    lance.current = true;

    const cible = params.get("cible");

    // La cible est le chemin d'API signé, tel que le backend l'a construit.
    // On ne le réécrit pas : la signature couvre les paramètres dans l'ordre
    // exact où ils ont été produits.
    if (!cible || !cible.startsWith("/auth/verifier-email/")) {
      setEtat({
        phase: "echec",
        message: "Ce lien est incomplet. Ouvrez-le directement depuis votre email.",
        renvoyable: true,
      });

      return;
    }

    api
      .get<{ message: string }>(cible)
      .then((res) => setEtat({ phase: "confirme", message: res.message }))
      .catch((err) => {
        const expire = err instanceof ApiError && (err.status === 403 || err.status === 404);

        setEtat({
          phase: "echec",
          message:
            err instanceof ApiError
              ? err.message
              : "Impossible de joindre le serveur. Vérifiez votre connexion.",
          renvoyable: expire,
        });
      });
  }, [params]);

  return (
    <main className="bg-[var(--sane-background)] py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-[520px] rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
          {etat.phase === "chargement" && (
            <>
              <Loader2 size={30} className="mx-auto mb-4 animate-spin text-[var(--sane-green)]" />
              <p className="sane-body">Confirmation en cours…</p>
            </>
          )}

          {etat.phase === "confirme" && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sane-green-light)]">
                <CircleCheck size={28} className="text-[var(--sane-green)]" />
              </div>

              <h1 className="sane-h2 mb-2">Adresse confirmée</h1>
              <p className="sane-body mb-6">{etat.message}</p>

              <Link href="/connexion" className={`${primaryBtn} w-full justify-center`}>
                Me connecter <ArrowRight size={16} />
              </Link>
            </>
          )}

          {etat.phase === "echec" && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sane-red-light)]">
                <CircleX size={28} className="text-[var(--sane-red-dark)]" />
              </div>

              <h1 className="sane-h2 mb-2">Lien inutilisable</h1>
              <p className="sane-body mb-6">{etat.message}</p>

              {etat.renvoyable && (
                <div className="mb-5 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-4 text-left">
                  <p className="mb-3 text-[12px] text-[var(--sane-text-light)]">
                    Les liens de confirmation expirent après 48 heures. Indiquez votre adresse pour
                    en recevoir un nouveau.
                  </p>
                  <RenvoiVerification />
                </div>
              )}

              <p className="sane-small">
                <Link href="/connexion" className={textLink}>
                  Retour à la connexion <ArrowRight size={11} />
                </Link>
              </p>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}

export default function VerifierEmailPage() {
  return (
    <>
      <Header />
      {/* useSearchParams sort la route du prérendu statique sans cette limite. */}
      <Suspense
        fallback={
          <div className="flex min-h-[420px] items-center justify-center">
            <Loader2 size={22} className="animate-spin text-[var(--sane-green)]" />
          </div>
        }
      >
        <Contenu />
      </Suspense>
      <Footer />
    </>
  );
}
