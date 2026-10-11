<?php

namespace App\Enums;

enum TypeContrat: string
{
    case Cdi = 'cdi';
    case Cdd = 'cdd';
    case Stage = 'stage';
    case Consultant = 'consultant';
    case Alternance = 'alternance';

    public function label(): string
    {
        return match ($this) {
            self::Cdi => 'CDI',
            self::Cdd => 'CDD',
            self::Stage => 'Stage',
            self::Consultant => 'Consultant',
            self::Alternance => 'Alternance',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
