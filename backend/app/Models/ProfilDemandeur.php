<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfilDemandeur extends Model
{
    use HasFactory;

    protected $table = 'profils_demandeur';

    protected $fillable = [
        'user_id',
        'titre_pro',
        'resume',
        'secteur',
        'ville',
        'type_emploi',
        'disponibilite',
        'linkedin',
        'portfolio',
        'visible',
    ];

    protected function casts(): array
    {
        return [
            'visible' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function competences(): BelongsToMany
    {
        return $this->belongsToMany(Competence::class, 'competence_profil', 'profil_id', 'competence_id')
            ->withPivot('niveau')
            ->withTimestamps();
    }

    public function formations(): HasMany
    {
        return $this->hasMany(FormationAcademique::class, 'profil_id');
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class, 'profil_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DocumentCandidature::class, 'profil_id');
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class, 'profil_id');
    }

    public function favoris(): BelongsToMany
    {
        return $this->belongsToMany(OffreEmploi::class, 'favoris', 'profil_id', 'offre_id')
            ->withTimestamps();
    }

    /** The CV a recruiter sees by default. */
    public function cv(): ?DocumentCandidature
    {
        return $this->documents()
            ->where('type', 'cv')
            ->orderByDesc('principal')
            ->orderByDesc('created_at')
            ->first();
    }

    /** Candidate search never returns profiles that did not opt in. */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('visible', true);
    }

    /**
     * What an application still needs, as keys the interface can label.
     *
     * One list for two readers: the offer page says so before the visitor
     * writes a covering letter, and GestionCandidatures refuses on the same
     * answer — kept here so the two cannot drift apart.
     *
     * A CV, and enough on the profile for a recruiter to place the person:
     * a title, a sector and a city. Schooling is asked for but not demanded —
     * a self-taught applicant has none to declare.
     *
     * @param  int|null  $cvDocumentId  A CV carried by the application itself.
     * @return list<string>
     */
    public function manquePourPostuler(?int $cvDocumentId = null): array
    {
        $informations = filled($this->titre_pro)
            && filled($this->secteur)
            && filled($this->ville);

        return array_values(array_filter([
            ($cvDocumentId === null && $this->cv() === null) ? 'cv' : null,
            $informations ? null : 'informations',
        ]));
    }

    /** Rough completeness signal, shown to the candidate to nudge them. */
    public function tauxCompletion(): int
    {
        $criteres = [
            filled($this->titre_pro),
            filled($this->resume),
            filled($this->secteur),
            filled($this->ville),
            $this->competences()->exists(),
            $this->formations()->exists(),
            $this->experiences()->exists(),
            $this->documents()->where('type', 'cv')->exists(),
        ];

        return (int) round(count(array_filter($criteres)) / count($criteres) * 100);
    }
}
