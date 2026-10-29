<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class Entreprise extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'nom', 'slug', 'secteur', 'taille', 'logo',
        'site_web', 'description', 'ville', 'telephone', 'verifiee',
    ];

    protected function casts(): array
    {
        return [
            'verifiee' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Everyone who acts for this company: its owner and its members. */
    public function recruteurs(): Collection
    {
        return $this->membres()
            ->get()
            ->when($this->user, fn ($liste) => $liste->push($this->user))
            ->filter()
            ->unique('id')
            ->values();
    }

    public function membres(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'membres_entreprise')
            ->withPivot('role_interne')
            ->withTimestamps();
    }

    public function offres(): HasMany
    {
        return $this->hasMany(OffreEmploi::class, 'entreprise_id');
    }

    protected static function booted(): void
    {
        static::creating(function (self $entreprise) {
            $entreprise->slug ??= static::slugUnique($entreprise->nom);
        });
    }

    private static function slugUnique(string $nom): string
    {
        $base = Str::slug($nom);
        $slug = $base;
        $n = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.(++$n);
        }

        return $slug;
    }
}
