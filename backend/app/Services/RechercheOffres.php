<?php

namespace App\Services;

use App\Enums\TypeContrat;
use App\Models\OffreEmploi;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Public job board search.
 *
 * Everything is resolved in SQL against the indexes added for this table — no
 * collection filtering, no N+1 — so the cost of a search stays flat as the
 * number of offers grows. The keyword branch relies on the pg_trgm GIN indexes;
 * without them a leading-wildcard ilike degrades into a full table scan.
 */
class RechercheOffres
{
    public const PAR_PAGE = 12;

    private const PAR_PAGE_MAX = 50;

    public function paginer(Request $request): LengthAwarePaginator
    {
        $query = OffreEmploi::query()
            ->publiques()
            // Only the company columns the card actually renders.
            ->with('entreprise:id,nom,slug,logo,secteur,ville,verifiee');

        $this->motCle($query, trim((string) $request->query('q', '')));
        $this->filtres($query, $request);
        $this->trier($query, (string) $request->query('tri', 'recentes'));

        $parPage = min((int) $request->integer('par_page') ?: self::PAR_PAGE, self::PAR_PAGE_MAX);

        return $query->paginate($parPage)->withQueryString();
    }

    private function motCle(Builder $query, string $q): void
    {
        if ($q === '') {
            return;
        }

        $query->where(function (Builder $sous) use ($q) {
            $sous->where('titre', 'ilike', "%{$q}%")
                ->orWhere('description', 'ilike', "%{$q}%")
                ->orWhereHas('entreprise', fn (Builder $e) => $e->where('nom', 'ilike', "%{$q}%"));
        });
    }

    private function filtres(Builder $query, Request $request): void
    {
        $query
            ->when($request->filled('secteur'), fn (Builder $q) => $q->where('secteur', $request->query('secteur')))
            ->when($request->filled('ville'), fn (Builder $q) => $q->where('ville', $request->query('ville')))
            ->when($request->filled('type_contrat'), fn (Builder $q) => $q->where('type_contrat', $request->query('type_contrat')))
            ->when($request->filled('salaire_min'), fn (Builder $q) => $q->where('salaire_max', '>=', $request->integer('salaire_min')));
    }

    private function trier(Builder $query, string $tri): void
    {
        match ($tri) {
            'salaire' => $query->orderByDesc('salaire_max')->orderByDesc('publiee_le'),
            'populaires' => $query->orderByDesc('vues')->orderByDesc('publiee_le'),
            // Matches the partial index on (publiee_le DESC) WHERE statut = 'publiee'.
            default => $query->orderByDesc('publiee_le')->orderByDesc('id'),
        };
    }

    /**
     * Filter options with live counts, built in one grouped query per column
     * rather than one query per value.
     *
     * @return array<string, mixed>
     */
    public function filtresDisponibles(): array
    {
        return [
            'secteur' => $this->compter('secteur'),
            'ville' => $this->compter('ville'),
            'type_contrat' => $this->compter('type_contrat'),
        ];
    }

    private function compter(string $colonne): array
    {
        return OffreEmploi::query()
            ->publiques()
            ->selectRaw("{$colonne} as valeur, count(*) as total")
            ->whereNotNull($colonne)
            ->groupBy($colonne)
            ->orderByDesc('total')
            ->get()
            ->map(fn ($ligne) => [
                // The query still filters on the stored value; `libelle` is only
                // what the dropdown shows, so an enum column reads "Stage"
                // rather than the "stage" it is stored as.
                'valeur' => $ligne->valeur,
                'libelle' => $this->libelle($colonne, $ligne->valeur),
                'total' => (int) $ligne->total,
            ])
            ->all();
    }

    private function libelle(string $colonne, string $valeur): string
    {
        if ($colonne !== 'type_contrat') {
            return $valeur;
        }

        return TypeContrat::tryFrom($valeur)?->label() ?? $valeur;
    }
}
