<?php

namespace App\Enums;

enum TypeParticipation: string
{
    case Visiteur = 'visiteur';
    case ParticipantFormation = 'participant_formation';
    case Entreprise = 'entreprise';
    case Recruteur = 'recruteur';

    public function label(): string
    {
        return match ($this) {
            self::Visiteur => 'Visiteur',
            self::ParticipantFormation => 'Participant formation',
            self::Entreprise => 'Entreprise',
            self::Recruteur => 'Recruteur',
        };
    }

    /** Only these types may select formations. */
    public function peutChoisirFormations(): bool
    {
        return $this === self::ParticipantFormation;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
