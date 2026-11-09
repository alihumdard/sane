@component('mail::message')
# Confirmez votre adresse email

Bonjour {{ $user->name }},

Un compte vient d'être créé avec cette adresse sur la plateforme du
**Salon National de l'Emploi**. Il reste une étape : confirmer que cette adresse
est bien la vôtre.

@component('mail::button', ['url' => $lien])
Confirmer mon adresse
@endcomponent

@component('mail::panel')
**Tant que votre adresse n'est pas confirmée, vous ne pouvez pas vous connecter.**
Ce lien est valable {{ $heures }} heures.
@endcomponent

Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :

{{ $lien }}

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce qu'un compte vient d'être créé avec cette adresse sur la
plateforme du SANEM. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement
ce message : sans confirmation, le compte restera inutilisable.
@endcomponent
@endcomponent
