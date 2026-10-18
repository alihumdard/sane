@component('mail::message')
# Réinitialisation de votre mot de passe

Bonjour {{ $user->name }},

Vous avez demandé la réinitialisation du mot de passe de votre compte SANEM. Cliquez sur le
bouton ci-dessous pour choisir un nouveau mot de passe.

@component('mail::button', ['url' => $lien])
Réinitialiser mon mot de passe
@endcomponent

Ce lien expire dans 60 minutes. Si vous n'êtes pas à l'origine de cette demande, aucune action
n'est nécessaire — votre mot de passe actuel reste valide.

Merci,<br>
L'équipe {{ config('app.name') }}
@endcomponent
