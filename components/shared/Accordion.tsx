"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";

export interface FaqEntry {
  question: string;
  answer: string;
}

interface ItemProps extends FaqEntry {
  /** start expanded (used by search results) */
  defaultOpen?: boolean;
}

/** One collapsible question/answer row. */
export function AccordionItem({ question, answer, defaultOpen = false }: ItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-[var(--sane-border)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-[length:var(--fs-body)] font-semibold text-[var(--sane-text)] transition-colors hover:text-[var(--sane-green)]"
      >
        <span>{question}</span>
        {open ? (
          <Minus size={17} className="shrink-0 text-[var(--sane-green)]" />
        ) : (
          <Plus size={17} className="shrink-0 text-[var(--sane-text-light)]" />
        )}
      </button>
      <div id={id} role="region" hidden={!open}>
        <p className="sane-small pb-4">{answer}</p>
      </div>
    </div>
  );
}

/** A list of accordion rows. */
export function AccordionList({ items, defaultOpen = false }: { items: FaqEntry[]; defaultOpen?: boolean }) {
  return (
    <div>
      {items.map((f) => (
        <AccordionItem key={f.question} {...f} defaultOpen={defaultOpen} />
      ))}
    </div>
  );
}
