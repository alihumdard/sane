<?php

namespace App\Models;

use App\Enums\TypeDocument;
use App\Services\GestionDocuments;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentCandidature extends Model
{
    use HasFactory;

    protected $table = 'documents_candidature';

    protected $fillable = [
        'profil_id', 'type', 'nom_original', 'chemin', 'mime', 'taille', 'principal',
    ];

    protected function casts(): array
    {
        return [
            'type' => TypeDocument::class,
            'taille' => 'integer',
            'principal' => 'boolean',
        ];
    }

    public function profil(): BelongsTo
    {
        return $this->belongsTo(ProfilDemandeur::class, 'profil_id');
    }

    /** Private disk, like every other personal document — never a public URL. */
    public function contenu(): StreamedResponse
    {
        return Storage::disk(GestionDocuments::DISQUE)->download($this->chemin, $this->nom_original);
    }

    public function tailleLisible(): string
    {
        return $this->taille >= 1048576
            ? round($this->taille / 1048576, 1).' Mo'
            : max(1, (int) round($this->taille / 1024)).' Ko';
    }
}
