import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { ArticleCard } from "@/components/shared";
import { pressArticles } from "./data";

export function ArticlesSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Nos actualités médias"
            title="Dernières actualités du SANEM"
            description="Suivez les dernières nouvelles, annonces et temps forts du Salon National de l'Emploi."
          />
          <Link href="/actualites" className={`${textLink} whitespace-nowrap`}>
            Voir toutes les actualités <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pressArticles.map((a) => (
            <ArticleCard key={a.title} {...a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
