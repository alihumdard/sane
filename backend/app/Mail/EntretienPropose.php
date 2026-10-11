<?php

namespace App\Mail;

class EntretienPropose extends EntretienMail
{
    protected function objet(): string
    {
        return "Proposition d'entretien";
    }

    protected function vue(): string
    {
        return 'emails.entretien-propose';
    }
}
