@component('mail::message')
# Votre formation a lieu dans trois jours

Bonjour {{ $inscription->nom }},

Un rappel pour la formation **{{ $formation->titre }}** à laquelle vous êtes inscrit(e)
au Salon National de l'Emploi.

@component('mail::panel')
**{{ $formation->date_debut->translatedFormat('l j F Y') }}**

{{ $formation->lieu }}@if ($formation->format) — {{ $formation->format }}@endif
@endcomponent

@component('mail::table')
| | |
|:---------------|:--------------------------------|
| **Référence**  | {{ $inscription->reference }} |
| **Durée**      | {{ $formation->duree }} |
| **Niveau**     | {{ $formation->niveau }} |
@if ($formateur)
| **Intervenant**| {{ $formateur->nom }}@if ($formateur->fonction) — {{ $formateur->fonction }}@endif |
@endif
@endcomponent

@if ($formation->prerequis)
## À prévoir

{{ $formation->prerequis }}
@endif

Présentez votre référence à l'accueil. Si vous ne pouvez finalement pas y assister,
prévenez-nous : votre place sera proposée à un autre participant.

@component('mail::button', ['url' => config('app.frontend_url') . '/programme'])
Consulter le programme
@endcomponent

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Rappel envoyé pour l'inscription {{ $inscription->reference }}. Pour toute question,
répondez à ce message en rappelant cette référence.
@endcomponent
@endcomponent
