import { Check } from "lucide-react";
import { steps } from "./data";

interface Props {
  step: number;
  done: boolean;
  /** Step numbers actually in play — the formations step is skipped for some types. */
  parcours: number[];
}

export function StepProgress({ step, done, parcours }: Props) {
  const visibles = steps.filter((s) => parcours.includes(s.num));
  const position = parcours.indexOf(step);

  return (
    <ol className="mb-8 flex items-start" aria-label="Progression">
      {visibles.map((s, i) => {
        const complete = done || i < position;
        const active = !done && i === position;
        return (
          <li key={s.num} className="flex flex-1 items-start last:flex-none" aria-current={active ? "step" : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[length:var(--fs-small)] font-bold ${
                  complete || active ? "bg-[var(--sane-orange)] text-white" : "bg-[var(--sane-border)] text-[var(--sane-text-light)]"
                }`}
              >
                {complete ? <Check size={14} /> : i + 1}
              </span>
              <span className="sane-small mt-1.5 hidden max-w-[96px] text-center text-[11px] font-medium !text-[var(--sane-text)] sm:block">
                {s.label}
              </span>
            </div>
            {i < visibles.length - 1 && (
              <span className={`mx-2 mt-4 h-[2px] flex-1 ${complete ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-border)]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
