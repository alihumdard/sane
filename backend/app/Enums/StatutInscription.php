<?php

namespace App\Enums;

enum StatutInscription: string
{
    case EnAttente = 'en_attente';
    case Confirmee = 'confirmee';
    case Annulee = 'annulee';

    public function label(): string
    {
        return match ($this) {
            self::EnAttente => 'En attente',
            self::Confirmee => 'Confirmée',
            self::Annulee => 'Annulée',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
