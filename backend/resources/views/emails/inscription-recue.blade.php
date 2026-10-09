@component('mail::message')
# Votre inscription a bien été reçue

Bonjour {{ $inscription->nom }},

Nous avons bien enregistré votre inscription au **Salon National de l'Emploi {{ $inscription->edition->annee }}**.

Votre référence est :

@component('mail::panel')
**{{ $inscription->reference }}**
@endcomponent

Conservez-la : elle vous sera demandée pour toute question concernant votre inscription.

## Récapitulatif

@component('mail::table')
| | |
|:---------------------|:------------------------------|
| **Participation**    | {{ $inscription->type_participation->label() }} |
| **Email**            | {{ $inscription->email }}     |
| **Téléphone**        | +227 {{ $inscription->telephone }} |
@if ($inscription->ville)
| **Ville**            | {{ $inscription->ville }}     |
@endif
@endcomponent

@if ($formations->isNotEmpty())
## Formations retenues

@foreach ($formations as $formation)
- **{{ $formation->titre }}** — {{ $formation->duree }}, {{ $formation->format }}, {{ $formation->lieu }}
@endforeach

Vos places sont réservées. Elles ne seront définitives qu'après validation de votre inscription.
@endif

## Et maintenant ?

Votre inscription est **en attente de validation** par nos équipes. Vous recevrez un second email
dès qu'elle sera confirmée, accompagné de votre badge d'accès.

@component('mail::button', ['url' => config('app.frontend_url') . '/programme'])
Consulter le programme
@endcomponent

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce qu'une inscription au SANEM a été effectuée avec cette adresse.
Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.
@endcomponent
@endcomponent
