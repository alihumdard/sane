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
    image: "/Programme.png",
  },
  {
    title: "Intervenants",
    description: "Rencontrez nos experts et leaders.",
    action: "Voir les intervenants",
    href: "/intervenants",
    image: "/Intervenants.png",
  },
  {
    title: "Partenaires",
    description: "Ils nous accompagnent pour l'emploi.",
    action: "Voir nos partenaires",
    href: "/partenaires",
    image: "/Partenaires.png",
  },
  {
    title: "Actualités",
    description: "Restez informé des dernières nouvelles du SANE.",
    action: "Lire les actualités",
    href: "/actualites",
    image: "/Actualités.png",
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
              className="group flex gap-3 rounded-xl border border-[#DCE8E1] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="80px"
                />
              </div>

              {/* CONTENT */}
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-[14px] font-extrabold leading-4 text-[#10632D]">
                  {item.title}
                </h3>

                <div className="mt-1 h-[2px] w-6 rounded-full bg-[#E57617]" />

                <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-[#718178]">
                  {item.description}
                </p>

                <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#10632D]">
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