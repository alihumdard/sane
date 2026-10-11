<?php

namespace App\Mail;

class EntretienAnnule extends EntretienMail
{
    protected function objet(): string
    {
        return 'Entretien annulé';
    }

    protected function vue(): string
    {
        return 'emails.entretien-annule';
    }
}
