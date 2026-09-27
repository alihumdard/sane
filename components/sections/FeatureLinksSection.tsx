import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

const links = [
  {
    title: "Programme du salon",
    description: "Découvrez le programme complet de l'événement.",
    action: "Voir le programme",
    href: "/programme",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=500&q=85",
  },
  {
    title: "Intervenants",
    description: "Rencontrez nos experts et leaders.",
    action: "Voir les intervenants",
    href: "/intervenants",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85",
  },
  {
    title: "Partenaires",
    description: "Ils nous accompagnent pour l'emploi.",
    action: "Voir les partenaires",
    href: "/partenaires",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=500&q=85",
  },
  {
    title: "Actualités",
    description: "Restez informé des dernières nouvelles du SANE.",
    action: "Lire les actualités",
    href: "/actualites",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=500&q=85",
  },
];

export function FeatureLinksSection() {
  return (
    <section className="border-t border-[#E4ECE6] bg-[#F8FBF9] py-8 md:py-10">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex min-h-[118px] gap-3 rounded-xl border border-[#DDE8E0] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-[92px] w-[82px] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="82px"
                />

                <div className="absolute inset-0 bg-[#10632D]/10" />
              </div>

              {/* CONTENT */}
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-[13px] font-extrabold leading-4 text-[#17352A]">
                  {item.title}
                </h3>

                <div className="mt-1 h-[2px] w-5 rounded-full bg-[#E57617]" />

                <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[#718178]">
                  {item.description}
                </p>

                <span className="mt-auto inline-flex items-center gap-1 text-[10px] font-bold text-[#10632D]">
                  {item.action}

                  <ArrowRight
                    size={12}
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