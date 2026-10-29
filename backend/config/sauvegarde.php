<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Où les archives sont écrites
    |--------------------------------------------------------------------------
    |
    | Outside the application directory in production, so redeploying — or a
    | careless rm on the deploy folder — cannot take the backups with it. The
    | default under storage/ is for a developer machine, where there is
    | nowhere else to write.
    |
    */

    'dossier' => env('SAUVEGARDE_DOSSIER', storage_path('sauvegardes')),

    /*
    |--------------------------------------------------------------------------
    | Combien de jours d'archives conserver
    |--------------------------------------------------------------------------
    |
    | By age rather than by count: a week when the scheduler did not run must
    | not silently shorten the history.
    |
    */

    'jours' => (int) env('SAUVEGARDE_JOURS', 14),

];
