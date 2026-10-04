"use client";

import { useState } from "react";
import { ConnexionHero } from "./ConnexionHero";
import { SpacesSection } from "./SpacesSection";

/** Holds the selected role, shared by the login card and the "Espaces" cards. */
export function ConnexionContent() {
  const [role, setRole] = useState("participant");

  return (
    <>
      <ConnexionHero activeRole={role} onRoleChange={setRole} />
      <SpacesSection onSelectRole={setRole} />
    </>
  );
}
