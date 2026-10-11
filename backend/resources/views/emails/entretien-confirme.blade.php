@component('mail::message')
# Votre entretien est confirmé

Bonjour {{ $candidat->name }},

Votre présence à l'entretien avec **{{ $entreprise->nom }}** est bien enregistrée.

@component('mail::panel')
**{{ $creneau->debut->translatedFormat('l j F Y') }} à {{ $creneau->debut->format('H\hi') }}**

{{ $creneau->mode->label() }}@if ($creneau->lieu) — {{ $creneau->lieu }}@endif
@endcomponent

@component('mail::table')
| | |
|:--------------|:---------------------------------|
| **Référence** | {{ $entretien->reference }} |
| **Poste**     | {{ $offre->titre }} |
@if ($entretien->lien_visio)
| **Lien**      | {{ $entretien->lien_visio }} |
@endif
@endcomponent

Vous recevrez un rappel la veille. Préparez vos documents et présentez-vous quelques
minutes en avance.

@component('mail::button', ['url' => config('app.frontend_url') . '/dashboard/participant'])
Voir mon entretien
@endcomponent

Bonne préparation,<br>
L'équipe {{ config('app.name') }}
@endcomponent
