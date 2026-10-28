<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        // Already an address when the organiser pasted one in.
        return str_starts_with($this->image, 'http')
            ? $this->image
            : Storage::disk('public')->url($this->image);
    }
}
