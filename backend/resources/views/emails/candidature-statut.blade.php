@component('mail::message')
# Votre candidature a été mise à jour

Bonjour {{ $user->name }},

Votre candidature pour le poste de **{{ $offre->titre }}**@if ($offre->entreprise) chez
**{{ $offre->entreprise->nom }}**@endif vient de changer de statut.

@component('mail::panel')
**{{ $statut->label() }}**

{{ $message }}
@endcomponent

@component('mail::button', ['url' => $lienSuivi])
@if ($statut === App\Enums\StatutCandidature::Entretien)
Choisir mon créneau
@else
Voir ma candidature
@endif
@endcomponent

Référence : {{ $candidature->reference }}

Cordialement,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce que vous avez postulé à une offre sur la plateforme du SANEM.
@endcomponent
@endcomponent
