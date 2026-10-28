<?php

namespace App\Models;

use App\Models\Concerns\GenereUnSlug;
use App\Support\Fichier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actualite extends Model
{
    use GenereUnSlug, HasFactory;

    protected $table = 'actualites';

    protected $fillable = [
        'titre', 'slug', 'categorie', 'extrait', 'contenu',
        'image', 'auteur', 'publiee', 'publiee_le',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'publiee' => 'boolean',
            'publiee_le' => 'datetime',
            'vues' => 'integer',
        ];
    }

    /** What the public site may show. */
    public function scopePubliques(Builder $query): Builder
    {
        return $query->where('publiee', true)
            ->whereNotNull('publiee_le')
            ->where('publiee_le', '<=', now())
            ->orderByDesc('publiee_le');
    }

    /** The cover as a browser can fetch it; see App\Support\Fichier. */
    public function getImageUrlAttribute(): ?string
    {
        return Fichier::url($this->image);
    }
}
