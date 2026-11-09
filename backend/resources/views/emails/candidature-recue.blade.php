@component('mail::message')
# Votre candidature a bien été envoyée

Bonjour {{ $user->name }},

Votre candidature pour le poste de **{{ $offre->titre }}**@if ($offre->entreprise) chez
**{{ $offre->entreprise->nom }}**@endif a bien été transmise au recruteur.

Votre référence est :

@component('mail::panel')
**{{ $candidature->reference }}**
@endcomponent

Le recruteur a été prévenu. Vous recevrez un email à chaque changement de statut de votre
candidature, et vous pouvez la suivre à tout moment depuis votre espace.

@component('mail::button', ['url' => $lienSuivi])
Suivre ma candidature
@endcomponent

Bonne chance,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce qu'une candidature a été envoyée depuis votre compte sur la
plateforme du SANEM.
@endcomponent
@endcomponent
