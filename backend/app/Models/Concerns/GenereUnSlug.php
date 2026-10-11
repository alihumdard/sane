<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * Slug derived from a title on first save, made unique with a numeric suffix.
 *
 * Pulled out of Entreprise and OffreEmploi, which each carried their own copy
 * of this before the content models needed it a third and fourth time.
 */
trait GenereUnSlug
{
    protected static function bootGenereUnSlug(): void
    {
        static::creating(function (self $modele) {
            $modele->slug ??= static::slugUnique($modele->{$modele->colonneSource()});
        });
    }

    /** The attribute the slug is built from; override where it is not `titre`. */
    protected function colonneSource(): string
    {
        return 'titre';
    }

    public static function slugUnique(string $texte): string
    {
        $base = Str::slug($texte) ?: 'element';
        $slug = $base;
        $n = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.(++$n);
        }

        return $slug;
    }
}
