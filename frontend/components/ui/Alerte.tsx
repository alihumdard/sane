import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * A message that is always in the tree and only changes visibility.
 *
 * `{erreur && <p>…</p>}` reads better but mounts and unmounts a node, which is
 * what breaks under Google Translate: Translate rewrites text in place and
 * keeps references into the subtree, so React's next insert or remove around
 * them kills the page with insertBefore/removeChild. Hiding with `display`
 * instead leaves the node where Translate left it.
 *
 * The same reason `Spinner` exists; this covers the message boxes.
 */
export function Alerte({
  texte,
  ton = "erreur",
  className = "",
  children,
}: {
  texte?: string | null;
  ton?: "erreur" | "succes";
  className?: string;
  children?: ReactNode;
}) {
  const visible = Boolean(texte);
  const erreur = ton === "erreur";

  const Icone = erreur ? AlertCircle : CheckCircle2;

  return (
    <p
      role={erreur ? "alert" : "status"}
      className={`items-start gap-2 rounded-xl border p-3 ${
        erreur
          ? "border-[var(--sane-red-dark)] bg-[#fef2f2]"
          : "border-[var(--sane-green)] bg-[var(--sane-green-light)]"
      } ${visible ? "flex" : "hidden"} ${className}`}
    >
      <Icone
        size={15}
        className={`mt-0.5 shrink-0 ${erreur ? "text-[var(--sane-red-dark)]" : "text-[var(--sane-green)]"}`}
      />
      <span className={`sane-small ${erreur ? "text-[var(--sane-red-dark)]" : "text-[var(--sane-green)]"}`}>
        {texte}
      </span>
      {children}
    </p>
  );
}
