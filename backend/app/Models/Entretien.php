<?php

namespace App\Models;

use App\Enums\StatutEntretien;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entretien extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'candidature_id', 'creneau_id', 'statut',
        'lien_visio', 'note', 'motif_annulation', 'confirme_le', 'rappel_envoye_le',
    ];

    protected function casts(): array
    {
        return [
            'statut' => StatutEntretien::class,
            'confirme_le' => 'datetime',
            'rappel_envoye_le' => 'datetime',
        ];
    }

    public function candidature(): BelongsTo
    {
        return $this->belongsTo(Candidature::class);
    }

    public function creneau(): BelongsTo
    {
        return $this->belongsTo(CreneauEntretien::class, 'creneau_id');
    }

    /**
     * Due a reminder: confirmed, starting within the day, not yet reminded.
     * Matches the index on (statut, rappel_envoye_le).
     */
    public function scopeARappeler(Builder $query): Builder
    {
        return $query->where('statut', StatutEntretien::Confirme->value)
            ->whereNull('rappel_envoye_le')
            ->whereHas('creneau', fn (Builder $c) => $c
                ->whereBetween('debut', [now(), now()->addDay()]));
    }

    public static function genererReference(): string
    {
        return sprintf('#ENT%d-%04d', now()->year, (static::max('id') ?? 0) + 1);
    }
}
