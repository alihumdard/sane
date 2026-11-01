"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Keeps a jobseeker on the profile form until the required fields are filled.
 *
 * Signing up already lands on /dashboard/profil rather than the dashboard —
 * the client asked for the profile first — but nothing held the person there:
 * typing /dashboard/participant opened a space whose every panel was empty,
 * with a banner asking for the same fields the signup had just skipped past.
 * The required fields are the ones an application needs, so the list comes
 * from the server's `manque_pour_postuler` rather than being restated here.
 *
 * Only `demandeur`. A `participant` holds an account because they registered
 * for the salon, not because they want a job: asking them for a CV before
 * showing their own event space would lock them out of it.
 *
 * Returns true while the redirection is on its way, so the caller can show
 * that rather than a page about to disappear.
 *
 * @param manquants What the profile still lacks; undefined until it is read.
 */
export function useProfilRequis(manquants: string[] | null | undefined): boolean {
  const router = useRouter();
  const { user } = useAuth();

  const aRediriger = user?.role === "demandeur" && (manquants?.length ?? 0) > 0;

  // replace, not push: the page being left would otherwise sit in the history
  // and send the back button straight into this same redirection.
  useEffect(() => {
    if (aRediriger) router.replace("/dashboard/profil");
  }, [aRediriger, router]);

  return aRediriger;
}
