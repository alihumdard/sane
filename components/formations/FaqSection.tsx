"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { faqs } from "./data";

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="bg-[var(--sane-background)] py-12 sm:py-14">
      <Container>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-orange)]">
            Questions fréquentes
          </span>
        </div>
        <h2 className="mb-8 text-[22px] font-extrabold text-[var(--sane-text)] md:text-[28px]">
          FAQ — Formations
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-[13px] font-bold text-[var(--sane-text)]">{faq.q}</span>
                {openFaq === i
                  ? <Minus size={15} strokeWidth={2} className="shrink-0 text-[var(--sane-orange)]" />
                  : <Plus size={15} strokeWidth={2} className="shrink-0 text-[var(--sane-green)]" />
                }
              </button>
              {openFaq === i && (
                <div className="border-t border-[var(--sane-border)] px-5 pb-5 pt-3">
                  <p className="text-[13px] leading-6 text-[var(--sane-text-light)]">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
