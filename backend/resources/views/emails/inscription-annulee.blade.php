@component('mail::message')
# Votre inscription a été annulée

Bonjour {{ $inscription->nom }},

Votre inscription au **Salon National de l'Emploi {{ $inscription->edition->annee }}**
(référence **{{ $inscription->reference }}**) a été annulée.

@if ($motif)
@component('mail::panel')
{{ $motif }}
@endcomponent
@endif

@if ($formations->isNotEmpty())
Les places que vous aviez réservées sur vos formations ont été libérées et sont de nouveau
disponibles pour d'autres participants.
@endif

Si cette annulation vous semble être une erreur, répondez à cet email en rappelant votre
référence : nous vérifierons votre dossier.

@component('mail::button', ['url' => config('app.frontend_url') . '/inscription'])
Se réinscrire
@endcomponent

Cordialement,<br>
L'équipe {{ config('app.name') }}
@endcomponent
