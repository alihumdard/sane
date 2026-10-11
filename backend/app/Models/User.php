<?php

namespace App\Models;

use App\Enums\RoleUtilisateur;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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

    public function entreprisesMembre(): BelongsToMany
    {
        return $this->belongsToMany(Entreprise::class, 'membres_entreprise')
            ->withPivot('role_interne')
            ->withTimestamps();
    }

    /**
     * The company this user acts for — either the one they own, or one they
     * were added to as a recruiter. Every company-scoped authorization check
     * resolves through here, so there is a single definition of "my company".
     *
     * Memoised per instance: the policies call it on each check within a
     * request, and it must not re-query every time.
     */
    public function entrepriseActive(): ?Entreprise
    {
        if (! array_key_exists('entreprise_active', $this->memo)) {
            $this->memo['entreprise_active'] = $this->entreprise
                ?? $this->entreprisesMembre()->first();
        }

        return $this->memo['entreprise_active'];
    }

    /** @var array<string, mixed> Not persisted; request-scoped lookups only. */
    protected array $memo = [];

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
