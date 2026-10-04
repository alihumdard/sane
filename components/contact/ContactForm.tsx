"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhoneField, SelectField, TextAreaField, TextField } from "@/components/ui/FormFields";
import { primaryBtn } from "@/components/ui/styles";
import { sujets } from "./data";

const empty = { nom: "", email: "", telephone: "", sujet: "", message: "" };

export function ContactForm() {
  const [data, setData] = useState(empty);
  const [sent, setSent] = useState(false);
  const set = (key: keyof typeof empty) => (value: string) => setData((d) => ({ ...d, [key]: value }));

  return (
    <div>
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
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setData(empty);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="nom" label="Nom complet" required autoComplete="name" placeholder="Votre nom" value={data.nom} onChange={set("nom")} />
            <TextField id="email" label="Email" required type="email" autoComplete="email" placeholder="exemple@nom.com" value={data.email} onChange={set("email")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PhoneField value={data.telephone} onChange={set("telephone")} />
            <SelectField id="sujet" label="Sujet" required placeholder="Sélectionnez un sujet" list={sujets} value={data.sujet} onChange={set("sujet")} />
          </div>
          <TextAreaField id="message" label="Votre message" required placeholder="Écrivez votre message ici..." value={data.message} onChange={set("message")} />

          <button type="submit" className={`${primaryBtn} w-full`}>
            Envoyer le message <ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
