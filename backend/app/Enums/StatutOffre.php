<?php

namespace App\Enums;

enum StatutOffre: string
{
    case Brouillon = 'brouillon';
    case Publiee = 'publiee';
    case Pourvue = 'pourvue';
    case Expiree = 'expiree';
    case Fermee = 'fermee';

    public function label(): string
    {
        return match ($this) {
            self::Brouillon => 'Brouillon',
            self::Publiee => 'Publiée',
            self::Pourvue => 'Pourvue',
            self::Expiree => 'Expirée',
            self::Fermee => 'Fermée',
        };
    }

    /** Only a published, unexpired offer is visible publicly and open to applications. */
    public function accepteCandidatures(): bool
    {
        return $this === self::Publiee;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
