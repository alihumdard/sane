<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormationAcademique extends Model
{
    use HasFactory;

    protected $table = 'formations_academiques';

    protected $fillable = [
        'profil_id', 'diplome', 'etablissement', 'domaine',
        'annee_debut', 'annee_fin', 'en_cours',
    ];

    protected function casts(): array
    {
        return [
            'annee_debut' => 'integer',
            'annee_fin' => 'integer',
            'en_cours' => 'boolean',
        ];
    }

    public function profil(): BelongsTo
    {
        return $this->belongsTo(ProfilDemandeur::class, 'profil_id');
    }
}
