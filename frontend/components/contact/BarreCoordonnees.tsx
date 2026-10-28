"use client";

import { FeatureBar } from "@/components/shared";
import { barreCoordonnees } from "./data";
import { useCoordonnees } from "./useCoordonnees";

/** The strip under the hero, from the same details as the list below it. */
export function BarreCoordonnees() {
  return <FeatureBar items={barreCoordonnees(useCoordonnees())} />;
}
