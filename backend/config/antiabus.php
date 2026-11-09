<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Domaines d'adresses jetables
    |--------------------------------------------------------------------------
    |
    | Volontairement courte et conservatrice. Bloquer large exclurait de vraies
    | personnes : au Niger une partie du public utilise des fournisseurs que
    | nous ne connaissons pas, et une adresse refusée à tort est une inscription
    | perdue sans que personne ne sache pourquoi.
    |
    | Ne figurent ici que des services dont la raison d'être est l'adresse
    | éphémère — pas un fournisseur généraliste obscur.
    |
    */

    'domaines_jetables' => [
        '0-mail.com',
        '10minutemail.com',
        '10minutemail.net',
        '20minutemail.com',
        'discard.email',
        'dispostable.com',
        'emailondeck.com',
        'fakeinbox.com',
        'getairmail.com',
        'getnada.com',
        'guerrillamail.com',
        'guerrillamail.net',
        'guerrillamail.org',
        'inboxbear.com',
        'maildrop.cc',
        'mailinator.com',
        'mailnesia.com',
        'mintemail.com',
        'mohmal.com',
        'moakt.com',
        'sharklasers.com',
        'spam4.me',
        'temp-mail.org',
        'tempmail.com',
        'tempmailo.com',
        'tempr.email',
        'throwawaymail.com',
        'trashmail.com',
        'trashmail.de',
        'yopmail.com',
        'yopmail.fr',
        'yopmail.net',
    ],

    /*
    |--------------------------------------------------------------------------
    | Piège à robots
    |--------------------------------------------------------------------------
    |
    | Le champ est invisible à l'écran et porte un nom banal : un humain ne le
    | voit pas, un robot qui remplit tout ce qu'il trouve le remplit.
    |
    | Rempli, la requête reçoit un faux succès plutôt qu'une erreur. Un 422
    | apprendrait au robot ce qui l'a trahi ; un succès le laisse repartir
    | satisfait sans rien avoir créé.
    |
    */

    'piege' => [
        'champ' => 'site_web',

        // Le formulaire d'inscription au salon compte quatre étapes. Trois
        // secondes ne suffisent pas à les lire, et sont largement sous le
        // temps qu'y passe la personne la plus pressée.
        'delai_minimal' => 3,

        // Au-delà, l'horodatage signé est considéré comme périmé : un robot
        // qui rejoue indéfiniment le même jeton ne passe pas la journée.
        'delai_maximal' => 60 * 60 * 6,
    ],

    /*
    |--------------------------------------------------------------------------
    | Durées de validité
    |--------------------------------------------------------------------------
    |
    | 48 h plutôt qu'une heure : qui s'inscrit le vendredi soir ouvre son
    | courrier le lundi, et un lien mort au premier essai se lit comme un site
    | cassé. Le lien étant signé (comptes) ou tiré au hasard sur 64 caractères
    | (inscriptions), sa durée ne change rien à sa sûreté.
    |
    */

    'verification' => [
        'heures' => 48,

        // Les lignes jamais confirmées sont purgées après ce délai. Plus long
        // que la validité du jeton : la ligne reste visible en back-office
        // quelques jours, le temps qu'un organisateur relance la personne.
        'purge_jours' => 7,

        // Nombre d'emails de confirmation qu'une même inscription peut
        // déclencher, renvois compris.
        'envois_max' => 5,
    ],

];
