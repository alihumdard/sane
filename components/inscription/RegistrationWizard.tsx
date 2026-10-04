"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { primaryBtn, secondaryBtn } from "@/components/ui/styles";
import { StepProgress } from "./StepProgress";
import { ConfirmStep, InterestsStep, PersonalStep, ProfileStep } from "./steps";
import { emptyRegistration, steps } from "./data";

/** 4-step registration form (state lives here; each step is its own component). */
export function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(emptyRegistration);
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: string) => (value: string) => setData((d) => ({ ...d, [key]: value }));
  const toggleInterest = (i: string) => setInterests((list) => (list.includes(i) ? list.filter((x) => x !== i) : [...list, i]));
  const current = steps[step - 1];

  const scrollToForm = () => document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  function goTo(n: number) {
    setStep(n);
    scrollToForm();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < steps.length) return goTo(step + 1);
    setDone(true);
    scrollToForm();
  }

  function restart() {
    setData(emptyRegistration);
    setInterests([]);
    setConsent(false);
    setDone(false);
    setStep(1);
  }

  return (
    <div className="flex min-w-0 flex-col">
      <StepProgress step={step} done={done} />

      <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-md sm:p-8">
        {done ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 size={44} className="mx-auto mb-3 text-[var(--sane-green)]" />
            <h3 className="sane-h3 mb-1">Inscription enregistrée</h3>
            <p className="sane-body mx-auto mb-6 max-w-[420px]">
              Merci {data.nom.split(" ")[0] || ""} ! Un email de confirmation avec votre badge vous sera envoyé après validation.
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

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
              {step === 1 && <PersonalStep data={data} set={set} />}
              {step === 2 && <ProfileStep data={data} set={set} />}
              {step === 3 && <InterestsStep data={data} set={set} interests={interests} onToggle={toggleInterest} />}
              {step === 4 && <ConfirmStep data={data} interests={interests} consent={consent} onConsent={setConsent} />}

              <div className="mt-auto flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <button type="button" onClick={() => goTo(step - 1)} className={secondaryBtn}>
                    <ArrowLeft size={16} /> Précédent
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className={`${primaryBtn} sm:min-w-[200px]`}>
                  {step < steps.length ? "Étape suivante" : "Valider mon inscription"} <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
