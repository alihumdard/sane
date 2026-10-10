<?php

namespace App\Mail;

class InscriptionRecue extends InscriptionMail
{
    protected function objet(): string
    {
        return 'Votre inscription au SANEM';
    }

    protected function vue(): string
    {
        return 'emails.inscription-recue';
    }
}
