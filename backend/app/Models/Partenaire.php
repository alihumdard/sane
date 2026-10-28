<?php

namespace App\Models;

use App\Models\Concerns\GenereUnSlug;
use App\Support\Fichier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    use GenereUnSlug, HasFactory;

    protected $fillable = [
        'nom', 'slug', 'type', 'logo', 'site_web', 'description', 'ordre', 'publie',
    ];

    protected $appends = ['logo_url'];

    protected function casts(): array
    {
        return [
            'publie' => 'boolean',
            'ordre' => 'integer',
        ];
    }

    protected function colonneSource(): string
    {
        return 'nom';
    }

    public function scopePublics(Builder $query): Builder
    {
        return $query->where('publie', true)->orderBy('ordre')->orderBy('nom');
    }

    /** The logo as a browser can fetch it; see App\Support\Fichier. */
    public function getLogoUrlAttribute(): ?string
    {
        return Fichier::url($this->logo);
    }
}
