"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { fieldClass, primaryBtn } from "@/components/ui/styles";

interface Props {
  /** stacked: input above button (cards) · inline: input + button on one row (banners) */
  layout?: "stacked" | "inline";
  tone?: "light" | "dark";
  successMessage?: string;
}

/** Email sign-up form with its own success state. */
export function NewsletterForm({ layout = "stacked", tone = "light", successMessage = "Merci ! Vous êtes bien abonné(e)." }: Props) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className={`sane-body inline-flex items-center gap-2 ${tone === "dark" ? "on-dark !text-white" : ""}`}>
        <CheckCircle2 size={20} className="shrink-0 text-[var(--sane-orange)]" />
        {successMessage}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className={layout === "inline" ? "flex flex-col overflow-hidden rounded-lg sm:flex-row" : "flex flex-col gap-3"}
    >
      <input
        type="email"
        required
        autoComplete="email"
        aria-label="Adresse email"
        placeholder="Votre adresse email..."
        className={`${fieldClass} ${layout === "inline" ? "min-w-0 flex-1 !rounded-none border-0" : ""}`}
      />
      <button type="submit" className={`${primaryBtn} ${layout === "inline" ? "!rounded-none" : "w-full"}`}>
        S&apos;abonner <ArrowRight size={14} />
      </button>
    </form>
  );
}
