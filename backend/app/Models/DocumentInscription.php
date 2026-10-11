<?php

namespace App\Models;

use App\Enums\TypeDocument;
use App\Services\GestionDocuments;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentInscription extends Model
{
    use HasFactory;

    protected $table = 'documents_inscription';

    protected $fillable = [
        'inscription_id',
        'type',
        'nom_original',
        'chemin',
        'mime',
        'taille',
    ];

    protected function casts(): array
    {
        return [
            'type' => TypeDocument::class,
            'taille' => 'integer',
        ];
    }

    public function inscription(): BelongsTo
    {
        return $this->belongsTo(Inscription::class);
    }

    /**
     * Documents hold personal data, so they live on the private disk and are
     * never addressable by URL — reading one goes through the authenticated
     * download route, which is why no url() accessor is offered here.
     */
    public function contenu(): StreamedResponse
    {
        return Storage::disk(GestionDocuments::DISQUE)->download(
            $this->chemin,
            $this->nom_original,
        );
    }

    public function tailleLisible(): string
    {
        return $this->taille >= 1048576
            ? round($this->taille / 1048576, 1).' Mo'
            : max(1, (int) round($this->taille / 1024)).' Ko';
    }
}
