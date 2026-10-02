import { Target, Eye, Diamond, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

const values = ["Inclusion et équité", "Excellence", "Collaboration", "Innovation", "Engagement pour le Niger"];

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-center backdrop-blur-sm transition-colors hover:border-[var(--sane-orange)]/30 sm:px-6">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sane-orange)]/15 ring-1 ring-[var(--sane-orange)]/30">
        <Icon size={21} strokeWidth={1.8} className="text-[var(--sane-orange)]" />
      </div>
      <h3 className="mb-2 text-[15px] font-extrabold text-white sm:text-[16px]">{title}</h3>
      {children}
    </div>
  );
}

export function MissionVisionValues() {
  return (
    <section className="bg-[#0a3a1a] py-8 sm:py-10 md:py-12">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          <Card icon={Target} title="Notre mission">
            <p className="text-[12px] leading-[1.5] text-white/60 sm:text-[13px]">
              Faciliter la rencontre entre les talents, les opportunités et les acteurs du
              développement pour contribuer à un Niger plus fort.
            </p>
          </Card>

          <Card icon={Eye} title="Notre vision">
            <p className="text-[12px] leading-[1.5] text-white/60 sm:text-[13px]">
              Devenir la référence nationale en matière d&apos;emploi, de formation et
              d&apos;entrepreneuriat, au service d&apos;un développement durable du Niger.
            </p>
          </Card>

          <Card icon={Diamond} title="Nos valeurs">
            <ul className="flex flex-wrap justify-center gap-1.5">
              {values.map((v) => (
                <li
                  key={v}
                  className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/75 sm:text-[12px]"
                >
                  <Check size={12} strokeWidth={2.5} className="shrink-0 text-[var(--sane-orange)]" />
                  {v}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  );
}
