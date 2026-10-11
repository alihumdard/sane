@component('mail::message')
# Rappel : votre entretien a lieu demain

Bonjour {{ $candidat->name }},

Un rappel pour votre entretien avec **{{ $entreprise->nom }}**.

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

Si un imprévu vous empêche d'être présent(e), prévenez l'entreprise au plus tôt depuis
votre espace candidat.

@component('mail::button', ['url' => config('app.frontend_url') . '/dashboard/participant'])
Voir mon entretien
@endcomponent

Bonne chance,<br>
L'équipe {{ config('app.name') }}
@endcomponent
