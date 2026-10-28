import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { couleurPartenaire } from "@/components/partenaires/data";

/**
 * The outlets that have covered the salon, counted from the press records.
 *
 * Six were written into this file — RTN, Le Sahel, ANP, France 24, RFI,
 * TV5MONDE — under "Ils parlent du SANEM", each in its own brand colour,
 * whether or not any of them had. The names now come from the `media` field
 * of the published press items, and the section stays away while there are
 * none.
 */
export function MediaMentionsSection({ medias = [] }: { medias?: { nom: string; mentions: number }[] }) {
  return (
    <section className={"bg-white py-10 sm:py-12 md:py-16 " + (medias.length > 0 ? "block" : "hidden")}>
      <Container>
        <SectionHeading
          eyebrow="Ils parlent du SANEM"
          title="Le SANEM dans les médias"
          description="Les médias qui ont relayé le Salon National de l'Emploi."
          className="mb-8"
        />

        <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {medias.map((m) => (
            <div
              key={m.nom}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--sane-border)] bg-white p-3 text-center transition-all hover:-translate-y-1 hover:shadow-md sm:p-5"
            >
              <span
                className="text-[length:var(--fs-lead)] font-extrabold leading-tight tracking-tight"
                style={{ color: couleurPartenaire(m.nom) }}
              >
                {m.nom}
              </span>
              <span className="sane-small text-[11px] leading-tight">
                {m.mentions} {m.mentions > 1 ? "parutions" : "parution"}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
