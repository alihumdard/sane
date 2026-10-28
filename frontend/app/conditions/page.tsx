"use client";

import { Organisation, PageLegale, Section } from "@/components/legal/PageLegale";

export default function ConditionsPage() {
  return (
    <PageLegale
      titre="Conditions d'utilisation"
      chapeau="Les règles du site : ce que chacun peut y faire, ce qu'il s'engage à ne pas y faire, et ce qui arrive s'il le fait quand même."
    >
      <Section titre="Objet">
        <p>
          Le site du Salon National de l&apos;Emploi permet de s&apos;inscrire à
          l&apos;événement et aux formations gratuites, de publier et de consulter des
          offres d&apos;emploi, de postuler, et d&apos;organiser des entretiens. Son usage
          est gratuit et suppose l&apos;acceptation des présentes conditions.
        </p>
        <Organisation />
      </Section>

      <Section titre="Compte">
        <p>
          La création d&apos;un compte demandeur d&apos;emploi ou recruteur est ouverte à
          toute personne majeure. Les informations fournies doivent être exactes et tenues
          à jour. Un compte est personnel : vous êtes responsable de votre mot de passe et
          de ce qui est fait avec votre compte.
        </p>
      </Section>

      <Section titre="Demandeurs d'emploi">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            Pour postuler, votre profil doit comporter un CV, au moins une formation et vos
            informations professionnelles. Sans cela, un recruteur n&apos;aurait rien à
            consulter.
          </li>
          <li>
            Le CV et les informations que vous déposez doivent être les vôtres et
            véridiques.
          </li>
          <li>
            Lorsqu&apos;un recruteur pose des questions de sélection, y répondre est
            nécessaire pour envoyer la candidature.
          </li>
          <li>
            Vous pouvez retirer une candidature tant qu&apos;elle n&apos;a pas été traitée.
          </li>
        </ul>
      </Section>

      <Section titre="Recruteurs">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            Une entreprise est vérifiée par l&apos;organisateur avant de pouvoir publier.
            Tant que la vérification n&apos;est pas accordée, les offres restent en
            brouillon.
          </li>
          <li>
            Les offres doivent correspondre à des postes réels. Sont interdites les annonces
            trompeuses, celles demandant un paiement au candidat, et celles comportant un
            critère discriminatoire.
          </li>
          <li>
            Les candidatures reçues ne peuvent servir qu&apos;au recrutement concerné.
            Elles ne doivent être ni revendues, ni transmises, ni utilisées à des fins
            commerciales.
          </li>
          <li>
            Si la vérification de l&apos;entreprise est retirée, ses offres publiées sont
            fermées.
          </li>
        </ul>
      </Section>

      <Section titre="Inscriptions et formations">
        <p>
          Les formations sont gratuites et les places limitées : elles sont attribuées dans
          l&apos;ordre des inscriptions, dans la limite des capacités annoncées. Une
          inscription confirmée vaut engagement d&apos;être présent ; si vous ne pouvez pas
          venir, annulez pour libérer la place.
        </p>
      </Section>

      <Section titre="Ce qui est interdit">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Usurper l&apos;identité d&apos;une personne ou d&apos;une entreprise.</li>
          <li>Déposer un contenu illicite, injurieux ou discriminatoire.</li>
          <li>Collecter automatiquement les profils ou les offres du site.</li>
          <li>Tenter d&apos;accéder à des comptes ou à des données qui ne sont pas les vôtres.</li>
          <li>Perturber le fonctionnement du service.</li>
        </ul>
      </Section>

      <Section titre="Suspension">
        <p>
          Un compte qui ne respecte pas ces règles peut être suspendu ou supprimé, et ses
          contenus retirés, sans préavis en cas de manquement grave.
        </p>
      </Section>

      <Section titre="Disponibilité du service">
        <p>
          Le site est fourni en l&apos;état. L&apos;organisateur met tout en œuvre pour en
          assurer le bon fonctionnement, sans garantir une disponibilité ininterrompue :
          des interruptions pour maintenance ou pour cause technique restent possibles.
        </p>
      </Section>

      <Section titre="Données personnelles">
        <p>
          Le traitement de vos données est décrit dans la{" "}
          <a href="/confidentialite" className="font-semibold text-[var(--sane-green)] hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </Section>

      <Section titre="Évolution des conditions">
        <p>
          Ces conditions peuvent être modifiées pour suivre les évolutions du site. La
          version en vigueur est celle publiée sur cette page.
        </p>
      </Section>
    </PageLegale>
  );
}
