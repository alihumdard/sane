<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * CSV export, streamed.
 *
 * Written by hand rather than pulling in a spreadsheet package: the contract
 * asks for Excel/CSV, Excel opens CSV natively, and a dependency that loads a
 * whole workbook into memory is the wrong tool for exporting thousands of
 * registrations on a small server.
 *
 * Rows are streamed through a cursor, so memory stays flat regardless of how
 * many there are.
 */
class ExportCsv
{
    /**
     * @param  array<string, string>  $colonnes  header label => attribute path
     * @param  callable(object): array<string, mixed>|null  $transformer
     */
    public function telecharger(
        Builder $query,
        array $colonnes,
        string $nomFichier,
        ?callable $transformer = null,
    ): StreamedResponse {
        return response()->streamDownload(function () use ($query, $colonnes, $transformer) {
            $sortie = fopen('php://output', 'wb');

            // BOM so Excel opens accented French text as UTF-8 rather than
            // mojibake — without it "Référence" arrives as "RÃ©fÃ©rence".
            fwrite($sortie, "\xEF\xBB\xBF");

            fputcsv($sortie, array_keys($colonnes), ';');

            // chunk() rather than get(): the result set never lands in memory
            // whole, which matters once exports run to thousands of rows.
            $query->chunk(500, function ($lot) use ($sortie, $colonnes, $transformer) {
                foreach ($lot as $ligne) {
                    $valeurs = $transformer ? $transformer($ligne) : $ligne->toArray();

                    fputcsv(
                        $sortie,
                        array_map(
                            fn (string $chemin) => $this->valeur($valeurs, $chemin),
                            array_values($colonnes),
                        ),
                        ';',
                    );
                }
            });

            fclose($sortie);
        }, $nomFichier, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
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
