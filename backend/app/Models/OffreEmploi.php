<?php

namespace App\Models;

use App\Enums\StatutOffre;
use App\Enums\TypeContrat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class OffreEmploi extends Model
{
    use HasFactory;

    protected $table = 'offres_emploi';

    protected $fillable = [
        'entreprise_id', 'titre', 'slug', 'description', 'missions',
        'profil_recherche', 'type_contrat', 'secteur', 'ville',
        'salaire_min', 'salaire_max', 'experience_requise', 'niveau_etude',
        'date_limite', 'statut', 'publiee_le',
    ];

    protected function casts(): array
    {
        return [
            'type_contrat' => TypeContrat::class,
            'statut' => StatutOffre::class,
            'date_limite' => 'date',
            'publiee_le' => 'datetime',
            'salaire_min' => 'integer',
            'salaire_max' => 'integer',
            'vues' => 'integer',
            'candidatures_count' => 'integer',
        ];
    }

    protected $appends = ['expiree', 'ouverte'];

    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class, 'offre_id');
    }

    public function getExpireeAttribute(): bool
    {
        return $this->date_limite !== null && $this->date_limite->isPast();
    }

    /**
     * Published, not past its deadline — the only state that accepts
     * applications. Guarded because a caller may have selected a subset of
     * columns, leaving `statut` absent rather than false.
     */
    public function getOuverteAttribute(): bool
    {
        return $this->statut === StatutOffre::Publiee && ! $this->expiree;
    }

    /** What the public job board may show. */
    public function scopePubliques(Builder $query): Builder
    {
        return $query->where('statut', StatutOffre::Publiee->value)
            ->where(fn (Builder $q) => $q->whereNull('date_limite')->orWhere('date_limite', '>=', now()->toDateString()));
    }

    protected static function booted(): void
    {
        static::creating(function (self $offre) {
            $offre->slug ??= static::slugUnique($offre->titre);
        });
    }

    private static function slugUnique(string $titre): string
    {
        $base = Str::slug($titre);
        $slug = $base;
        $n = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.(++$n);
        }

        return $slug;
    }
}
