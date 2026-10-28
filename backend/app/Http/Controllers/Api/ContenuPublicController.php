<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actualite;
use App\Models\ArticlePresse;
use App\Models\FaqEntree;
use App\Models\Partenaire;
use App\Models\SessionProgramme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Editorial content for the public site.
 *
 * Replaces the hardcoded data.ts files, so organisers can change what the
 * site says from the back office rather than through a deploy.
 */
class ContenuPublicController extends Controller
{
    public function actualites(Request $request): JsonResponse
    {
        $query = Actualite::publiques()
            ->select(['id', 'titre', 'slug', 'categorie', 'extrait', 'image', 'auteur', 'publiee_le']);

        if ($categorie = $request->string('categorie')->trim()->value()) {
            $query->where('categorie', $categorie);
        }

        $page = $query->paginate(min($request->integer('per_page') ?: 9, 30));

        return response()->json([
            'data' => $page->items(),
            'meta' => [
                'total' => $page->total(),
                'page' => $page->currentPage(),
                'per_page' => $page->perPage(),
                'last_page' => $page->lastPage(),
            ],
            'categories' => Actualite::publiques()
                ->selectRaw('categorie, count(*) as total')
                ->reorder()
                ->groupBy('categorie')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($l) => ['valeur' => $l->categorie, 'total' => (int) $l->total]),
        ]);
    }

    public function actualite(string $slug): JsonResponse
    {
        $actualite = Actualite::publiques()->where('slug', $slug)->firstOrFail();

        // Bare increment: a view count must not touch updated_at or fire model
        // events, and must not lose a concurrent edit of the article.
        DB::table('actualites')->where('id', $actualite->id)->increment('vues');

        return response()->json(['data' => $actualite]);
    }

    /** Grouped by category, which is how the FAQ page renders it. */
    public function faq(): JsonResponse
    {
        $entrees = FaqEntree::publiques()->get(['id', 'categorie', 'question', 'reponse', 'ordre']);

        return response()->json([
            'data' => $entrees,
            'categories' => $entrees->pluck('categorie')->unique()->values(),
        ]);
    }

    public function partenaires(): JsonResponse
    {
        return response()->json([
            'data' => Partenaire::publics()->get(['id', 'nom', 'slug', 'type', 'logo', 'site_web', 'description']),
        ]);
    }

    /**
     * The schedule, grouped by day.
     *
     * Grouped here rather than on the page: the page shows one day at a time
     * with its tabs, and the grouping is the same wherever it is read from.
     */
    public function programme(): JsonResponse
    {
        $jours = SessionProgramme::publiques()->get()
            ->groupBy(fn (SessionProgramme $s) => $s->jour->toDateString())
            ->map(fn ($sessions, $jour) => [
                'jour' => $jour,
                'sessions' => $sessions->map(fn (SessionProgramme $s) => [
                    'id' => $s->id,
                    'heure_debut' => substr((string) $s->heure_debut, 0, 5),
                    'heure_fin' => $s->heure_fin ? substr((string) $s->heure_fin, 0, 5) : null,
                    'titre' => $s->titre,
                    'description' => $s->description,
                    'categorie' => $s->categorie,
                    'lieu' => $s->lieu,
                    'intervenants' => $s->intervenants,
                    'image_url' => $s->image_url,
                ])->values(),
            ])
            ->values();

        return response()->json(['data' => $jours]);
    }

    public function presse(): JsonResponse
    {
        return response()->json([
            'data' => ArticlePresse::publics()->get(['id', 'titre', 'media', 'type', 'date_publication', 'lien', 'fichier', 'resume']),
        ]);
    }
}
