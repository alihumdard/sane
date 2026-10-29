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
     * @param  array<string>  $recherchables  what a free-text query matches
     *                                        against: a column of this table, or a column reached through
     *                                        relations — "entreprise.nom", "candidature.profil.user.name"
     * @param  array<string>  $filtrables  columns accepting an exact-match filter
     * @param  array<string>  $triables  columns that may be sorted on
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
                foreach ($recherchables as $chemin) {
                    /*
                     * A dotted path searches through the relations.
                     *
                     * The lists print what they joined — an interview names
                     * its candidate, its offer and the company — and the
                     * search only ever looked at this table's own columns.
                     * Typing a candidate's name into the box above their own
                     * row returned nothing.
                     */
                    if (! str_contains($chemin, '.')) {
                        $sub->orWhere($chemin, 'ilike', "%{$q}%");

                        continue;
                    }

                    $morceaux = explode('.', $chemin);
                    $colonne = array_pop($morceaux);

                    $sub->orWhereHas(
                        implode('.', $morceaux),
                        fn (Builder $relation) => $relation->where($colonne, 'ilike', "%{$q}%"),
                    );
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
            /*
             * Newest first is the right default for registrations and
             * applications, and the wrong one for a list the organisers have
             * ordered themselves: the FAQ and the programme carry an `ordre`
             * column and a day, and showed neither.
             */
            foreach ($this->triParDefaut() as $colonne => $direction) {
                $query->orderBy($colonne, $direction);
            }
        }

        $parPage = min(max($request->integer('per_page', 10), 1), 100);

        return $query->paginate($parPage)->withQueryString();
    }

    /**
     * How a list is ordered when the request asks for nothing.
     *
     * @return array<string, string> column => asc|desc
     */
    protected function triParDefaut(): array
    {
        return ['id' => 'desc'];
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
