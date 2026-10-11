<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticlePresse extends Model
{
    use HasFactory;

    protected $table = 'articles_presse';

    protected $fillable = [
        'titre', 'media', 'type', 'date_publication', 'lien', 'fichier', 'resume', 'publie',
    ];

    protected function casts(): array
    {
        return [
            'date_publication' => 'date',
            'publie' => 'boolean',
        ];
    }

    public function scopePublics(Builder $query): Builder
    {
        return $query->where('publie', true)->orderByDesc('date_publication');
    }
}
