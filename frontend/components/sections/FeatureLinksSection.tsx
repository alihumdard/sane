import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarRange, Mic2, Handshake, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

const links: { title: string; description: string; action: string; href: string; image: string; icon: LucideIcon }[] = [
  {
    title: "Programme du salon",
    description: "Découvrez le programme complet de l'événement.",
    action: "Voir le programme",
    href: "/programme",
    image: "/card-img3.webp",
    icon: CalendarRange,
  },
  {
    title: "Intervenants",
    description: "Rencontrez nos experts et leaders.",
    action: "Voir les intervenants",
    href: "/intervenants",
    image: "/card-img.webp",
    icon: Mic2,
  },
  {
    title: "Partenaires",
    description: "Ils nous accompagnent pour l'emploi.",
    action: "Voir nos partenaires",
    href: "/partenaires",
    image: "/card-img2.webp",
    icon: Handshake,
  },
  {
    title: "Actualités",
    description: "Restez informé des dernières nouvelles du SANEM.",
    action: "Lire les actualités",
    href: "/actualites",
    image: "/card-img3.webp",
    icon: Newspaper,
  },
];

export function FeatureLinksSection() {
  return (
    <section className="border-y border-[var(--sane-c-e4ece6)] bg-white py-8 md:py-10">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex gap-4 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--sane-green)]/20 hover:bg-white hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="85px"
                />
              </div>

              {/* CONTENT */}
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="sane-h3 flex items-center gap-1.5">
                  <item.icon size={14} strokeWidth={2.2} className="shrink-0 text-[var(--sane-orange)]" />
                  {item.title}
                </h3>

                <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.5] text-[var(--sane-text-light)]">
                  {item.description}
                </p>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12px] font-bold text-[var(--sane-green)]">
                  {item.action}
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
