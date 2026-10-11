<?php

namespace App\Mail;

class EntretienConfirme extends EntretienMail
{
    protected function objet(): string
    {
        return 'Entretien confirmé';
    }

    protected function vue(): string
    {
        return 'emails.entretien-confirme';
    }
}
