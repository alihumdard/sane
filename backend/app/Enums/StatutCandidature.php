<?php

namespace App\Enums;

enum StatutCandidature: string
{
    case Envoyee = 'envoyee';
    case EnRevue = 'en_revue';
    case Preselectionnee = 'preselectionnee';
    case Entretien = 'entretien';
    case Acceptee = 'acceptee';
    case Refusee = 'refusee';

    public function label(): string
    {
        return match ($this) {
            self::Envoyee => 'Envoyée',
            self::EnRevue => 'En revue',
            self::Preselectionnee => 'Présélectionnée',
            self::Entretien => 'Entretien',
            self::Acceptee => 'Acceptée',
            self::Refusee => 'Refusée',
        };
    }

    /** Terminal states: the candidate has had their answer. */
    public function estFinal(): bool
    {
        return in_array($this, [self::Acceptee, self::Refusee], true);
    }

    /** A candidate may withdraw only while nothing has been decided. */
    public function peutEtreRetiree(): bool
    {
        return ! $this->estFinal();
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
