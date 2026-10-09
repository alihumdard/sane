<?php

namespace App\Http\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Shared list behaviour for the admin tables: search, exact-match filters,
 * sorting and pagination, matching what the frontend's useTable hook sends.
 */
trait FiltreLesListes
{
    /**
     * @param  array<string>  $recherchables  columns a free-text query matches against
     * @param  array<string>  $filtrables     columns accepting an exact-match filter
     * @param  array<string>  $triables       columns that may be sorted on
     */
    protected function listePaginee(
        Builder $query,
        Request $request,
        array $recherchables = [],
        array $filtrables = [],
        array $triables = [],
    ): LengthAwarePaginator {
        if ($recherchables && ($q = $request->string('q')->trim()->value())) {
            $query->where(function (Builder $sub) use ($recherchables, $q) {
                foreach ($recherchables as $colonne) {
                    $sub->orWhere($colonne, 'ilike', "%{$q}%");
                }
            });
        }

        foreach ($filtrables as $colonne) {
            if ($valeur = $request->string($colonne)->trim()->value()) {
                $query->where($colonne, $valeur);
            }
        }

        $tri = $request->string('sort')->trim()->value();
        $sens = $request->string('dir')->lower()->value() === 'desc' ? 'desc' : 'asc';

        if ($tri && in_array($tri, $triables, true)) {
            $query->orderBy($tri, $sens);
        } else {
            $query->latest('id');
        }

        $parPage = min(max($request->integer('per_page', 10), 1), 100);

        return $query->paginate($parPage)->withQueryString();
    }

    /** Pagination shape the frontend table reads. */
    protected function meta(LengthAwarePaginator $page): array
    {
        return [
            'total' => $page->total(),
            'page' => $page->currentPage(),
            'per_page' => $page->perPage(),
            'last_page' => $page->lastPage(),
        ];
    }
}
