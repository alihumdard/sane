@component('mail::message')
# Bienvenue sur la plateforme du SANEM

Bonjour {{ $user->name }},

Votre compte vient d'être créé sur la plateforme du **Salon National de l'Emploi**. Vous pouvez
dès maintenant vous connecter avec cette adresse email.

@if ($recruteur)
## Première étape : votre entreprise

Renseignez le profil de votre entreprise. Tant qu'il n'est pas complété et validé par nos
équipes, vos offres ne peuvent pas être publiées.

@component('mail::button', ['url' => $lienEspace])
Renseigner mon entreprise
@endcomponent
@else
## Première étape : votre profil

Complétez votre profil — votre CV, votre formation et vos informations professionnelles. Ces
trois éléments sont nécessaires pour pouvoir postuler aux offres.

@component('mail::button', ['url' => $lienEspace])
Compléter mon profil
@endcomponent
@endif

## Vous souhaitez assister au salon ?

@component('mail::panel')
**Créer un compte n'est pas la même chose que s'inscrire au salon.** Votre compte vous donne
accès au portail emploi. Pour assister à l'événement à Niamey, une inscription séparée est
nécessaire.
@endcomponent

@component('mail::button', ['url' => $lienInscription, 'color' => 'success'])
M'inscrire au salon
@endcomponent

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce qu'un compte vient d'être créé avec cette adresse sur la
plateforme du SANEM. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer
ce message.
@endcomponent
@endcomponent
