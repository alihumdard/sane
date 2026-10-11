<?php

namespace App\Mail;

class EntretienRappel extends EntretienMail
{
    protected function objet(): string
    {
        return "Rappel d'entretien";
    }

    protected function vue(): string
    {
        return 'emails.entretien-rappel';
    }
}
