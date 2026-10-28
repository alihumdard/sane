<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Single-row organisation settings: one record, read and updated in place. */
class ParametrePlateforme extends Model
{
    protected $fillable = [
        'nom', 'email', 'telephone', 'adresse', 'site_web', 'description', 'logo',
        'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
    ];

    /** The social accounts, in the order the icons are shown. */
    public const RESEAUX = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

    protected $appends = ['logo_url'];

    public function logoUrl(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->logo ? \Illuminate\Support\Facades\Storage::disk('public')->url($this->logo) : null,
        );
    }

    /** The one row, created with sensible defaults the first time anyone asks. */
    public static function instance(): self
    {
        return static::first() ?? static::create([
            'nom' => config('app.name'),
            'email' => config('mail.from.address'),
        ]);
    }
}
