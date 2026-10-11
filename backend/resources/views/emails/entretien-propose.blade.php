@component('mail::message')
# Vous êtes convié(e) à un entretien

Bonjour {{ $candidat->name }},

**{{ $entreprise->nom }}** souhaite vous rencontrer au sujet de votre candidature
au poste de **{{ $offre->titre }}**.

@component('mail::panel')
**{{ $creneau->debut->translatedFormat('l j F Y') }} à {{ $creneau->debut->format('H\hi') }}**

{{ $creneau->mode->label() }}@if ($creneau->lieu) — {{ $creneau->lieu }}@endif
@endcomponent

@component('mail::table')
| | |
|:--------------|:---------------------------------|
| **Référence** | {{ $entretien->reference }} |
| **Poste**     | {{ $offre->titre }} |
| **Entreprise**| {{ $entreprise->nom }} |
| **Durée**     | {{ $creneau->debut->diffInMinutes($creneau->fin) }} minutes |
@if ($entretien->lien_visio)
| **Lien**      | {{ $entretien->lien_visio }} |
@endif
@endcomponent

Merci de confirmer votre présence depuis votre espace candidat. Si ce créneau ne vous
convient pas, annulez-le : il sera proposé à nouveau et l'entreprise pourra vous en
soumettre un autre.

@component('mail::button', ['url' => config('app.frontend_url') . '/dashboard/participant'])
Confirmer ma présence
@endcomponent

À bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Entretien {{ $entretien->reference }}. Pour toute question, répondez à ce message en
rappelant cette référence.
@endcomponent
@endcomponent
