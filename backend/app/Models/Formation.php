<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'edition_id',
        'categorie_id',
        'formateur_id',
        'titre',
        'slug',
        'description',
        'prerequis',
        'duree',
        'lieu',
        'niveau',
        'format',
        'image',
        'date_debut',
        'date_fin',
        'max_inscriptions',
        'inscriptions_count',
        'publiee',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
            'max_inscriptions' => 'integer',
            'inscriptions_count' => 'integer',
            'publiee' => 'boolean',
        ];
    }

    protected $appends = ['places_restantes', 'complete', 'taux_remplissage'];

    public function edition(): BelongsTo
    {
        return $this->belongsTo(Edition::class);
    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(CategorieFormation::class, 'categorie_id');
    }

    public function formateur(): BelongsTo
    {
        return $this->belongsTo(Formateur::class);
    }

    public function inscriptions(): BelongsToMany
    {
        return $this->belongsToMany(Inscription::class, 'inscription_formation')->withTimestamps();
    }

    public function getPlacesRestantesAttribute(): int
    {
        return max(0, (int) $this->max_inscriptions - (int) $this->inscriptions_count);
    }

    public function getCompleteAttribute(): bool
    {
        return $this->places_restantes === 0;
    }

    /**
     * Percentage filled, rounded — the admin table's `inscPct`, derived rather
     * than stored. Guards against null as well as zero, since a partial select
     * can leave the counts absent.
     */
    public function getTauxRemplissageAttribute(): int
    {
        if (empty($this->max_inscriptions)) {
            return 0;
        }

        return (int) round($this->inscriptions_count / $this->max_inscriptions * 100);
    }

    public function scopePubliee(Builder $query): Builder
    {
        return $query->where('publiee', true);
    }

    public function scopePourEdition(Builder $query, int $editionId): Builder
    {
        return $query->where('edition_id', $editionId);
    }
}
