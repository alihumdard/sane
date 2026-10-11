@component('mail::message')
# Entretien annulé

Bonjour {{ $candidat->name }},

L'entretien prévu avec **{{ $entreprise->nom }}** pour le poste de
**{{ $offre->titre }}** a été annulé.

@component('mail::panel')
Créneau initialement prévu :
**{{ $creneau->debut->translatedFormat('l j F Y') }} à {{ $creneau->debut->format('H\hi') }}**
@endcomponent

@if ($entretien->motif_annulation)
**Motif :** {{ $entretien->motif_annulation }}
@endif

Votre candidature reste active. L'entreprise peut vous proposer un nouveau créneau.

@component('mail::button', ['url' => config('app.frontend_url') . '/dashboard/participant'])
Suivre ma candidature
@endcomponent

Cordialement,<br>
L'équipe {{ config('app.name') }}
@endcomponent
