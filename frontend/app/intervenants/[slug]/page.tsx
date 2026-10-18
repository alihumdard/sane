import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Briefcase } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { slugIntervenant, speakers, type Speaker } from "@/components/intervenants/data";

/**
 * Where this page reaches the API from, which is not where the browser does.
 *
 * Rendering happens on the server, beside the API; going back out through the
 * public hostname means a TLS handshake it cannot complete behind a
 * self-signed certificate.
 */
const API =
  process.env.API_INTERNE ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

interface ApiIntervenant {
  id: number;
  nom: string;
  fonction: string | null;
  organisation: string | null;
  bio: string | null;
  photo: string | null;
}

/**
 * The speaker behind a slug — from the administration first, then the ones
 * written into the site.
 *
 * Both are addressed by a slug of the name: a record has an id, but a
 * written-in speaker has nothing of the sort, and an address should read the
 * same either way.
 */
async function trouver(slug: string): Promise<Speaker | null> {
  try {
    const res = await fetch(`${API}/intervenants`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const { data } = (await res.json()) as { data: ApiIntervenant[] };
      const trouve = data.find((i) => slugIntervenant(i.nom) === slug);

      if (trouve) {
        return {
          name: trouve.nom,
          title: trouve.fonction ?? "",
          org: trouve.organisation ?? "",
          tags: [],
          img: trouve.photo ?? "/sane-deal3.webp",
          bio: trouve.bio ?? undefined,
        };
      }
    }
  } catch {
    // Fall through to the written-in list; a speaker shipped with the site
    // should still have a page when the API is unreachable.
  }

  return speakers.find((s) => slugIntervenant(s.name) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const intervenant = await trouver(slug);

  if (!intervenant) return { title: "Intervenant introuvable — SANEM" };

  return {
    title: `${intervenant.name} — SANEM`,
    description: intervenant.bio?.slice(0, 160) ?? `${intervenant.title} — ${intervenant.org}`,
  };
}

export default async function IntervenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const intervenant = await trouver(slug);

  if (!intervenant) notFound();

  const externe = intervenant.img.startsWith("http");

  return (
    <>
      <Header />

      <main className="bg-[var(--sane-background)] py-8 sm:py-12">
        <Container>
          <Link
            href="/intervenants"
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]"
          >
            <ArrowLeft size={15} /> Tous les intervenants
          </Link>

          <div className="overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white">
            <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[260px_1fr] md:gap-8">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-xl bg-[var(--sane-background)]">
                <Image
                  src={intervenant.img}
                  alt={intervenant.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 260px"
                  unoptimized={externe}
                  className="object-cover object-top"
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-[22px] font-bold leading-tight text-[var(--sane-text)] sm:text-[length:var(--fs-h1)]">
                  {intervenant.name}
                </h1>

                <p
                  className={`mt-2 items-center gap-2 text-[14px] font-semibold text-[var(--sane-green)] ${
                    intervenant.title ? "flex" : "hidden"
                  }`}
                >
                  <Briefcase size={15} /> {intervenant.title}
                </p>

                <p
                  className={`mt-1 items-center gap-2 text-[13px] text-[var(--sane-text-light)] ${
                    intervenant.org ? "flex" : "hidden"
                  }`}
                >
                  <Building2 size={15} /> {intervenant.org}
                </p>

                <div className={`mt-4 flex-wrap gap-2 ${intervenant.tags.length ? "flex" : "hidden"}`}>
                  {intervenant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--sane-green-light)] px-3 py-1 text-[11px] font-bold text-[var(--sane-green)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Paragraph by paragraph: a biography arrives as plain text
                    with blank lines, and one block would run them together. */}
                <div className={`mt-6 border-t border-[var(--sane-border)] pt-6 ${intervenant.bio ? "block" : "hidden"}`}>
                  {(intervenant.bio ?? "").split(/\n\s*\n/).map((para, i) => (
                    <p key={i} className="mb-3 text-[14px] leading-relaxed text-[var(--sane-text)] last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
