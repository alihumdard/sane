import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

/**
 * A spinner that is always in the tree and only changes visibility.
 *
 * `{busy && <Loader2 />}` reads better but adds and removes a DOM node, and
 * that is exactly what breaks under Google Translate: Translate rewrites text
 * nodes in place, React then tries to insert or remove around nodes it no
 * longer recognises, and the page dies with insertBefore/removeChild. Keeping
 * the node mounted and toggling opacity sidesteps it, so the dashboards can be
 * translated like the rest of the site.
 */
export function Spinner({
  actif,
  size = 15,
  className = "",
}: {
  actif: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <Loader2
      size={size}
      aria-hidden={!actif}
      className={`animate-spin transition-opacity ${actif ? "opacity-100" : "w-0 opacity-0"} ${className}`}
    />
  );
}

/**
 * The same idea for `{busy ? <Loader2/> : <Icon/>}`: both icons stay mounted
 * and only their visibility changes, so no node is ever inserted or removed
 * while Google Translate holds references into the subtree.
 *
 * Collapsing to `w-0` rather than `display:none` keeps the hidden icon
 * laid out at zero width, which leaves the button's gap and padding intact.
 */
export function SpinnerOu({
  actif,
  children,
  size = 15,
  className = "",
}: {
  actif: boolean;
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <>
      <Spinner actif={actif} size={size} className={className} />
      <span
        aria-hidden={actif}
        className={`inline-flex transition-opacity ${actif ? "w-0 opacity-0" : "opacity-100"}`}
      >
        {children}
      </span>
    </>
  );
}
