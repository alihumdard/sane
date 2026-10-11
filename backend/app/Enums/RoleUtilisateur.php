<?php

namespace App\Enums;

enum RoleUtilisateur: string
{
    case Participant = 'participant';
    case Demandeur = 'demandeur';
    case Entreprise = 'entreprise';
    case Recruteur = 'recruteur';
    case Organisateur = 'organisateur';
    case Administrateur = 'administrateur';

    public function label(): string
    {
        return match ($this) {
            self::Participant => 'Participant',
            self::Demandeur => "Demandeur d'emploi",
            self::Entreprise => 'Entreprise',
            self::Recruteur => 'Recruteur',
            self::Organisateur => 'Organisateur',
            self::Administrateur => 'Administrateur',
        };
    }

    /** Roles a visitor may self-assign when creating an account. */
    public static function inscriptionPublique(): array
    {
        return [self::Demandeur->value, self::Recruteur->value];
    }

    /** Back-office access — mirrors the `role:` middleware on admin routes. */
    public function estAdministratif(): bool
    {
        return in_array($this, [self::Organisateur, self::Administrateur], true);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
