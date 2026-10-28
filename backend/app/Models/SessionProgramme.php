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

        // Three kinds of value live in this column: an address the organiser
        // pasted in, a file served from the site itself — the images shipped
        // with the design all start with a slash — and a path on the public
        // disk, which is what an upload leaves behind. Only the last needs
        // the disk's URL; prefixing the others with /storage/ was what left
        // eight broken thumbnails down the programme page.
        if (str_starts_with($this->image, 'http') || str_starts_with($this->image, '/')) {
            return $this->image;
        }

        return Storage::disk('public')->url($this->image);
    }
}
