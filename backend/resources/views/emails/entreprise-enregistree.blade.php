@component('mail::message')
# Votre profil entreprise est enregistré

Bonjour {{ $user->name }},

Le profil de **{{ $entreprise->nom }}** a bien été enregistré sur la plateforme du
Salon National de l'Emploi.

@component('mail::panel')
**Prochaine étape : la vérification.**

Les organisateurs examinent votre dossier. Tant qu'il n'est pas validé, vous pouvez
préparer vos offres, mais elles ne seront pas encore visibles par les candidats.
@endcomponent

Vous recevrez un email dès que votre entreprise sera validée.

@component('mail::button', ['url' => $lienEspace])
Accéder à mon espace
@endcomponent

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce qu'un profil entreprise a été créé depuis votre compte sur la
plateforme du SANEM.
@endcomponent
@endcomponent
