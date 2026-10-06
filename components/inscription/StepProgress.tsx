import { Check } from "lucide-react";
import { steps } from "./data";

interface Props {
  step: number;
  done: boolean;
}

export function StepProgress({ step, done }: Props) {
  return (
    <ol className="mb-8 flex items-start" aria-label="Progression">
      {steps.map((s, i) => {
        const complete = done || s.num < step;
        const active = !done && s.num === step;
        return (
          <li key={s.num} className="flex flex-1 items-start last:flex-none" aria-current={active ? "step" : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[length:var(--fs-small)] font-bold ${
                  complete || active ? "bg-[var(--sane-orange)] text-white" : "bg-[var(--sane-border)] text-[var(--sane-text-light)]"
                }`}
              >
                {complete ? <Check size={14} /> : s.num}
              </span>
              <span className="sane-small mt-1.5 hidden max-w-[96px] text-center text-[11px] font-medium !text-[var(--sane-text)] sm:block">
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={`mx-2 mt-4 h-[2px] flex-1 ${s.num < step || done ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-border)]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
