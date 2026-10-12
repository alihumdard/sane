<?php

namespace App\Models;

use App\Enums\TypeDocument;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
     * Served through the API rather than linked directly: these are identity
     * papers and CVs, and the storage disk is private so a guessed path leads
     * nowhere.
     */
    public function url(): string
    {
        return route('documents.telecharger', [
            'inscription' => $this->inscription_id,
            'document' => $this->id,
        ]);
    }
}
