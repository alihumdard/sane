<?php

namespace App\Models;

use App\Enums\ModeEntretien;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CreneauEntretien extends Model
{
    use HasFactory;

    protected $table = 'creneaux_entretien';

    protected $fillable = ['entreprise_id', 'debut', 'fin', 'mode', 'lieu', 'reserve'];

    protected function casts(): array
    {
        return [
            'debut' => 'datetime',
            'fin' => 'datetime',
            'mode' => ModeEntretien::class,
            'reserve' => 'boolean',
        ];
    }

    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function entretien(): HasOne
    {
        return $this->hasOne(Entretien::class, 'creneau_id');
    }

    /** Free slots still in the future — the only ones worth offering. */
    public function scopeDisponibles(Builder $query): Builder
    {
        return $query->where('reserve', false)->where('debut', '>', now());
    }

    public function estPasse(): bool
    {
        return $this->debut->isPast();
    }
}
