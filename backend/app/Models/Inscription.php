<?php

namespace App\Models;

use App\Enums\StatutInscription;
use App\Enums\TypeParticipation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'edition_id',
        'user_id',
        'type_participation',
        'statut',
        'nom',
        'naissance',
        'email',
        'telephone',
        'genre',
        'nationalite',
        'ville',
        'niveau',
        'statut_pro',
        'domaine',
        'experience',
        'parcours',
        'interets',
        'source',
        'newsletter',
        'consentement',
        'confirmee_le',
        'confirmee_par',
        'note_admin',
        'places_liberees',
        'places_liberees_le',
    ];

    protected function casts(): array
    {
        return [
            'naissance' => 'date',
            'interets' => 'array',
            'newsletter' => 'boolean',
            'consentement' => 'boolean',
            'places_liberees' => 'boolean',
            'confirmee_le' => 'datetime',
            'places_liberees_le' => 'datetime',
            'type_participation' => TypeParticipation::class,
            'statut' => StatutInscription::class,
        ];
    }

    public function edition(): BelongsTo
    {
        return $this->belongsTo(Edition::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function confirmeePar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmee_par');
    }

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'inscription_formation')->withTimestamps();
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DocumentInscription::class);
    }

    public function scopeStatut(Builder $query, StatutInscription $statut): Builder
    {
        return $query->where('statut', $statut->value);
    }

    /** Sequential per edition: #INS2026-0001. */
    public static function genererReference(Edition $edition): string
    {
        $dernier = static::where('edition_id', $edition->id)->max('id') ?? 0;

        return sprintf('#INS%d-%04d', $edition->annee, $dernier + 1);
    }
}
