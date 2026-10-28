<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticlePresse;
use App\Models\Edition;
use App\Models\Entreprise;
use App\Models\FaqEntree;
use App\Models\Formateur;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\OffreEmploi;
use App\Models\Partenaire;
use App\Models\SessionProgramme;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/**
 * The figures the public pages print under their headings.
 *
 * Every one of them used to be written into the front-end: "+500 Offres
 * d'emploi" and "+200 Entreprises" beside twelve real offers, "+0 Postes à
 * pourvoir" and "+0 Secteurs" that looked live and sat at zero, and "+48"
 * press mentions against four records. A visitor reads one of those numbers
 * and either believes it or notices the zero.
 *
 * Cached for a few minutes: these are headline counts on pages anyone can
 * open, and a burst of traffic should not become a burst of COUNT queries.
 */
class StatistiquePubliqueController extends Controller
{
    private const DUREE_CACHE = 300;

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Cache::remember('statistiques.publiques', self::DUREE_CACHE, fn () => $this->calculer()),
        ]);
    }

    private function calculer(): array
    {
        $edition = Edition::active();

        /*
         * Counted exactly as the offers list counts them — published and not
         * past their closing date. Counting only on the status put 15 in the
         * hero above a list of 12, and 12 sectors above a filter offering 10.
         */
        $offresPubliees = OffreEmploi::query()->publiques();

        return [
            'edition' => $edition ? [
                'annee' => $edition->annee,
                'nom' => $edition->nom,
                'date_debut' => $edition->date_debut?->toDateString(),
                'date_fin' => $edition->date_fin?->toDateString(),
                'lieu' => $edition->lieu,
            ] : null,

            'emploi' => [
                'offres' => (clone $offresPubliees)->count(),
                'entreprises' => Entreprise::where('verifiee', true)->count(),
                'secteurs' => (clone $offresPubliees)->distinct()->count('secteur'),
            ],

            'programme' => [
                'sessions' => SessionProgramme::where('publiee', true)->count(),
                'jours' => SessionProgramme::where('publiee', true)->distinct()->count('jour'),
            ],

            'formations' => [
                'total' => Formation::where('publiee', true)->count(),
                'places' => (int) Formation::where('publiee', true)->sum('max_inscriptions'),
                'formateurs' => Formateur::count(),
            ],

            'participation' => [
                'inscriptions' => Inscription::count(),
                'partenaires' => Partenaire::where('publie', true)->count(),
            ],

            'presse' => [
                'articles' => ArticlePresse::where('publie', true)->count(),
                'medias' => ArticlePresse::where('publie', true)->distinct()->count('media'),
            ],

            'faq' => [
                'questions' => FaqEntree::where('publiee', true)->count(),
                'categories' => FaqEntree::where('publiee', true)->distinct()->count('categorie'),
            ],
        ];
    }
}
