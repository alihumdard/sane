<?php

namespace App\Mail;

class InscriptionConfirmee extends InscriptionMail
{
    protected function objet(): string
    {
        return 'Votre inscription est confirmée';
    }

    protected function vue(): string
    {
        return 'emails.inscription-confirmee';
    }
}
