<?php

namespace App\Models;

use App\Enums\StatutInscription;
use App\Enums\TypeParticipation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'edition_id',
        'user_id',
        'type_participation',
        'statut',
        'nom',
        'naissance',
        'email',
        'telephone',
        'genre',
        'nationalite',
        'ville',
        'niveau',
        'statut_pro',
        'domaine',
        'experience',
        'parcours',
        'interets',
        'source',
        'newsletter',
        'consentement',
        'confirmee_le',
        'confirmee_par',
        'note_admin',
        'places_liberees',
        'places_liberees_le',
        'email_verifie_le',
        'jeton_verification',
        'jeton_expire_le',
        'formations_demandees',
        'ip_creation',
        'envois_verification',
    ];

    protected $hidden = [
        // Même haché, le jeton n'a rien à faire dans une réponse d'API : il ne
        // sert qu'au lien du courrier.
        'jeton_verification',
    ];

    protected function casts(): array
    {
        return [
            'naissance' => 'date',
            'interets' => 'array',
            'formations_demandees' => 'array',
            'newsletter' => 'boolean',
            'consentement' => 'boolean',
            'places_liberees' => 'boolean',
            'confirmee_le' => 'datetime',
            'places_liberees_le' => 'datetime',
            'email_verifie_le' => 'datetime',
            'jeton_expire_le' => 'datetime',
            'type_participation' => TypeParticipation::class,
            'statut' => StatutInscription::class,
        ];
    }

    public function estVerifiee(): bool
    {
        return $this->email_verifie_le !== null;
    }

    /**
     * Les inscriptions qui attendent encore leur confirmation — ce que le
     * back-office montre dans son encart anti-abus, et ce que la purge
     * quotidienne balaye au-delà du délai.
     */
    public function scopeNonVerifiees(Builder $query): Builder
    {
        return $query->whereNull('email_verifie_le');
    }

    public function edition(): BelongsTo
    {
        return $this->belongsTo(Edition::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function confirmeePar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmee_par');
    }

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'inscription_formation')->withPivot('rappel_envoye_le')->withTimestamps();
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DocumentInscription::class);
    }

    public function scopeStatut(Builder $query, StatutInscription $statut): Builder
    {
        return $query->where('statut', $statut->value);
    }

    /**
     * INS2026-0001, derived from the row's own primary key.
     *
     * Built after the insert rather than before it: reading `max(id)` first
     * takes no lock, so two simultaneous registrations would compute the same
     * reference and the second would fail the unique index with a 500. The
     * sequence already guarantees a distinct id, so the reference inherits
     * that guarantee for free.
     *
     * No leading "#" — the reference appears in URLs, where a hash would be
     * read as a fragment and never reach the server.
     */
    public function construireReference(): string
    {
        return sprintf('INS%d-%04d', $this->edition->annee, $this->id);
    }
}
