"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { ArticleCard, type ArticleCardData } from "@/components/shared";
import { api } from "@/lib/api";
import type { ApiArticlePresse } from "@/lib/types";

const COULEUR_TYPE: Record<string, string> = {
  communique: "var(--sane-orange)",
  article: "var(--sane-green)",
  interview: "var(--sane-c-1a5276)",
  reportage: "var(--sane-green)",
};

const LIBELLE_TYPE: Record<string, string> = {
  communique: "Communiqué",
  article: "Article",
  interview: "Interview",
  reportage: "Reportage",
};

/**
 * The press items held in the back-office, not a list written here.
 *
 * The page carried three articles dated 2024 with "Lire l'article" buttons
 * pointing at "#". A record carries the address of the piece — the media's
 * own page, or a file the organisers uploaded — and a card without either
 * shows no link rather than a dead one.
 */
export function ArticlesSection() {
  const [articles, setArticles] = useState<ArticleCardData[]>([]);

  useEffect(() => {
    let actif = true;

    api
      .get<{ data: ApiArticlePresse[] }>("/presse")
      .then((res) => {
        if (!actif) return;

        setArticles(
          res.data.map((a) => ({
            image: "/sane-deal3.webp",
            date: new Date(a.date_publication).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
            tag: LIBELLE_TYPE[a.type] ?? a.media,
            tagColor: COULEUR_TYPE[a.type] ?? "var(--sane-green)",
            title: a.titre,
            description: a.resume ?? "",
            href: a.lien ?? a.fichier ?? undefined,
          }))
        );
      })
      .catch(() => {
        // An empty section rather than three articles that are not ours.
      });

    return () => {
      actif = false;
    };
  }, []);

  return (
    <section className={`bg-white py-10 sm:py-12 md:py-16 ${articles.length ? "block" : "hidden"}`}>
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
          {articles.map((a) => (
            <ArticleCard key={a.title} {...a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
