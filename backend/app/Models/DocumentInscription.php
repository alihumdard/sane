<?php

namespace App\Models;

use App\Enums\TypeDocument;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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

    public function url(): string
    {
        return Storage::url($this->chemin);
    }
}
