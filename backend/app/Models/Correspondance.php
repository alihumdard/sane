<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Correspondance extends Model
{
    use HasFactory;

    protected $fillable = ['offre_id', 'profil_id', 'score', 'details', 'statut'];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'details' => 'array',
        ];
    }

    public function offre(): BelongsTo
    {
        return $this->belongsTo(OffreEmploi::class, 'offre_id');
    }

    public function profil(): BelongsTo
    {
        return $this->belongsTo(ProfilDemandeur::class, 'profil_id');
    }

    public function scopeMeilleures(Builder $query, int $minimum = 0): Builder
    {
        return $query->where('score', '>=', $minimum)->orderByDesc('score');
    }
}
