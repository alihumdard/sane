"use client";

import { Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { ContenuCrud, type ChampFormulaire } from "@/components/dashboard/ContenuCrud";
import type { Colonne } from "@/components/dashboard/AdminTable";
import type { ApiFormateur } from "@/lib/types";

const colonnes: Colonne<ApiFormateur>[] = [
  {
    cle: "nom",
    entete: "Intervenant",
    rendu: (f) => (
      <>
        <p className="font-semibold">{f.nom}</p>
        <p className="text-[12px] text-[var(--sane-text-light)]">{f.fonction ?? "—"}</p>
      </>
    ),
  },
  {
    cle: "organisation",
    entete: "Organisation",
    masquer: "sm",
    rendu: (f) => f.organisation ?? "—",
  },
  {
    cle: "contact",
    entete: "Contact",
    masquer: "md",
    rendu: (f) => (
      <div className="flex flex-col gap-0.5 text-[12px]">
        {f.email && (
          <span className="inline-flex items-center gap-1.5">
            <Mail size={12} className="text-[var(--sane-text-light)]" /> {f.email}
          </span>
        )}
        {f.telephone && (
          <span className="inline-flex items-center gap-1.5">
            <Phone size={12} className="text-[var(--sane-text-light)]" /> {f.telephone}
          </span>
        )}
        {!f.email && !f.telephone && <span className="text-[var(--sane-text-light)]">—</span>}
      </div>
    ),
  },
  {
    cle: "formations",
    entete: "Formations",
    masquer: "lg",
    rendu: (f) => (
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          f.formations_count > 0
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
        }`}
      >
        {f.formations_count}
      </span>
    ),
  },
];

const champs: ChampFormulaire[] = [
  { nom: "nom", label: "Nom complet", requis: true },
  { nom: "fonction", label: "Fonction", },
  { nom: "organisation", label: "Organisation", pleineLargeur: true },
  { nom: "email", label: "Email" },
  { nom: "telephone", label: "Téléphone" },
  { nom: "photo", label: "Photo", type: "image", pleineLargeur: true },
  { nom: "bio", label: "Biographie", type: "textarea" },
];

export default function IntervenantsAdminPage() {
  return (
    <AdminPage
      section="Intervenants"
      titre="Intervenants"
      description="Formateurs et intervenants qui animent les sessions"
    >
      <Suspense fallback={null}>
        <ContenuCrud<ApiFormateur>
        endpoint="/admin/formateurs"
        typeImage="formateurs"
        colonnes={colonnes}
        champs={champs}
        cle={(f) => f.id}
        libelle="intervenant"
        vide="Aucun intervenant. Ajoutez-en un pour l'affecter à une formation."
        versFormulaire={(f) => ({
          nom: f.nom,
          fonction: f.fonction ?? "",
          organisation: f.organisation ?? "",
          email: f.email ?? "",
          telephone: f.telephone ?? "",
          photo: f.photo ?? "",
          bio: f.bio ?? "",
        })}
        />
      </Suspense>
    </AdminPage>
  );
}
