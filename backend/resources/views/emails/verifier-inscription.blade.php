@component('mail::message')
# Confirmez votre inscription

Bonjour {{ $inscription->nom }},

Votre demande d'inscription au **Salon National de l'Emploi** a bien été reçue.
Il reste une étape : confirmer que cette adresse email est bien la vôtre.

@component('mail::button', ['url' => $lien])
Confirmer mon inscription
@endcomponent

@component('mail::panel')
**Votre inscription n'est pas encore définitive.**
@if ($aDesFormations)
Vos places de formation seront réservées au moment où vous cliquerez sur ce lien.
@endif
Ce lien est valable {{ $heures }} heures.
@endcomponent

Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :

{{ $lien }}

Référence de votre demande : {{ $inscription->reference }}

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce qu'une inscription au SANEM a été déposée avec cette adresse.
Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message : sans
confirmation, la demande sera supprimée.
@endcomponent
@endcomponent
