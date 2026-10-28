"use client";

import { use } from "react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { FormulaireRessource } from "@/components/dashboard/FormulaireRessource";
import { estNouveau } from "@/components/dashboard/ressource";
import { definition } from "../definition";

/** One record of this resource, at its own address. */
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const nouveau = estNouveau(id);

  return (
    <AdminPage
      section={definition.section}
      titre={nouveau ? definition.ajouter : "Modifier"}
      description={nouveau ? definition.description : undefined}
      retour={{ href: definition.base, label: "Retour à la liste" }}
    >
      <FormulaireRessource def={definition} id={id} />
    </AdminPage>
  );
}
