"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhoneField, SelectField, TextAreaField, TextField } from "@/components/ui/FormFields";
import { Alerte } from "@/components/ui/Alerte";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { primaryBtn } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { sujets } from "./data";

const empty = { nom: "", email: "", telephone: "", sujet: "", message: "" };

/**
 * The contact form.
 *
 * It used to send nowhere: submitting set its own success state and cleared
 * the fields, so every message written here was answered with "Message
 * envoyé" and lost. The subject was marked required and backed by a readonly
 * input, which is barred from constraint validation, so the asterisk was
 * decorative too.
 *
 * Checked on the server, which is the only place that can refuse; the errors
 * come back per field and are shown beside the field, in French, rather than
 * as the browser's own English bubble.
 */
export function ContactForm() {
  const [data, setData] = useState(empty);
  const [sent, setSent] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [champs, setChamps] = useState<Record<string, string>>({});

  const set = (key: keyof typeof empty) => (value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setChamps((c) => {
      if (!(key in c)) return c;

      const reste = { ...c };
      delete reste[key];

      return reste;
    });
  };

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    setChamps({});

    try {
      await api.post("/contact", {
        ...data,
        telephone: data.telephone || undefined,
      });

      setSent(true);
      setData(empty);
    } catch (err) {
      if (err instanceof ApiError) {
        setChamps(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
        if (Object.keys(err.errors).length === 0) setErreur(err.message);
      } else {
        setErreur("Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-6 shadow-sm sm:p-8">
      <SectionHeading
        eyebrow="Nous contacter"
        title="Envoyez-nous un message"
        description="Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais."
        className="mb-8"
      />

      {sent ? (
        <div role="status" className="rounded-2xl border border-[var(--sane-border)] bg-white p-8 text-center">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-[var(--sane-green)]" />
          <h3 className="sane-h3 mb-1">Message envoyé</h3>
          <p className="sane-body mb-5">Merci ! Notre équipe vous répondra dans les plus brefs délais.</p>
          <button type="button" onClick={() => setSent(false)} className={primaryBtn}>
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={envoyer}
        >
          <Alerte texte={erreur} />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="nom" label="Nom complet" required autoComplete="name" placeholder="Votre nom" value={data.nom} onChange={set("nom")} erreur={champs.nom} />
            <TextField id="email" label="Email" required type="email" autoComplete="email" placeholder="exemple@nom.com" value={data.email} onChange={set("email")} erreur={champs.email} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PhoneField value={data.telephone} onChange={set("telephone")} />
            <SelectField id="sujet" label="Sujet" required placeholder="Sélectionnez un sujet" list={sujets} value={data.sujet} onChange={set("sujet")} erreur={champs.sujet} />
          </div>
          <TextAreaField id="message" label="Votre message" required placeholder="Écrivez votre message ici..." value={data.message} onChange={set("message")} erreur={champs.message} />

          <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
            <SpinnerOu actif={envoi} size={16}><ArrowRight size={16} /></SpinnerOu>
            {envoi ? "Envoi en cours…" : "Envoyer le message"}
          </button>
        </form>
      )}
    </div>
  );
}
