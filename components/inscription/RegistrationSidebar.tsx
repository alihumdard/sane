import Image from "next/image";
import { Check } from "lucide-react";
import { practicalInfo, whyItems } from "./data";

export function RegistrationSidebar() {
  return (
    <aside className="flex flex-col gap-6">
      <div className="relative min-h-28 flex-1 overflow-hidden rounded-2xl">
        <Image src="/sane_deal.png" alt="" fill sizes="(max-width: 1024px) 100vw, 340px" className="object-cover" />
        <span className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-1.5 text-[length:var(--fs-body)] font-extrabold text-[var(--sane-green)] shadow">
          SANEM
        </span>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="sane-h3 mb-3">Pourquoi s&apos;inscrire ?</h3>
        <ul className="flex flex-col gap-2.5">
          {whyItems.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green)]">
                <Check size={11} className="text-white" />
              </span>
              <span className="sane-small !text-[var(--sane-text)]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="sane-eyebrow-bar !h-px !w-4" />
          <h3 className="sane-eyebrow !text-[var(--sane-orange)]">Informations pratiques</h3>
        </div>
        <ul className="flex flex-col gap-3">
          {practicalInfo.map(({ icon: Icon, title, lines, color }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: color }}>
                <Icon size={14} />
              </span>
              <div className="min-w-0">
                <p className="sane-small font-bold !text-[var(--sane-text)]">{title}</p>
                {lines.map((l) => (
                  <p key={l} className="sane-small">
                    {l}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
