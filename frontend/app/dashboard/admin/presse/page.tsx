"use client";

import { AdminPage } from "@/components/dashboard/AdminPage";
import { ListeRessource } from "@/components/dashboard/ListeRessource";
import { definition } from "./definition";

export default function Page() {
  return (
    <AdminPage
      section={definition.section}
      titre={definition.titre}
      description={definition.description}
    >
      <ListeRessource def={definition} />
    </AdminPage>
  );
}
