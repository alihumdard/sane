"use client";

import { useEffect } from "react";

/**
 * A page-translation extension rewrites text nodes directly in the DOM,
 * outside React's control. When React's own commit then tries to update or
 * remove a node it still thinks is there — typically right after a client
 * navigation — the browser throws "Failed to execute 'removeChild'/
 * 'insertBefore' on 'Node'" and React unmounts the whole tree, which Next.js
 * shows as a full-page crash. This is a known upstream limitation
 * (facebook/react#11538), not a bug in this app's components, and the
 * `TranslateGuard` component's window-level listener cannot intercept it
 * because React throws from inside its own commit phase before bubbling out.
 *
 * Rather than showing the crash screen (or asking anyone to turn translation
 * off), this boundary recognizes exactly that error class and reloads the
 * current route immediately — the app recovers in place instead of leaving
 * a dead page behind.
 */
function estErreurTraduction(message: string): boolean {
  return (
    /(removeChild|insertBefore)/.test(message) &&
    /NotFoundError|not a child of this node/.test(message)
  );
}

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const traduction = estErreurTraduction(error.message);

  useEffect(() => {
    if (traduction) {
      window.location.reload();
    }
  }, [traduction]);

  // A real error (not translation-caused) still gets a visible, recoverable
  // screen — silently eating every crash would hide actual bugs.
  return (
    <html lang="fr">
      <body>
        <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, fontFamily: "sans-serif" }}>
          {traduction ? (
            <p style={{ fontSize: 13, color: "#4d6359" }}>Rechargement…</p>
          ) : (
            <>
              <p style={{ fontSize: 14, color: "#17352a", fontWeight: 600 }}>Une erreur est survenue.</p>
              <button
                type="button"
                onClick={reset}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#10632d", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                Réessayer
              </button>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
