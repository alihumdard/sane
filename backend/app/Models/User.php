<?php

namespace App\Models;

use App\Enums\RoleUtilisateur;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'telephone',
        'role',
        'statut',
        'photo',
        'password',
        'derniere_connexion_le',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'derniere_connexion_le' => 'datetime',
            'password' => 'hashed',
            'role' => RoleUtilisateur::class,
        ];
    }

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    public function profilDemandeur(): HasOne
    {
        return $this->hasOne(ProfilDemandeur::class);
    }

    public function entreprise(): HasOne
    {
        return $this->hasOne(Entreprise::class);
    }

    /** Created on demand: a jobseeker account has no profile until it is first opened. */
    public function profilDemandeurOuCreer(): ProfilDemandeur
    {
        return $this->profilDemandeur()->firstOrCreate([]);
    }

    public function estAdministrateur(): bool
    {
        return $this->role === RoleUtilisateur::Administrateur;
    }

    public function peutGererInscriptions(): bool
    {
        return in_array($this->role, [
            RoleUtilisateur::Administrateur,
            RoleUtilisateur::Organisateur,
        ], true);
    }
}
