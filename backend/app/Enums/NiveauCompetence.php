<?php

namespace App\Enums;

enum NiveauCompetence: string
{
    case Debutant = 'debutant';
    case Intermediaire = 'intermediaire';
    case Avance = 'avance';
    case Expert = 'expert';

    public function label(): string
    {
        return match ($this) {
            self::Debutant => 'Débutant',
            self::Intermediaire => 'Intermédiaire',
            self::Avance => 'Avancé',
            self::Expert => 'Expert',
        };
    }

    /** Weight used by the Phase 7 matching score. */
    public function poids(): int
    {
        return match ($this) {
            self::Debutant => 1,
            self::Intermediaire => 2,
            self::Avance => 3,
            self::Expert => 4,
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
