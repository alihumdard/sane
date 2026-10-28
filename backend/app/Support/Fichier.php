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

        /*
         * Reduced to a path: "/storage/partenaires/9f3c.webp".
         *
         * The disk builds an absolute URL from ASSET_URL, which names one
         * host — the server's IP, behind a certificate browsers do not trust.
         * The site answers on two names, nginx serves /storage/ under both,
         * and next/image refuses any host not declared in its config. A path
         * is same-origin wherever the page came from, so it needs none of
         * that.
         */
        $url = Storage::disk('public')->url($chemin);

        return parse_url($url, PHP_URL_PATH) ?: $url;
    }
}
