"use client";

import { useEffect } from "react";

/**
 * Google Translate (and similar page-translation extensions) rewrite text
 * nodes directly in the DOM, outside React's control. When React later tries
 * to update or remove a node it still thinks is there, the browser throws
 * "Failed to execute 'removeChild'/'insertBefore' on 'Node'" and the page
 * crashes. This is a known upstream limitation (facebook/react#11538), not a
 * bug in this app's components.
 *
 * Rather than disabling translation, this swallows exactly that class of
 * error so the page keeps working instead of showing a crash screen.
 */
export default function TranslateGuard() {
  useEffect(() => {
    const estErreurTraduction = (message: unknown) =>
      typeof message === "string" &&
      /(removeChild|insertBefore)/.test(message) &&
      /NotFoundError|not a child of this node/.test(message);

    const onError = (event: ErrorEvent) => {
      if (estErreurTraduction(event.message) || estErreurTraduction(event.error?.message)) {
        event.preventDefault();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (estErreurTraduction(event.reason?.message)) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
