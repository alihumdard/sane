import { contactInfo, socials } from "./data";


export function ContactInfo() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-4 bg-[var(--sane-orange)]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--sane-green)]">Nos coordonnées</span>
        </div>
        <p className="mb-6 text-[15px] text-[#61756B]">Plusieurs moyens pour nous joindre.</p>

        <ul className="flex flex-col gap-5">
          {contactInfo.map(({ icon: Icon, title, value, hint }, i) => (
            <li key={title} className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${i % 2 === 0 ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"}`}>
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#61756B]">{title}</p>
                <p className="text-[14px] font-bold text-[#0a2e16]">{value}</p>
                <p className="text-[11px] text-[#61756B]">{hint}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="mb-2.5 text-[13px] font-semibold text-[#0a2e16]">Suivez-nous</p>
          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sane-green)] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--sane-orange)]"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
