import { Calendar, Check, Mail, User } from "lucide-react";
import { PhoneField, SelectField, TextAreaField, TextField } from "@/components/ui/FormFields";
import { labelClass } from "@/components/ui/styles";
import { interestOptions, options, type RegistrationData } from "./data";

interface StepProps {
  data: RegistrationData;
  set: (key: string) => (value: string) => void;
}

/** Step 1 */
export function PersonalStep({ data, set }: StepProps) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="nom" label="Nom complet" icon={User} required autoComplete="name" placeholder="Votre nom complet" value={data.nom} onChange={set("nom")} />
        <TextField id="naissance" label="Date de naissance" icon={Calendar} required type="date" autoComplete="bday" value={data.naissance} onChange={set("naissance")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="email" label="Email" icon={Mail} required type="email" autoComplete="email" placeholder="exemple@domaine.com" value={data.email} onChange={set("email")} />
        <PhoneField required value={data.telephone} onChange={set("telephone")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField id="genre" label="Genre" required placeholder="Sélectionnez votre genre" list={options.genre} value={data.genre} onChange={set("genre")} />
        <SelectField id="nationalite" label="Nationalité" required placeholder="Sélectionnez votre nationalité" list={options.nationalite} value={data.nationalite} onChange={set("nationalite")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField id="ville" label="Ville de résidence" required placeholder="Sélectionnez votre ville" list={options.ville} value={data.ville} onChange={set("ville")} />
        <SelectField id="niveau" label="Niveau d'études" required placeholder="Sélectionnez votre niveau" list={options.niveau} value={data.niveau} onChange={set("niveau")} />
      </div>
    </>
  );
}

/** Step 2 */
export function ProfileStep({ data, set }: StepProps) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField id="statut" label="Situation actuelle" required placeholder="Sélectionnez votre situation" list={options.statut} value={data.statut} onChange={set("statut")} />
        <SelectField id="domaine" label="Domaine d'activité" required placeholder="Sélectionnez votre domaine" list={options.domaine} value={data.domaine} onChange={set("domaine")} />
      </div>
      <SelectField id="experience" label="Expérience professionnelle" required placeholder="Sélectionnez votre expérience" list={options.experience} value={data.experience} onChange={set("experience")} />
      <TextAreaField id="parcours" label="Parcours en quelques mots" rows={4} placeholder="Formation, expériences, projets..." value={data.parcours} onChange={set("parcours")} />
    </>
  );
}

/** Step 3 */
export function InterestsStep({
  data,
  set,
  interests,
  onToggle,
  newsletter,
  onNewsletter,
}: StepProps & {
  interests: string[];
  onToggle: (interest: string) => void;
  newsletter: boolean;
  onNewsletter: (v: boolean) => void;
}) {
  return (
    <>
      <fieldset>
        <legend className={labelClass}>Activités qui vous intéressent</legend>
        <div className="flex flex-wrap gap-2.5">
          {interestOptions.map((i) => {
            const on = interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(i)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[length:var(--fs-small)] font-semibold transition-colors ${
                  on
                    ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white"
                    : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)]"
                }`}
              >
                {on && <Check size={13} />}
                {i}
              </button>
            );
          })}
        </div>
      </fieldset>
      <SelectField id="source" label="Comment avez-vous connu le SANEM ?" placeholder="Sélectionnez une réponse" list={options.source} value={data.source} onChange={set("source")} />
      <label className="sane-small flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          name="newsletter"
          checked={newsletter}
          onChange={(e) => onNewsletter(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--sane-green)]"
        />
        Je souhaite recevoir les actualités et les rappels du SANEM par email.
      </label>
    </>
  );
}

/** Step 4 */
export function ConfirmStep({
  data,
  interests,
  consent,
  onConsent,
}: {
  data: RegistrationData;
  interests: string[];
  consent: boolean;
  onConsent: (v: boolean) => void;
}) {
  const rows: [string, string][] = [
    ["Nom", data.nom],
    ["Email", data.email],
    ["Téléphone", data.telephone && `+227 ${data.telephone}`],
    ["Ville", data.ville],
    ["Situation", data.statut],
    ["Domaine", data.domaine],
    ["Intérêts", interests.join(", ")],
  ];

  return (
    <>
      <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-5 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="sane-small text-[11px] uppercase tracking-wide">{k}</dt>
            <dd className="break-words text-[length:var(--fs-small)] font-semibold text-[var(--sane-text)]">{v || "—"}</dd>
          </div>
        ))}
      </dl>
      <label className="sane-small flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--sane-green)]"
        />
        J&apos;certifie que les informations fournies sont exactes et j&apos;accepte d&apos;être contacté(e) au sujet de mon inscription au SANEM.
      </label>
    </>
  );
}
