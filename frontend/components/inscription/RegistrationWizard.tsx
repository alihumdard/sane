"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { primaryBtn, secondaryBtn } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import type { ApiInscription, InscriptionPayload, InscriptionResponse, TypeParticipation } from "@/lib/types";
import { StepProgress } from "./StepProgress";
import { ParticipationStep } from "./ParticipationStep";
import { FormationsStep } from "./FormationsStep";
import { ConfirmStep, InterestsStep, PersonalStep, ProfileStep } from "./steps";
import { emptyRegistration, steps, STEP_FORMATIONS } from "./data";

/** 6-step registration form (state lives here; each step is its own component). */
export function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(emptyRegistration);
  const [formations, setFormations] = useState<number[]>([]);
  const [formationTitres, setFormationTitres] = useState<Record<number, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState(true);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inscription, setInscription] = useState<ApiInscription | null>(null);

  const choisitFormations = data.type_participation === "participant_formation";

  /** Steps actually shown, in order — the formations step applies to one type only. */
  const parcours = useMemo(
    () => steps.filter((s) => s.num !== STEP_FORMATIONS || choisitFormations).map((s) => s.num),
    [choisitFormations]
  );

  const position = parcours.indexOf(step);
  const dernier = position === parcours.length - 1;
  const current = steps[step - 1];

  const set = (key: string) => (value: string) => setData((d) => ({ ...d, [key]: value }));

  const toggleInterest = (i: string) =>
    setInterests((list) => (list.includes(i) ? list.filter((x) => x !== i) : [...list, i]));

  const toggleFormation = (id: number, titre: string) => {
    setFormations((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
    setFormationTitres((map) => ({ ...map, [id]: titre }));
  };

  const scrollToForm = () => document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  function goTo(n: number) {
    setStep(n);
    setError(null);
    scrollToForm();
  }

  function choisirType(type: string) {
    set("type_participation")(type);
    // Dropping out of the formations path must not leave stale selections behind.
    if (type !== "participant_formation") {
      setFormations([]);
      setFormationTitres({});
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!dernier) return goTo(parcours[position + 1]);

    setSubmitting(true);
    setError(null);

    const payload: InscriptionPayload = {
      type_participation: data.type_participation as TypeParticipation,
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
      ...(formations.length > 0 && { formations }),
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
    setFormations([]);
    setFormationTitres({});
    setInterests([]);
    setNewsletter(true);
    setConsent(false);
    setInscription(null);
    setError(null);
    setStep(1);
  }

  return (
    <div className="flex min-w-0 flex-col">
      <StepProgress step={step} done={inscription !== null} parcours={parcours} />

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
              Étape {position + 1} sur {parcours.length}
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
              {step === 1 && <ParticipationStep value={data.type_participation} onChange={choisirType} />}
              {step === 2 && <PersonalStep data={data} set={set} />}
              {step === 3 && <ProfileStep data={data} set={set} />}
              {step === 4 && <FormationsStep selected={formations} onToggle={toggleFormation} />}
              {step === 5 && (
                <InterestsStep
                  data={data}
                  set={set}
                  interests={interests}
                  onToggle={toggleInterest}
                  newsletter={newsletter}
                  onNewsletter={setNewsletter}
                />
              )}
              {step === 6 && (
                <ConfirmStep
                  data={data}
                  interests={interests}
                  formationTitres={formations.map((id) => formationTitres[id]).filter(Boolean)}
                  consent={consent}
                  onConsent={setConsent}
                />
              )}

              <div className="mt-auto flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                {position > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(parcours[position - 1])}
                    disabled={submitting}
                    className={secondaryBtn}
                  >
                    <ArrowLeft size={16} /> Précédent
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  disabled={submitting || (step === 1 && !data.type_participation)}
                  className={`${primaryBtn} sm:min-w-[200px] disabled:opacity-60`}
                >
                  {submitting ? (
                    <>
                      Envoi en cours… <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      {dernier ? "Valider mon inscription" : "Étape suivante"} <ArrowRight size={16} />
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
