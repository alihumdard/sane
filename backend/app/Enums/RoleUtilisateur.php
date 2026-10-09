<?php

namespace App\Enums;

enum RoleUtilisateur: string
{
    case Participant = 'participant';
    case Entreprise = 'entreprise';
    case Recruteur = 'recruteur';
    case Organisateur = 'organisateur';
    case Administrateur = 'administrateur';

    public function label(): string
    {
        return match ($this) {
            self::Participant => 'Participant',
            self::Entreprise => 'Entreprise',
            self::Recruteur => 'Recruteur',
            self::Organisateur => 'Organisateur',
            self::Administrateur => 'Administrateur',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
