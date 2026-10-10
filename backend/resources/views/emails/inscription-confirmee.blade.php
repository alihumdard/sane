@component('mail::message')
# Votre inscription est confirmée

Bonjour {{ $inscription->nom }},

Votre inscription au **Salon National de l'Emploi {{ $inscription->edition->annee }}** a été validée
par nos équipes. Vous êtes officiellement attendu(e).

@component('mail::panel')
**{{ $inscription->reference }}**

Présentez cette référence à l'accueil le jour de l'événement.
@endcomponent

## Informations pratiques

@component('mail::table')
| | |
|:---------------------|:------------------------------|
| **Dates**            | du {{ $inscription->edition->date_debut->translatedFormat('j F Y') }} au {{ $inscription->edition->date_fin->translatedFormat('j F Y') }} |
@if ($inscription->edition->lieu)
| **Lieu**             | {{ $inscription->edition->lieu }} |
@endif
| **Participation**    | {{ $inscription->type_participation->label() }} |
@endcomponent

@if ($formations->isNotEmpty())
## Vos formations

Vos places sont désormais définitivement réservées.

@component('mail::table')
| Formation | Durée | Format | Lieu |
|:----------|:------|:-------|:-----|
@foreach ($formations as $formation)
| {{ $formation->titre }} | {{ $formation->duree }} | {{ $formation->format }} | {{ $formation->lieu }} |
@endforeach
@endcomponent

Si vous ne pouvez finalement pas assister à l'une d'elles, prévenez-nous : votre place sera
proposée à un autre participant.
@endif

@component('mail::button', ['url' => config('app.frontend_url') . '/programme'])
Consulter le programme
@endcomponent

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Cet email confirme l'inscription enregistrée avec cette adresse. Pour toute question,
répondez à ce message en rappelant votre référence {{ $inscription->reference }}.
@endcomponent
@endcomponent
