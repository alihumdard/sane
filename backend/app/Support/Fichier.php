<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Turns what an image column holds into something a browser can fetch.
 *
 * Two kinds of value live in those columns. Content seeded with the site
 * points at files shipped with the frontend — "/sane-deal3.webp" — while
 * anything an organiser uploaded is a path on the public disk, with no
 * leading slash: "partenaires/9f3c.webp".
 *
 * The second kind was handed to the pages unchanged. `next/image` refuses a
 * relative path outright, so a partner logo or a course visual uploaded from
 * the back-office took down the page it appeared on. Three places had written
 * this conversion out by hand and three had not.
 */
final class Fichier
{
    public static function url(?string $chemin): ?string
    {
        if (blank($chemin)) {
            return null;
        }

        if (str_starts_with($chemin, 'http') || str_starts_with($chemin, '/')) {
            return $chemin;
        }

        return Storage::disk('public')->url($chemin);
    }
}
