"use client";

import { ShieldCheck } from "lucide-react";
import { useStatistiques } from "@/lib/statistiques";
import { features } from "./data";

/**
 * Left column of the connexion hero.
 *
 * The three figures read "+1000 Participants", "+100 Entreprises" and "+500
 * Opportunités" — written here, counted nowhere, and set in the brand orange
 * directly above the login form. They are the same counts the rest of the
 * site shows, and the strip stays away until they arrive rather than
 * flashing a number nobody measured.
 */
export function HeroInfo() {
  const stats = useStatistiques();

  const chiffres = stats
    ? [
        { valeur: stats.participation.inscriptions, label: "Participants inscrits" },
        { valeur: stats.emploi.entreprises, label: "Entreprises" },
        { valeur: stats.emploi.offres, label: "Offres d'emploi" },
      ]
    : [];

  return (
    <div className="flex flex-col justify-between gap-6 lg:gap-8">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="sane-eyebrow-bar" />
          <span className="sane-eyebrow on-dark">Salon National de l&apos;Emploi</span>
        </div>
        <h1 className="sane-h1 on-dark mb-4">
          Accès aux
          <br />
          espaces utilisateurs
        </h1>
        <p className="sane-body on-dark max-w-[480px]">
          Connectez-vous à votre espace pour gérer votre profil, accéder aux opportunités, suivre vos inscriptions et profiter
          de tous les services du SANEM.
        </p>
      </div>

      <dl
        className={
          "grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm " +
          (chiffres.length > 0 ? "grid" : "hidden")
        }
      >
        {chiffres.map(({ valeur, label }) => (
          <div key={label} className="px-3 py-4 text-center sm:px-4">
            <dt className="sr-only">{label}</dt>
            <dd className="text-[length:var(--fs-h3)] font-extrabold text-[var(--sane-orange)]">{valeur}</dd>
            <dd className="sane-small on-dark mt-0.5">{label}</dd>
          </div>
        ))}
      </dl>

      <ul className="grid gap-3 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--sane-orange)] text-white">
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[length:var(--fs-small)] font-bold text-white">{title}</p>
              <p className="sane-small on-dark mt-0.5">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="sane-small on-dark flex items-center gap-2">
        <ShieldCheck size={16} className="shrink-0 text-[var(--sane-orange)]" />
        Vos données sont protégées. Connexion sécurisée à votre espace SANEM.
      </p>
    </div>
  );
}
