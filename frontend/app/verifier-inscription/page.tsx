"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleCheck, CircleX, Loader2, TriangleAlert } from "lucide-react";
import { RenvoiVerification } from "@/components/auth/RenvoiVerification";
import { DocumentsUpload } from "@/components/inscription/DocumentsUpload";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import type { InscriptionConfirmee } from "@/lib/types";

type Etat =
  | { phase: "chargement" }
  | { phase: "confirme"; res: InscriptionConfirmee }
  | { phase: "echec"; message: string; renvoyable: boolean };

/**
 * Où atterrit le lien de confirmation d'une inscription au salon.
 *
 * C'est ici que l'inscription devient définitive et que les places de
 * formation sont enfin décomptées : jusqu'à ce clic, rien n'était retiré du
 * quota, pour qu'une adresse inventée ne prive personne de sa place.
 */
function Contenu() {
  const params = useSearchParams();
  const [etat, setEtat] = useState<Etat>({ phase: "chargement" });

  // React monte deux fois en développement ; sans ce garde, la seconde
  // requête répond « déjà confirmé » et écrase la première.
  const lance = useRef(false);

  useEffect(() => {
    if (lance.current) return;

    lance.current = true;

    const jeton = params.get("jeton");

    if (!jeton) {
      setEtat({
        phase: "echec",
        message: "Ce lien est incomplet. Ouvrez-le directement depuis votre email.",
        renvoyable: true,
      });

      return;
    }

    api
      .post<InscriptionConfirmee>(`/inscriptions/verifier/${encodeURIComponent(jeton)}`)
      .then((res) => setEtat({ phase: "confirme", res }))
      .catch((err) => {
        const perime = err instanceof ApiError && (err.status === 404 || err.status === 410);

        setEtat({
          phase: "echec",
          message:
            err instanceof ApiError
              ? err.message
              : "Impossible de joindre le serveur. Vérifiez votre connexion.",
          renvoyable: perime,
        });
      });
  }, [params]);

  const inscription = etat.phase === "confirme" ? etat.res.data : null;
  const completes = etat.phase === "confirme" ? (etat.res.formations_completes ?? []) : [];

  return (
    <main className="bg-[var(--sane-background)] py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-[560px] rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
          {etat.phase === "chargement" && (
            <>
              <Loader2 size={30} className="mx-auto mb-4 animate-spin text-[var(--sane-green)]" />
              <p className="sane-body">Confirmation en cours…</p>
            </>
          )}

          {etat.phase === "confirme" && inscription && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sane-green-light)]">
                <CircleCheck size={28} className="text-[var(--sane-green)]" />
              </div>

              <h1 className="sane-h2 mb-2">Inscription confirmée</h1>
              <p className="sane-body mb-3">{etat.res.message}</p>

              <p className="sane-small mb-5">
                Votre référence :{" "}
                <strong className="text-[var(--sane-green)]">{inscription.reference}</strong>
              </p>

              {/*
                Une formation qui s'est remplie entre l'envoi du courrier et le
                clic. L'inscription au salon tient — seule la formation manque —
                et le dire franchement vaut mieux que de laisser découvrir
                l'absence sur place.
              */}
              {completes.length > 0 && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[var(--sane-orange)] bg-[#fff7ed] p-4 text-left">
                  <TriangleAlert
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--sane-orange-dark,#c2410c)]"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--sane-text)]">
                      {completes.length === 1 ? "Une formation était complète" : "Des formations étaient complètes"}
                    </p>
                    <p className="sane-small mt-0.5 text-[var(--sane-text-light)]">
                      {completes.join(", ")} — les places sont parties avant votre confirmation.
                      Votre venue au salon, elle, est bien enregistrée.
                    </p>
                  </div>
                </div>
              )}

              <Link href="/programme" className={`${primaryBtn} w-full justify-center`}>
                Voir le programme <ArrowRight size={16} />
              </Link>

              {/*
                Le dépôt des pièces revient ici, et pas sur le formulaire : il
                exige la référence et l'adresse comme preuve d'identité, et
                l'adresse vient seulement d'être prouvée.
              */}
              <DocumentsUpload reference={inscription.reference} email={inscription.email} />
            </>
          )}

          {etat.phase === "echec" && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sane-red-light,#fef2f2)]">
                <CircleX size={28} className="text-[var(--sane-red-dark)]" />
              </div>

              <h1 className="sane-h2 mb-2">Lien inutilisable</h1>
              <p className="sane-body mb-6">{etat.message}</p>

              {etat.renvoyable && (
                <div className="mb-5 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-4 text-left">
                  <p className="mb-3 text-[12px] text-[var(--sane-text-light)]">
                    Les liens de confirmation expirent après 48 heures. Indiquez l&apos;adresse de
                    votre inscription pour en recevoir un nouveau.
                  </p>
                  <RenvoiVerification cible="salon" />
                </div>
              )}

              <p className="sane-small">
                <Link href="/inscription" className={textLink}>
                  Retour au formulaire d&apos;inscription <ArrowRight size={11} />
                </Link>
              </p>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}

export default function VerifierInscriptionPage() {
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
