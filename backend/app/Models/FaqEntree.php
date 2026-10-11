<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqEntree extends Model
{
    use HasFactory;

    protected $table = 'faq_entrees';

    protected $fillable = ['categorie', 'question', 'reponse', 'ordre', 'publiee'];

    protected function casts(): array
    {
        return [
            'publiee' => 'boolean',
            'ordre' => 'integer',
        ];
    }

    public function scopePubliques(Builder $query): Builder
    {
        return $query->where('publiee', true)->orderBy('categorie')->orderBy('ordre');
    }
}
