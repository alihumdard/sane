import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface CTAAction {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

interface CTASectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: CTAAction[];
  /** "dark" puts a green overlay on the background and switches the tagline to white */
  tone?: "light" | "dark";
}

/** Call-to-action banner used at the bottom of every page. Content is configurable, the layout is not. */
export function CTASection({
  title = (
    <>
      Votre prochaine
      <br />
      opportunité
      <br />
      commence ici.
    </>
  ),
  description = "Rejoignez le Salon National de l'Emploi du Niger (SANEM) et construisez votre avenir professionnel.",
  actions = [
    { href: "/inscription", label: "Participer au SANEM" },
    { href: "/emploi", label: "Découvrir les offres", variant: "secondary" },
  ],
  tone = "light",
}: CTASectionProps) {
  const dark = tone === "dark";

  return (
    <section className="relative min-h-[270px] overflow-hidden py-3 md:h-[280px] md:py-4">
      <div className="absolute inset-0">
        <Image
          src="/SalonNationalbg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {dark && <div className="absolute inset-0 bg-[var(--sane-green-deep)]/80" />}

      <Container className="relative h-full">
        <div className="relative z-20 flex h-full items-center py-2 md:py-0">
          <div className="w-full px-0 md:pl-32 md:pr-12 lg:pl-64 xl:pl-72">
            <h2 className="sane-h2 on-dark max-w-[430px]">{title}</h2>

            <p className="sane-small on-dark mt-3 max-w-[470px]">{description}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              {actions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className={`group inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold transition-colors ${
                    a.variant === "secondary"
                      ? "border-2 border-[var(--sane-green)] bg-white text-[var(--sane-green)] hover:bg-[var(--sane-green-light)]"
                      : "bg-[var(--sane-orange)] !text-white hover:bg-[var(--sane-orange-dark)]"
                  }`}
                >
                  {a.label}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-12 top-1/2 z-20 hidden -translate-y-1/2 text-center md:block">
          <p className={`font-serif text-xl italic leading-[1.2] ${dark ? "text-white" : "text-[var(--sane-green)]"}`}>
            Des talents
            <br />
            pour un Niger
            <br />
            plus fort
          </p>
          <div className="mx-auto mt-2 h-[2.5px] w-10 rounded-full bg-[var(--sane-orange)]" />
        </div>
      </Container>
    </section>
  );
}
