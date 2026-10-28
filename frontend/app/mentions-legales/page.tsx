"use client";

import { Organisation, PageLegale, Section } from "@/components/legal/PageLegale";

export default function MentionsLegalesPage() {
  return (
    <PageLegale
      titre="Mentions légales"
      chapeau="Qui édite ce site, qui l'héberge, et à qui appartient ce qui s'y trouve."
    >
      <Section titre="Éditeur du site">
        <p>
          Le présent site est édité dans le cadre du Salon National de l&apos;Emploi (SANEM),
          qui se tient à Niamey du 10 au 12 décembre 2026.
        </p>
        <Organisation />
      </Section>

      <Section titre="Hébergement">
        <p>
          Le site et la base de données sont hébergés sur un serveur dédié, en Europe.
          Les coordonnées complètes de l&apos;hébergeur peuvent être obtenues sur demande
          auprès de l&apos;organisateur, à l&apos;adresse indiquée ci-dessus.
        </p>
      </Section>

      <Section titre="Propriété intellectuelle">
        <p>
          Les textes, la charte graphique, le logo et les visuels de ce site sont la
          propriété de l&apos;organisateur du SANEM, sauf mention contraire. Toute
          reproduction ou réutilisation, totale ou partielle, sans autorisation écrite
          préalable est interdite.
        </p>
        <p>
          Les logos et noms des entreprises, partenaires et médias présents sur le site
          restent la propriété de leurs titulaires respectifs et sont affichés avec leur
          accord, dans le seul cadre de l&apos;événement.
        </p>
      </Section>

      <Section titre="Contenus publiés par les utilisateurs">
        <p>
          Les offres d&apos;emploi, profils, CV et candidatures sont publiés par les
          recruteurs et les demandeurs d&apos;emploi eux-mêmes. Chacun reste responsable
          de l&apos;exactitude et de la légalité de ce qu&apos;il publie. L&apos;organisateur
          vérifie les entreprises avant la publication de leurs offres et peut retirer
          tout contenu qui ne respecterait pas ces règles.
        </p>
      </Section>

      <Section titre="Responsabilité">
        <p>
          Le site met en relation des candidats et des recruteurs ; il n&apos;est partie à
          aucun contrat de travail conclu entre eux. L&apos;organisateur ne garantit ni
          l&apos;obtention d&apos;un emploi, ni la suite donnée à une candidature.
        </p>
        <p>
          Des liens vers des sites tiers peuvent figurer sur ces pages. Leur contenu
          n&apos;engage que leurs éditeurs.
        </p>
      </Section>

      <Section titre="Nous signaler un problème">
        <p>
          Une erreur, un contenu inapproprié, une offre qui vous semble frauduleuse :
          écrivez à l&apos;adresse de contact ci-dessus. Les signalements sont traités
          dans les meilleurs délais.
        </p>
      </Section>
    </PageLegale>
  );
}
