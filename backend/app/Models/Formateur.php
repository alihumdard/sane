<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'fonction',
        'organisation',
        'bio',
        'photo',
    ];

    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class);
    }
}
