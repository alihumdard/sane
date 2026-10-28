<?php

namespace App\Models;

use App\Support\Fichier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/** One slot of the event's schedule. */
class SessionProgramme extends Model
{
    protected $table = 'sessions_programme';

    protected $fillable = [
        'jour', 'heure_debut', 'heure_fin', 'titre', 'description',
        'categorie', 'lieu', 'intervenants', 'image', 'ordre', 'publiee',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'jour' => 'date',
            'publiee' => 'boolean',
            'ordre' => 'integer',
        ];
    }

    public function scopePubliques(Builder $query): Builder
    {
        return $query->where('publiee', true)
            ->orderBy('jour')
            ->orderBy('heure_debut')
            ->orderBy('ordre');
    }

    /** The session's visual as a browser can fetch it; see App\Support\Fichier. */
    public function getImageUrlAttribute(): ?string
    {
        return Fichier::url($this->image);
    }
}
