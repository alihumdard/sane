import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import type { ApiActualite } from "@/lib/types";

const BASE_URL =
  process.env.API_INTERNE ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const LIBELLE_CATEGORIE: Record<string, string> = {
  evenements: "Événements",
  communiques: "Communiqués",
  partenariats: "Partenariats",
  formations: "Formations",
  emploi: "Emploi",
};

/**
 * Uncached, for the same reason as the offer page: holding the response also
 * caches the rendered page, and one whose article has since been unpublished
 * never regenerates — the regeneration calls notFound(), which produces no
 * fresh render, so the old one is served on.
 *
 * `cache` only dedupes the two reads within a single render, the page and its
 * metadata.
 */
const getActualite = cache(async (slug: string): Promise<ApiActualite | null> => {
  const res = await fetch(`${BASE_URL}/actualites/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return ((await res.json()).data ?? null) as ApiActualite | null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getActualite(slug);

  if (!article) return { title: "Article introuvable — SANEM" };

  return {
    title: `${article.titre} — SANEM`,
    description: (article.extrait ?? article.contenu ?? "").slice(0, 160),
  };
}

function dateLisible(valeur: string | null): string {
  if (!valeur) return "";

  return new Date(valeur).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ActualitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getActualite(slug);

  if (!article) notFound();

  const categorie = LIBELLE_CATEGORIE[article.categorie] ?? article.categorie;

  return (
    <>
      <Header />

      <main className="bg-white py-8 sm:py-12">
        <Container>
          <article className="mx-auto max-w-[780px]">
            <Link
              href="/actualites"
              className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]"
            >
              <ArrowLeft size={15} /> Toutes les actualités
            </Link>

            <span className="mb-3 inline-block rounded-full bg-[var(--sane-green-light)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--sane-green)]">
              {categorie}
            </span>

            <h1 className="sane-h1 mb-3">{article.titre}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[var(--sane-text-light)]">
              <span className={`items-center gap-1.5 ${article.publiee_le ? "flex" : "hidden"}`}>
                <Calendar size={13} className="text-[var(--sane-orange)]" />
                {dateLisible(article.publiee_le)}
              </span>
              <span className={`items-center gap-1.5 ${article.auteur ? "flex" : "hidden"}`}>
                <User size={13} className="text-[var(--sane-orange)]" />
                {article.auteur}
              </span>
              <span className={`items-center gap-1.5 ${article.vues ? "flex" : "hidden"}`}>
                <Eye size={13} className="text-[var(--sane-orange)]" />
                {article.vues} lecture{(article.vues ?? 0) > 1 ? "s" : ""}
              </span>
            </div>

            <div
              className={`relative mb-8 h-[220px] overflow-hidden rounded-2xl sm:h-[360px] ${
                article.image ? "block" : "hidden"
              }`}
            >
              <Image
                src={article.image ?? "/sane_deal.webp"}
                alt={article.titre}
                fill
                sizes="(max-width: 780px) 100vw, 780px"
                className="object-cover"
                priority
              />
            </div>

            <p
              className={`mb-6 border-l-4 border-[var(--sane-orange)] pl-4 text-[15px] font-medium leading-relaxed text-[var(--sane-text)] ${
                article.extrait ? "block" : "hidden"
              }`}
            >
              {article.extrait}
            </p>

            {/*
              The body is plain text written in the back-office, so each blank
              line becomes a paragraph. Rendering it as HTML would hand the
              page to whoever can edit an article.
            */}
            <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-[var(--sane-text)]">
              {(article.contenu ?? "")
                .split(/\n{2,}/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((paragraphe, i) => (
                  <p key={i}>{paragraphe}</p>
                ))}
            </div>
          </article>
        </Container>
      </main>

      <Footer />
    </>
  );
}
