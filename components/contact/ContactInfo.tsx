import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo, socials } from "./data";

export function ContactInfo() {
  return (
    <div>
      <SectionHeading eyebrow="Nos coordonnées" title="Plusieurs moyens pour nous joindre" className="mb-8" />

      <ul className="flex flex-col gap-6">
        {contactInfo.map(({ icon: Icon, title, value, hint }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--sane-orange)] text-white">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="sane-small font-bold !text-[var(--sane-text)]">{title}</p>
              <p className="text-[length:var(--fs-lead)] font-bold text-[var(--sane-text)]">{value}</p>
              <p className="sane-small">{hint}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <p className="sane-small mb-3 font-semibold !text-[var(--sane-text)]">Suivez-nous</p>
        <div className="flex items-center gap-2.5">
          {socials.map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sane-green)] !text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--sane-orange)]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
