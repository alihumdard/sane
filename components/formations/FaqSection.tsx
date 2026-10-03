"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "./data";

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mt-12 sm:mt-14">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
            Questions fréquentes
          </span>
        </div>
        <h2 className="mb-8 text-[24px] font-extrabold text-[#0f5025] md:text-[32px]">
          FAQ – Formations
        </h2>

        <div className="rounded-xl border border-[var(--sane-border)] bg-white p-2 shadow-sm sm:p-4">
          <div className="grid sm:grid-cols-2 sm:gap-x-8">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[var(--sane-border)] last:border-b-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-[13px] font-bold text-[var(--sane-text)]">{faq.q}</span>
                  {openFaq === i
                    ? <Minus size={16} strokeWidth={2.5} className="shrink-0 text-[var(--sane-green)]" />
                    : <Plus size={16} strokeWidth={2.5} className="shrink-0 text-[var(--sane-green)]" />
                  }
                </button>
                {openFaq === i && (
                  <div className="pb-4">
                    <p className="text-[12px] leading-6 text-[var(--sane-text-light)]">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
