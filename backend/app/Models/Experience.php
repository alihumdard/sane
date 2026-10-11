<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'profil_id', 'poste', 'entreprise', 'lieu',
        'date_debut', 'date_fin', 'en_poste', 'description',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
            'en_poste' => 'boolean',
        ];
    }

    public function profil(): BelongsTo
    {
        return $this->belongsTo(ProfilDemandeur::class, 'profil_id');
    }

    /** Whole months worked, used by the Phase 7 experience criterion. */
    public function dureeEnMois(): int
    {
        // diffInMonths returns a float in Carbon 3; floor rather than let PHP
        // truncate implicitly, which is deprecated.
        return (int) floor($this->date_debut->diffInMonths($this->date_fin ?? now()));
    }
}
