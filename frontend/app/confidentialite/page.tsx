"use client";

import { Organisation, PageLegale, Section } from "@/components/legal/PageLegale";

export default function ConfidentialitePage() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      chapeau="Ce que nous collectons, pourquoi, qui le voit, combien de temps nous le gardons, et ce que vous pouvez exiger."
    >
      <Section titre="Qui traite vos données">
        <Organisation />
      </Section>

      <Section titre="Ce que nous collectons">
        <p>Selon ce que vous faites sur le site :</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Inscription à l&apos;événement</strong> — nom, date de naissance, email,
            téléphone, genre, nationalité, ville, niveau d&apos;études, situation
            professionnelle, domaine, expérience, formations choisies.
          </li>
          <li>
            <strong>Compte demandeur d&apos;emploi</strong> — en plus : titre professionnel,
            secteur, ville, présentation, compétences, formations, expériences, CV et
            autres documents que vous déposez.
          </li>
          <li>
            <strong>Compte recruteur</strong> — nom et coordonnées de l&apos;entreprise, offres
            publiées, questions de sélection, suivi des candidatures et des entretiens.
          </li>
          <li>
            <strong>Techniques</strong> — adresse IP et journaux de connexion du serveur,
            conservés pour la sécurité du site.
          </li>
        </ul>
      </Section>

      <Section titre="Pourquoi">
        <p>
          Pour inscrire les participants et gérer les places en formation, pour permettre
          aux demandeurs d&apos;emploi de postuler et aux recruteurs d&apos;examiner les
          candidatures, pour organiser les entretiens, et pour vous envoyer les emails liés
          à ces actions : confirmation d&apos;inscription, rappel de formation, suite donnée
          à une candidature, proposition d&apos;entretien.
        </p>
      </Section>

      <Section titre="Qui voit quoi">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            Un recruteur ne voit votre <strong>email et votre téléphone</strong> qu&apos;une
            fois que vous avez postulé à l&apos;une de ses offres. Dans la recherche de
            profils, il voit votre parcours, jamais vos coordonnées.
          </li>
          <li>
            Votre profil n&apos;apparaît dans cette recherche que si vous avez coché
            <em> « Rendre mon profil visible aux recruteurs »</em>. Vous pouvez le décocher
            à tout moment.
          </li>
          <li>
            Un recruteur n&apos;accède qu&apos;aux candidatures reçues sur ses propres offres.
          </li>
          <li>
            L&apos;équipe organisatrice accède aux inscriptions et aux comptes pour les
            besoins de l&apos;événement.
          </li>
          <li>
            Vos données ne sont ni vendues, ni louées, ni transmises à des tiers à des fins
            publicitaires.
          </li>
        </ul>
      </Section>

      <Section titre="Combien de temps">
        <p>
          Les inscriptions et les candidatures sont conservées pendant la durée de
          l&apos;édition en cours et les douze mois qui suivent, afin de permettre le suivi
          du recrutement. Au-delà, elles sont supprimées ou anonymisées. Vous pouvez
          demander la suppression de votre compte avant ce terme.
        </p>
      </Section>

      <Section titre="Vos droits">
        <p>
          Vous pouvez à tout moment accéder à vos données, les corriger, les retirer du
          site ou en demander la suppression. L&apos;essentiel se fait directement depuis
          votre espace : modifier votre profil, remplacer ou supprimer votre CV, retirer une
          candidature tant qu&apos;elle n&apos;a pas été traitée, masquer votre profil.
        </p>
        <p>
          Pour une demande que l&apos;interface ne couvre pas — suppression complète du
          compte, copie de vos données — écrivez à l&apos;adresse de contact ci-dessus.
        </p>
      </Section>

      <Section titre="Sécurité">
        <p>
          Les échanges avec le site sont chiffrés. Les mots de passe ne sont jamais stockés
          en clair. Les CV et pièces jointes ne sont accessibles qu&apos;à vous, aux
          recruteurs auprès desquels vous avez postulé, et à l&apos;équipe organisatrice.
        </p>
      </Section>

      <Section titre="Cookies">
        <p>
          Le site dépose les cookies nécessaires à votre session : rester connecté, et
          protéger les formulaires. Aucun cookie publicitaire n&apos;est utilisé.
        </p>
      </Section>
    </PageLegale>
  );
}
