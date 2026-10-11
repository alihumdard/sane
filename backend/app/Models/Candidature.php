<?php

namespace App\Models;

use App\Enums\StatutCandidature;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'offre_id', 'profil_id', 'statut',
        'lettre_motivation', 'cv_document_id', 'note_recruteur', 'statut_modifie_le',
    ];

    protected function casts(): array
    {
        return [
            'statut' => StatutCandidature::class,
            'statut_modifie_le' => 'datetime',
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

    public function entretiens(): HasMany
    {
        return $this->hasMany(Entretien::class);
    }

    public function cv(): BelongsTo
    {
        return $this->belongsTo(DocumentCandidature::class, 'cv_document_id');
    }

    public function scopeStatut(Builder $query, StatutCandidature $statut): Builder
    {
        return $query->where('statut', $statut->value);
    }

    public static function genererReference(): string
    {
        return sprintf('#CAN%d-%04d', now()->year, (static::max('id') ?? 0) + 1);
    }
}
