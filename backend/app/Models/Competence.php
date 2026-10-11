<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Competence extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'slug'];

    public function profils(): BelongsToMany
    {
        return $this->belongsToMany(ProfilDemandeur::class, 'competence_profil', 'competence_id', 'profil_id');
    }

    /** Skills are free-entry on the client side, so the slug deduplicates them. */
    public static function trouverOuCreer(string $nom): self
    {
        return static::firstOrCreate(
            ['slug' => Str::slug($nom)],
            ['nom' => trim($nom)],
        );
    }
}
