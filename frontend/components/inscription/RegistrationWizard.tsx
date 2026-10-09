"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { primaryBtn, secondaryBtn } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import type { ApiInscription, InscriptionPayload, InscriptionResponse } from "@/lib/types";
import { StepProgress } from "./StepProgress";
import { ConfirmStep, InterestsStep, PersonalStep, ProfileStep } from "./steps";
import { emptyRegistration, steps } from "./data";

/** 4-step registration form (state lives here; each step is its own component). */
export function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(emptyRegistration);
  const [interests, setInterests] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState(true);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inscription, setInscription] = useState<ApiInscription | null>(null);

  const set = (key: string) => (value: string) => setData((d) => ({ ...d, [key]: value }));
  const toggleInterest = (i: string) => setInterests((list) => (list.includes(i) ? list.filter((x) => x !== i) : [...list, i]));
  const current = steps[step - 1];

  const scrollToForm = () => document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  function goTo(n: number) {
    setStep(n);
    setError(null);
    scrollToForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < steps.length) return goTo(step + 1);

    setSubmitting(true);
    setError(null);

    const payload: InscriptionPayload = {
      // Until the participation-type step exists, everyone registers as a visitor.
      type_participation: "visiteur",
      nom: data.nom,
      naissance: data.naissance || undefined,
      email: data.email,
      telephone: data.telephone,
      genre: data.genre || undefined,
      nationalite: data.nationalite || undefined,
      ville: data.ville || undefined,
      niveau: data.niveau || undefined,
      statut_pro: data.statut || undefined,
      domaine: data.domaine || undefined,
      experience: data.experience || undefined,
      parcours: data.parcours || undefined,
      interets: interests,
      source: data.source || undefined,
      newsletter,
      consentement: consent,
    };

    try {
      const res = await api.post<InscriptionResponse>("/inscriptions", payload);
      setInscription(res.data);
      scrollToForm();
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez."
      );
      scrollToForm();
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setData(emptyRegistration);
    setInterests([]);
    setNewsletter(true);
    setConsent(false);
    setInscription(null);
    setError(null);
    setStep(1);
  }

  return (
    <div className="flex min-w-0 flex-col">
      <StepProgress step={step} done={inscription !== null} />

      <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-md sm:p-8">
        {inscription ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 size={44} className="mx-auto mb-3 text-[var(--sane-green)]" />
            <h3 className="sane-h3 mb-1">Inscription enregistrée</h3>
            <p className="sane-body mx-auto mb-2 max-w-[420px]">
              Merci {inscription.nom.split(" ")[0]} ! Un email de confirmation avec votre badge vous sera envoyé après validation.
            </p>
            <p className="sane-small mb-6">
              Votre référence : <strong className="text-[var(--sane-green)]">{inscription.reference}</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/programme" className={primaryBtn}>
                Voir le programme <ArrowRight size={14} />
              </Link>
              <button type="button" onClick={restart} className={secondaryBtn}>
                Nouvelle inscription
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="sane-eyebrow mb-1">
              Étape {step} sur {steps.length}
            </p>
            <h3 className="sane-h3 mb-1">{current.title}</h3>
            <p className="sane-body mb-6">{current.desc}</p>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[var(--sane-red-dark)] bg-[var(--sane-red-light,#fef2f2)] p-4">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
                <p className="sane-small text-[var(--sane-red-dark)]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
              {step === 1 && <PersonalStep data={data} set={set} />}
              {step === 2 && <ProfileStep data={data} set={set} />}
              {step === 3 && (
                <InterestsStep
                  data={data}
                  set={set}
                  interests={interests}
                  onToggle={toggleInterest}
                  newsletter={newsletter}
                  onNewsletter={setNewsletter}
                />
              )}
              {step === 4 && <ConfirmStep data={data} interests={interests} consent={consent} onConsent={setConsent} />}

              <div className="mt-auto flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <button type="button" onClick={() => goTo(step - 1)} disabled={submitting} className={secondaryBtn}>
                    <ArrowLeft size={16} /> Précédent
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" disabled={submitting} className={`${primaryBtn} sm:min-w-[200px] disabled:opacity-60`}>
                  {submitting ? (
                    <>
                      Envoi en cours… <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      {step < steps.length ? "Étape suivante" : "Valider mon inscription"} <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
