@component('mail::message')
# Rappel : un entretien a lieu demain

Bonjour,

Rappel de votre entretien prévu avec **{{ $candidat->name }}** pour le poste de
**{{ $offre->titre }}**.

@component('mail::panel')
**{{ $creneau->debut->translatedFormat('l j F Y') }} à {{ $creneau->debut->format('H\hi') }}**

{{ $creneau->mode->label() }}@if ($creneau->lieu) — {{ $creneau->lieu }}@endif
@endcomponent

@component('mail::table')
| | |
|:--------------|:---------------------------------|
| **Référence** | {{ $entretien->reference }} |
| **Candidat**  | {{ $candidat->name }} |
@if ($entretien->lien_visio)
| **Lien**      | {{ $entretien->lien_visio }} |
@endif
@endcomponent

@component('mail::button', ['url' => config('app.frontend_url') . '/dashboard/recruteur/entretiens'])
Voir l'entretien
@endcomponent

Cordialement,<br>
L'équipe {{ config('app.name') }}
@endcomponent
