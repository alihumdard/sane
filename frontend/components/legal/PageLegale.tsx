"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { useParametres } from "@/lib/parametres";

/**
 * The frame the three legal pages share.
 *
 * All three were linked from the footer of every page and all three answered
 * 404. They are required of a public site, and a visitor who clicks one is
 * usually looking for one thing: who is behind it and how to reach them. That
 * comes from the organisation's settings, so it is right everywhere at once
 * and nobody edits a page to change a phone number.
 */
export function PageLegale({
  titre,
  chapeau,
  children,
}: {
  titre: string;
  chapeau: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="bg-white py-10 sm:py-14">
        <Container>
          <article className="mx-auto max-w-[760px]">
            <h1 className="sane-h1 mb-3">{titre}</h1>
            <p className="sane-body mb-8 border-l-4 border-[var(--sane-orange)] pl-4">{chapeau}</p>

            <div className="flex flex-col gap-7 text-[15px] leading-[1.75] text-[var(--sane-text)]">
              {children}
            </div>
          </article>
        </Container>
      </main>

      <Footer />
    </>
  );
}

export function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="sane-h3 mb-2">{titre}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

/** The organisation's own details, named once and reused by all three pages. */
export function Organisation() {
  const { nom, email, telephone, adresse } = useParametres();

  return (
    <ul className="flex flex-col gap-1.5 rounded-xl bg-[var(--sane-background)] p-4 text-[14px]">
      <li className={nom ? "block" : "hidden"}>
        <span className="font-semibold">Organisateur :</span> {nom}
      </li>
      <li className={adresse ? "block" : "hidden"}>
        <span className="font-semibold">Adresse :</span> {adresse}
      </li>
      <li className={email ? "block" : "hidden"}>
        <span className="font-semibold">Email :</span>{" "}
        <a href={`mailto:${email}`} className="text-[var(--sane-green)] hover:underline">{email}</a>
      </li>
      <li className={telephone ? "block" : "hidden"}>
        <span className="font-semibold">Téléphone :</span> {telephone}
      </li>
    </ul>
  );
}
