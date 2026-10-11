<?php

namespace App\Enums;

enum StatutEntretien: string
{
    case EnAttente = 'en_attente';
    case Confirme = 'confirme';
    case Termine = 'termine';
    case Annule = 'annule';

    public function label(): string
    {
        return match ($this) {
            self::EnAttente => 'En attente',
            self::Confirme => 'Confirmé',
            self::Termine => 'Terminé',
            self::Annule => 'Annulé',
        };
    }

    public function estFinal(): bool
    {
        return in_array($this, [self::Termine, self::Annule], true);
    }

    /** A slot is only held while the interview may still happen. */
    public function occupeLeCreneau(): bool
    {
        return in_array($this, [self::EnAttente, self::Confirme], true);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
