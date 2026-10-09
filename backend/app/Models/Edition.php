<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Edition extends Model
{
    use HasFactory;

    protected $fillable = [
        'annee',
        'nom',
        'date_debut',
        'date_fin',
        'lieu',
        'active',
        'inscriptions_ouvertes',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
            'active' => 'boolean',
            'inscriptions_ouvertes' => 'boolean',
        ];
    }

    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class);
    }

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    public static function active(): ?self
    {
        return static::where('active', true)->first();
    }
}
