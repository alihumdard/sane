import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { primaryBtn } from "@/components/ui/styles";

interface Props {
  title?: string;
  /** banner: full-width strip · card: fills one grid cell (same height as its neighbour) */
  variant?: "banner" | "card";
}

/** "Didn't find your answer?" prompt shown with the questions. */
export function FaqContactPrompt({ title = "Vous n'avez pas trouvé votre réponse ?", variant = "banner" }: Props) {
  if (variant === "card") {
    return (
      <div className="flex h-full flex-col justify-center gap-5 rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--sane-orange)] text-white">
          <Headphones size={22} />
        </span>
        <div>
          <h3 className="sane-h3 mb-2">{title}</h3>
          <p className="sane-body">Notre équipe est disponible pour vous répondre du lundi au vendredi, de 8h à 17h.</p>
        </div>
        <Link href="/contact" className={`${primaryBtn} w-fit`}>
          Nous contacter <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--sane-orange)] text-white">
          <Headphones size={22} />
        </span>
        <div>
          <h3 className="sane-h3 mb-1">{title}</h3>
          <p className="sane-small">Notre équipe est disponible pour vous répondre du lundi au vendredi, de 8h à 17h.</p>
        </div>
      </div>
      <Link href="/contact" className={`${primaryBtn} shrink-0`}>
        Nous contacter <ArrowRight size={16} />
      </Link>
    </div>
  );
}
