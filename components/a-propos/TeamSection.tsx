import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface TeamMember {
  name: string;
  role: string;
  img: string;
  linkedin?: string;
}

const team: TeamMember[] = [
  { name: "M. Ibrahim Maiga", role: "Président du Comité d'organisation", img: "/sane_deal.png" },
  { name: "Mme Aïssatou Issa", role: "Coordinatrice des formations", img: "/sane_company.png" },
  { name: "M. Moussa Alidou", role: "Responsable Partenariats", img: "/sane_cv.png" },
  { name: "Mme Kadidia Salifou", role: "Responsable Communication", img: "/sane_deal.png" },
];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[var(--sane-border)] transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={member.img}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-[var(--sane-border)] px-4 py-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-bold leading-tight text-[var(--sane-text)]">{member.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] leading-snug text-[var(--sane-text-light)]">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--sane-orange)]" />
            <span className="truncate">{member.role}</span>
          </p>
        </div>
        <a
          href={member.linkedin || "#"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green)] !text-white transition-colors hover:bg-[#0a4a22]"
          aria-label={`LinkedIn de ${member.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
      </div>
    </div>
  );
}

export function TeamSection() {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--sane-green)] sm:text-[11px]">
            Notre Équipe
          </span>
        </div>

        <div className="mb-8 flex items-end justify-between sm:mb-10">
          <h2 className="text-[22px] font-extrabold leading-[1.12] tracking-tight text-[var(--sane-text)] sm:text-[26px] md:text-[30px]">
            Une équipe engagée et expérimentée
          </h2>
          <Link
            href="/equipe"
            className="hidden items-center gap-1.5 text-[12px] font-bold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-orange)] sm:flex sm:text-[13px]"
          >
            Voir toute l&apos;équipe <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>

        <Link
          href="/equipe"
          className="mt-6 flex items-center justify-center gap-1.5 text-[12px] font-bold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-orange)] sm:hidden"
        >
          Voir toute l&apos;équipe <ArrowRight size={14} />
        </Link>
      </Container>
    </section>
  );
}
