import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroInfo } from "./HeroInfo";
import { LoginCard } from "./LoginCard";

interface Props {
  activeRole: string;
  onRoleChange: (key: string) => void;
}

/** Hero with the info column on the left and the login card on the right (both the same width and height). */
export function ConnexionHero({ activeRole, onRoleChange }: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--sane-green-dark)]">
      <div className="absolute inset-0 z-10 bg-[var(--sane-green-dark)]/80 lg:bg-gradient-to-r lg:from-[var(--sane-green-dark)] lg:via-[var(--sane-green-dark)]/85 lg:to-[var(--sane-green-dark)]/30" />
      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%]">
        <Image src="/sane_deal.png" alt="" fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--sane-green-dark)] via-[var(--sane-green-dark)]/30 to-transparent" />
      </div>

      <Container className="relative z-20 py-8 sm:py-10 lg:py-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[length:var(--fs-small)] sm:px-5 sm:py-2">
          <Link href="/" className="font-medium text-[var(--sane-green)] transition-colors hover:text-[var(--sane-green-dark)]">
            Accueil
          </Link>
          <ChevronRight size={16} className="text-[var(--sane-text-light)]" />
          <span className="font-bold text-[var(--sane-orange)]">Connexion</span>
        </div>

        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          <HeroInfo />
          <LoginCard activeRole={activeRole} onRoleChange={onRoleChange} />
        </div>
      </Container>
    </section>
  );
}
