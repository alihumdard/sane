"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react";
import { RenvoiVerification } from "@/components/auth/RenvoiVerification";
import { primaryBtn, secondaryBtn } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { usePiege } from "@/lib/piege";
import type { InscriptionEnAttente, InscriptionPayload, TypeParticipation } from "@/lib/types";
import { StepProgress } from "./StepProgress";
import { ParticipationStep } from "./ParticipationStep";
import { FormationsStep } from "./FormationsStep";
import { ConfirmStep, InterestsStep, PersonalStep, ProfileStep } from "./steps";
import { useReferentiels } from "./useReferentiels";
import { inscriptionDeDepart, steps, STEP_FORMATIONS } from "./data";

/** 6-step registration form (state lives here; each step is its own component). */
export function RegistrationWizard() {
  const listes = useReferentiels();
  const [step, setStep] = useState(1);
  const params = useSearchParams();
  // Posée à l'ouverture et non dans un effet : un effet écraserait, après coup
  // et à la vue de tous, la réponse d'un visiteur qui a déjà choisi.
  const [data, setData] = useState(() => inscriptionDeDepart(params));
  const [formations, setFormations] = useState<number[]>([]);
  const [formationTitres, setFormationTitres] = useState<Record<number, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState(true);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { champs, ChampPiege } = usePiege();

  /*
   * L'inscription attend sa confirmation ; il n'y a donc plus de récapitulatif
   * complet à montrer ici, seulement de quoi dire à qui le lien a été envoyé.
   *
   * Le dépôt des pièces justificatives a disparu de cet écran pour la même
   * raison : il demande la référence *et* l'adresse comme preuve d'identité,
   * et l'adresse n'a encore rien prouvé. Il revient sur la page de
   * confirmation, une fois le lien ouvert.
   */
  const [aConfirmer, setAConfirmer] = useState<
    { email: string; reference: string; prenom: string } | null
  >(null);

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
      const res = await api.post<InscriptionEnAttente>("/inscriptions", {
        ...payload,
        ...champs(),
      });

      setAConfirmer({ email: res.email, reference: res.reference, prenom: data.nom.split(" ")[0] });
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
    // L'adresse dit toujours que le visiteur vient du QR : une seconde inscription
    // depuis la même affiche en est encore une.
    setData(inscriptionDeDepart(params));
    setFormations([]);
    setFormationTitres({});
    setInterests([]);
    setNewsletter(true);
    setConsent(false);
    setAConfirmer(null);
    setError(null);
    setStep(1);
  }

  return (
    <div className="flex min-w-0 flex-col">
      <StepProgress step={step} done={aConfirmer !== null} parcours={parcours} />

      <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-md sm:p-8">
        {aConfirmer ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <MailCheck size={44} className="mx-auto mb-3 text-[var(--sane-green)]" />
            <h3 className="sane-h3 mb-1">Vérifiez votre boîte mail</h3>

            <p className="sane-body mx-auto mb-3 max-w-[440px]">
              Merci {aConfirmer.prenom} ! Nous venons d&apos;envoyer un lien de confirmation à{" "}
              <strong className="text-[var(--sane-text)]">{aConfirmer.email}</strong>. Votre
              inscription sera définitive dès que vous l&apos;aurez ouvert.
            </p>

            {/*
              Les places de formation ne sont décomptées qu'à la confirmation —
              c'est ce qui empêche une adresse inventée de retirer sa place à
              quelqu'un de réel. La personne doit le savoir avant de refermer
              sa boîte mail en se croyant inscrite.
            */}
            <p
              className={`sane-small mx-auto mb-4 max-w-[440px] rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-3 ${
                formations.length > 0 ? "block" : "hidden"
              }`}
            >
              Vos places de formation seront réservées à ce moment-là. Le lien est valable
              48&nbsp;heures.
            </p>

            <p className="sane-small mb-6">
              Votre référence : <strong className="text-[var(--sane-green)]">{aConfirmer.reference}</strong>
            </p>

            <RenvoiVerification email={aConfirmer.email} cible="salon" className="mb-6" />

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

            <form onSubmit={handleSubmit} className="relative flex flex-1 flex-col gap-5">
              <ChampPiege />
              {step === 1 && <ParticipationStep value={data.type_participation} onChange={choisirType} />}
              {step === 2 && <PersonalStep data={data} set={set} listes={listes} />}
              {step === 3 && <ProfileStep data={data} set={set} listes={listes} />}
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
