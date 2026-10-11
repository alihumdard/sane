<?php

namespace App\Enums;

enum ModeEntretien: string
{
    case Presentiel = 'presentiel';
    case Visio = 'visio';
    case Telephone = 'telephone';

    public function label(): string
    {
        return match ($this) {
            self::Presentiel => 'Présentiel',
            self::Visio => 'Visioconférence',
            self::Telephone => 'Téléphone',
        };
    }

    public function demandeUnLieu(): bool
    {
        return $this === self::Presentiel;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
