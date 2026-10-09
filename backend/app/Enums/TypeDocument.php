<?php

namespace App\Enums;

enum TypeDocument: string
{
    case PieceIdentite = 'piece_identite';
    case Cv = 'cv';
    case LettreMotivation = 'lettre_motivation';
    case Photo = 'photo';

    public function label(): string
    {
        return match ($this) {
            self::PieceIdentite => "Pièce d'identité",
            self::Cv => 'CV à jour',
            self::LettreMotivation => 'Lettre de motivation',
            self::Photo => "Photo d'identité",
        };
    }

    public function obligatoire(): bool
    {
        return $this !== self::LettreMotivation;
    }

    /** Validation rule fragment, mirrors the constraints shown on the public page. */
    public function mimes(): string
    {
        return match ($this) {
            self::PieceIdentite => 'pdf,jpg,jpeg',
            self::Cv, self::LettreMotivation => 'pdf',
            self::Photo => 'jpg,jpeg,png',
        };
    }

    public const TAILLE_MAX_KO = 2048;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
