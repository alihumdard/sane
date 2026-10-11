<?php

namespace App\Services;

use App\Models\Correspondance;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Criteria-based matching between offers and jobseeker profiles.
 *
 * Deliberately not an AI model. Every score decomposes into the criteria that
 * produced it, so a recruiter sees "85 % — same sector, 3 skills in common,
 * same city" rather than a number they have to trust. That is defensible to a
 * candidate who asks why they were ranked where they were, costs nothing to
 * run, and needs no external service.
 *
 * Candidates are drawn in one query and scored in memory: the set is bounded
 * by visible profiles in the offer's sector or city, not the whole table.
 */
class MoteurMatching
{
    /** Weights sum to 100. Sector and skills dominate; the rest refine. */
    private const POIDS = [
        'secteur' => 30,
        'competences' => 25,
        'ville' => 20,
        'experience' => 15,
        'type_contrat' => 10,
    ];

    /** Below this, a suggestion is noise rather than a lead. */
    public const SCORE_MINIMUM = 30;

    /**
     * Recomputes every correspondence for one offer.
     *
     * @return int number of correspondences kept
     */
    public function calculerPourOffre(OffreEmploi $offre): int
    {
        $profils = $this->candidats($offre);

        $lignes = [];

        foreach ($profils as $profil) {
            $resultat = $this->score($offre, $profil);

            if ($resultat['score'] < self::SCORE_MINIMUM) {
                continue;
            }

            $lignes[] = [
                'offre_id' => $offre->id,
                'profil_id' => $profil->id,
                'score' => $resultat['score'],
                'details' => json_encode($resultat['details'], JSON_UNESCAPED_UNICODE),
                'statut' => 'suggere',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::transaction(function () use ($offre, $lignes) {
            // Profiles that no longer qualify must disappear, so the set is
            // replaced rather than merged. Statuses a recruiter set by hand are
            // preserved below.
            $traites = Correspondance::where('offre_id', $offre->id)
                ->where('statut', '!=', 'suggere')
                ->pluck('statut', 'profil_id');

            Correspondance::where('offre_id', $offre->id)->delete();

            foreach (array_chunk($lignes, 200) as $lot) {
                foreach ($lot as &$ligne) {
                    $ligne['statut'] = $traites[$ligne['profil_id']] ?? 'suggere';
                }
                unset($ligne);

                Correspondance::insert($lot);
            }
        });

        return count($lignes);
    }

    /**
     * Scores one pair, returning both the total and why it came out that way.
     *
     * @return array{score: int, details: array<string, mixed>}
     */
    public function score(OffreEmploi $offre, ProfilDemandeur $profil): array
    {
        $details = [];
        $total = 0;

        // Sector — the strongest single signal of relevance.
        $secteurOk = $this->memeTexte($offre->secteur, $profil->secteur);
        if ($secteurOk) {
            $total += self::POIDS['secteur'];
        }
        $details['secteur'] = [
            'obtenu' => $secteurOk ? self::POIDS['secteur'] : 0,
            'max' => self::POIDS['secteur'],
            'raison' => $secteurOk ? "Même secteur : {$offre->secteur}" : 'Secteur différent',
        ];

        // Skills — proportional to how many of the offer's terms the profile hits.
        $competences = $this->scoreCompetences($offre, $profil);
        $total += $competences['obtenu'];
        $details['competences'] = $competences;

        // City.
        $villeOk = $this->memeTexte($offre->ville, $profil->ville);
        if ($villeOk) {
            $total += self::POIDS['ville'];
        }
        $details['ville'] = [
            'obtenu' => $villeOk ? self::POIDS['ville'] : 0,
            'max' => self::POIDS['ville'],
            'raison' => $villeOk ? "Même ville : {$offre->ville}" : 'Ville différente',
        ];

        // Experience.
        $experience = $this->scoreExperience($offre, $profil);
        $total += $experience['obtenu'];
        $details['experience'] = $experience;

        // Contract type the candidate says they are looking for.
        $contratOk = $this->memeTexte($offre->type_contrat?->label(), $profil->type_emploi);
        if ($contratOk) {
            $total += self::POIDS['type_contrat'];
        }
        $details['type_contrat'] = [
            'obtenu' => $contratOk ? self::POIDS['type_contrat'] : 0,
            'max' => self::POIDS['type_contrat'],
            'raison' => $contratOk ? 'Type de contrat recherché' : 'Type de contrat non précisé ou différent',
        ];

        return ['score' => min(100, $total), 'details' => $details];
    }

    /**
     * Candidate pool for an offer.
     *
     * Restricted to visible profiles that share the sector or the city, so the
     * scored set stays small however many profiles exist overall.
     */
    private function candidats(OffreEmploi $offre): Collection
    {
        return ProfilDemandeur::query()
            ->visible()
            ->with('competences')
            ->where(function ($q) use ($offre) {
                $q->where('secteur', 'ilike', $offre->secteur)
                    ->orWhere('ville', 'ilike', $offre->ville);
            })
            ->get();
    }

    /** @return array{obtenu: int, max: int, raison: string, communes?: array<string>} */
    private function scoreCompetences(OffreEmploi $offre, ProfilDemandeur $profil): array
    {
        $max = self::POIDS['competences'];
        $attendues = $this->termesDeLOffre($offre);

        if ($attendues === [] || $profil->competences->isEmpty()) {
            return [
                'obtenu' => 0,
                'max' => $max,
                'raison' => 'Compétences non renseignées',
                'communes' => [],
            ];
        }

        $communes = [];

        foreach ($profil->competences as $competence) {
            $nom = $this->normaliser($competence->nom);

            foreach ($attendues as $terme) {
                // Substring both ways: "PHP" matches "développeur php", and
                // "développement web" matches a "web" requirement.
                if ($nom !== '' && (str_contains($terme, $nom) || str_contains($nom, $terme))) {
                    $communes[] = $competence->nom;
                    break;
                }
            }
        }

        $communes = array_values(array_unique($communes));

        // Three matching skills is treated as a full match; beyond that the
        // signal flattens rather than rewarding padded skill lists.
        $proportion = min(1, count($communes) / 3);
        $obtenu = (int) round($max * $proportion);

        return [
            'obtenu' => $obtenu,
            'max' => $max,
            'raison' => $communes === []
                ? 'Aucune compétence correspondante'
                : count($communes).' compétence(s) en commun : '.implode(', ', array_slice($communes, 0, 5)),
            'communes' => $communes,
        ];
    }

    /** @return array{obtenu: int, max: int, raison: string} */
    private function scoreExperience(OffreEmploi $offre, ProfilDemandeur $profil): array
    {
        $max = self::POIDS['experience'];
        $requise = $this->anneesRequises($offre->experience_requise);

        $mois = $profil->experiences->sum(fn ($e) => $e->dureeEnMois());
        $annees = (int) floor($mois / 12);

        if ($requise === null) {
            // Nothing asked for: credit the candidate rather than penalise them
            // for a field the recruiter left blank.
            return [
                'obtenu' => $max,
                'max' => $max,
                'raison' => 'Aucune expérience minimale exigée',
            ];
        }

        if ($annees >= $requise) {
            return [
                'obtenu' => $max,
                'max' => $max,
                'raison' => "{$annees} an(s) d'expérience pour {$requise} demandé(s)",
            ];
        }

        // Partial credit, so a near-miss still surfaces.
        $obtenu = $requise > 0 ? (int) round($max * ($annees / $requise)) : 0;

        return [
            'obtenu' => $obtenu,
            'max' => $max,
            'raison' => "{$annees} an(s) d'expérience pour {$requise} demandé(s)",
        ];
    }

    /** Pulls the first number out of "3 ans", "Minimum 5 ans", "Débutant". */
    private function anneesRequises(?string $texte): ?int
    {
        if (! $texte) {
            return null;
        }

        if (preg_match('/(\d+)/', $texte, $m)) {
            return (int) $m[1];
        }

        return str_contains($this->normaliser($texte), 'debutant') ? 0 : null;
    }

    /** Words from the offer that a skill could plausibly match. */
    private function termesDeLOffre(OffreEmploi $offre): array
    {
        $texte = $this->normaliser(implode(' ', array_filter([
            $offre->titre,
            $offre->profil_recherche,
            $offre->missions,
        ])));

        // Short words carry no signal and would match almost anything.
        $mots = array_filter(
            preg_split('/[^a-z0-9+#]+/', $texte) ?: [],
            fn ($m) => mb_strlen($m) >= 3,
        );

        return array_values(array_unique($mots));
    }

    private function memeTexte(?string $a, ?string $b): bool
    {
        if (! $a || ! $b) {
            return false;
        }

        return $this->normaliser($a) === $this->normaliser($b);
    }

    /** Lowercase, accents stripped — "Santé" and "sante" must compare equal. */
    private function normaliser(string $texte): string
    {
        $sansAccents = strtr(
            mb_strtolower(trim($texte)),
            ['à' => 'a', 'â' => 'a', 'ä' => 'a', 'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
                'î' => 'i', 'ï' => 'i', 'ô' => 'o', 'ö' => 'o', 'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'ç' => 'c'],
        );

        return preg_replace('/\s+/', ' ', $sansAccents) ?? $sansAccents;
    }
}
