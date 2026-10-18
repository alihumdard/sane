<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

/**
 * One Excel export shape, driven entirely by data: a column-label map plus
 * an optional row transformer. Every report in the admin back-office reuses
 * this instead of a dedicated Export class per report.
 */
class GenericExport implements FromQuery, WithHeadings, WithMapping
{
    /** @var (callable(object): array<string, mixed>)|null */
    private readonly mixed $transformer;

    /**
     * @param  array<string, string>  $colonnes  header label => attribute path
     * @param  (callable(object): array<string, mixed>)|null  $transformer
     */
    public function __construct(
        private readonly Builder $query,
        private readonly array $colonnes,
        ?callable $transformer = null,
    ) {
        $this->transformer = $transformer;
    }

    public function query(): Builder
    {
        return $this->query;
    }

    public function headings(): array
    {
        return array_keys($this->colonnes);
    }

    public function map($ligne): array
    {
        $valeurs = $this->transformer ? ($this->transformer)($ligne) : $ligne->toArray();

        return array_map(
            fn (string $chemin) => $this->valeur($valeurs, $chemin),
            array_values($this->colonnes),
        );
    }

    /** Reads "offre.titre" out of a nested array, returning '' when absent. */
    private function valeur(array $donnees, string $chemin): string
    {
        $valeur = data_get($donnees, $chemin);

        if (is_bool($valeur)) {
            return $valeur ? 'oui' : 'non';
        }

        if (is_array($valeur)) {
            return implode(', ', $valeur);
        }

        return (string) ($valeur ?? '');
    }
}
