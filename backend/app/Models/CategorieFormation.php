<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategorieFormation extends Model
{
    use HasFactory;

    protected $table = 'categories_formation';

    protected $fillable = ['nom', 'slug', 'ordre'];

    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class, 'categorie_id');
    }
}
