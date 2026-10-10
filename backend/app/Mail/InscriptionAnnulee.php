<?php

namespace App\Mail;

class InscriptionAnnulee extends InscriptionMail
{
    protected function objet(): string
    {
        return 'Votre inscription a été annulée';
    }

    protected function vue(): string
    {
        return 'emails.inscription-annulee';
    }

    protected function donnees(): array
    {
        return ['motif' => $this->inscription->note_admin];
    }
}
