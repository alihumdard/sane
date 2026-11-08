@component('mail::message')
# Votre entreprise est validée

Bonjour {{ $user->name }},

Le profil de **{{ $entreprise->nom }}** vient d'être vérifié par les organisateurs du
Salon National de l'Emploi.

Vous pouvez dès maintenant publier vos offres d'emploi : elles apparaîtront sur le site
et seront visibles par les candidats.

@component('mail::button', ['url' => $lienOffres])
Publier une offre
@endcomponent

@component('mail::panel')
Si vous aviez déjà préparé des offres, elles sont restées en brouillon le temps de la
vérification. Ouvrez-les et publiez-les depuis votre espace.
@endcomponent

À très bientôt,<br>
L'équipe {{ config('app.name') }}

@component('mail::subcopy')
Vous recevez cet email parce que vous êtes recruteur pour {{ $entreprise->nom }} sur la
plateforme du SANEM.
@endcomponent
@endcomponent
